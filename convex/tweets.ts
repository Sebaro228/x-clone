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