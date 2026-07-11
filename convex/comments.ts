import { mutation, query } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Додає коментар (відповідь) до твіту
 */
export const addComment = mutation({
  args: {
    content: v.string(),
    tweetId: v.id("tweets"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Unauthorized: Неавторизований доступ");
    }

    const tweet = await ctx.db.get(args.tweetId);
    if (!tweet) throw new ConvexError("Твіт не знайдено");

    // Створюємо коментар
    const commentId = await ctx.db.insert("comments", {
      userId,
      tweetId: args.tweetId,
      content: args.content,
    });

    // Оновлюємо кількість коментарів у твіті
    await ctx.db.patch(args.tweetId, {
      comments: tweet.comments + 1,
    });

    return commentId;
  },
});

/**
 * Отримує всі коментарі до твіту разом із профілями користувачів
 */
export const getComments = query({
  args: {
    tweetId: v.id("tweets"),
  },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_tweet", (q) => q.eq("tweetId", args.tweetId))
      .collect();

    // Завантажуємо профілі користувачів
    const commentsWithUsers = await Promise.all(
      comments.map(async (comment) => {
        const user = await ctx.db.get(comment.userId);
        return {
          ...comment,
          user: {
            fullname: user?.fullname ?? user?.name ?? "Без імені",
            image: user?.image ?? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde",
          },
        };
      })
    );

    return commentsWithUsers;
  },
});