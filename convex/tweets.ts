import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Генерує тимчасове посилання для завантаження файлу в Convex Storage
 */
export const generateUploadUrl = mutation(async (ctx) => {
  const userId = await getAuthUserId(ctx);
  if (userId === null) {
    throw new Error("Unauthorized: Неавторизований доступ");
  }
  return await ctx.storage.generateUploadUrl();
});

/**
 * Створює новий твіт у базі даних
 */
export const createTweet = mutation({
  args: {
    text: v.string(), // Текст твіту є обов'язковим
    storageId: v.optional(v.id("_storage")), // Зображення є необов'язковим
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Unauthorized: Неавторизований доступ");
    }

    const currentUser = await ctx.db.get(userId);
    if (!currentUser) {
      throw new Error("User not found: Користувача не знайдено");
    }

    let imageUrl = undefined;
    if (args.storageId) {
      // Отримуємо публічне посилання на завантажене зображення
      const url = await ctx.storage.getUrl(args.storageId);
      if (url) {
        imageUrl = url;
      }
    }

    // Зберігаємо запис у таблицю "tweets"
    const tweetId = await ctx.db.insert("tweets", {
      userId,
      text: args.text,
      imageUrl,
      storageId: args.storageId,
      likes: 0,
      retweets: 0,
      comments: 0,
    });

    // Оновлюємо кількість постів користувача
    await ctx.db.patch(userId, {
      tweetsCount: (currentUser.tweetsCount ?? 0) + 1,
    });

    return tweetId;
  },
});
import { query } from "./_generated/server";

/**
 * Отримує список всіх твітів з інформацією про автора, лайки та закладки
 */
export const getTweets = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      return [];
    }

    // Отримуємо твіти, спочатку новіші
    const tweets = await ctx.db.query("tweets").order("desc").collect();

    if (tweets.length === 0) return [];

    const tweetsWithInfo = await Promise.all(
      tweets.map(async (tweet) => {
        const author = await ctx.db.get(tweet.userId);

        // Перевіряємо лайк від поточного юзера
        const like = await ctx.db
          .query("likes")
          .withIndex("by_user_and_tweet", (q) =>
            q.eq("userId", userId).eq("tweetId", tweet._id)
          )
          .first();

        // Перевіряємо закладку
        const bookmark = await ctx.db
          .query("bookmarks")
          .withIndex("by_both", (q) =>
            q.eq("userId", userId).eq("tweetId", tweet._id)
          )
          .first();

        return {
          ...tweet,
          author: {
            _id: author?._id,
            username: author?.username ?? "user",
            fullname: author?.fullname ?? author?.name ?? "Без імені",
            image: author?.image ?? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
          },
          isLiked: !!like,
          isBookmarked: !!bookmark,
        };
      })
    );

    return tweetsWithInfo;
  },
});
/**
 * Перемикає лайк на твіті (додає або видаляє)
 */
export const toggleLike = mutation({
  args: {
    tweetId: v.id("tweets"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Unauthorized: Неавторизований доступ");
    }

    const tweet = await ctx.db.get(args.tweetId);
    if (!tweet) throw new Error("Твіт не знайдено");

    // Перевіряємо, чи є вже лайк від цього користувача
    const existingLike = await ctx.db
      .query("likes")
      .withIndex("by_user_and_tweet", (q) =>
        q.eq("userId", userId).eq("tweetId", args.tweetId)
      )
      .first();

    if (existingLike) {
      // Видаляємо лайк
      await ctx.db.delete(existingLike._id);
      await ctx.db.patch(args.tweetId, {
        likes: Math.max(0, tweet.likes - 1),
      });
      return false; // Повертаємо false (лайк прибрано)
    } else {
      // Додаємо лайк
      await ctx.db.insert("likes", {
        userId,
        tweetId: args.tweetId,
      });
      await ctx.db.patch(args.tweetId, {
        likes: tweet.likes + 1,
      });
      return true; // Повертаємо true (лайк поставлено)
    }
  },
});

export const deleteTweet = mutation({
  args: {
    tweetId: v.id("tweets"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Unauthorized: Неавторизований доступ");
    }

    const tweet = await ctx.db.get(args.tweetId);
    if (!tweet) throw new Error("Твіт не знайдено");

    // Перевіряємо, чи видаляє саме автор
    if (tweet.userId !== userId) {
      throw new Error("Немає прав для видалення цього твіту");
    }

    // 1. Видаляємо всі пов'язані лайки
    const likes = await ctx.db
      .query("likes")
      .withIndex("by_tweet", (q) => q.eq("tweetId", args.tweetId))
      .collect();
    for (const like of likes) {
      await ctx.db.delete(like._id);
    }

    // 2. Видаляємо всі пов'язані коментарі
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_tweet", (q) => q.eq("tweetId", args.tweetId))
      .collect();
    for (const comment of comments) {
      await ctx.db.delete(comment._id);
    }

    // 3. Видаляємо всі пов'язані закладки
    const bookmarks = await ctx.db
      .query("bookmarks")
      .withIndex("by_tweet", (q) => q.eq("tweetId", args.tweetId))
      .collect();
    for (const bookmark of bookmarks) {
      await ctx.db.delete(bookmark._id);
    }

    // 4. Видаляємо зображення зі сховища (якщо воно є)
    if (tweet.storageId) {
      await ctx.storage.delete(tweet.storageId);
    }

    // 5. Видаляємо сам твіт
    await ctx.db.delete(args.tweetId);

    // 6. Зменшуємо лічильник твітів користувача
    const currentUser = await ctx.db.get(userId);
    if (currentUser) {
      await ctx.db.patch(userId, {
        tweetsCount: Math.max(0, (currentUser.tweetsCount ?? 1) - 1),
      });
    }
  },
});