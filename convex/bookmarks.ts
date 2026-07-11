import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { getAuthUserId } from "@convex-dev/auth/server";

/**
 * Додає або видаляє твіт із закладок
 */
export const toggleBookmark = mutation({
  args: {
    tweetId: v.id("tweets"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (userId === null) {
      throw new Error("Unauthorized: Неавторизований доступ");
    }

    // Перевіряємо наявність у закладках
    const existingBookmark = await ctx.db
      .query("bookmarks")
      .withIndex("by_both", (q) =>
        q.eq("userId", userId).eq("tweetId", args.tweetId)
      )
      .first();

    if (existingBookmark) {
      // Видаляємо із закладок
      await ctx.db.delete(existingBookmark._id);
      return false; // unbookmarked
    } else {
      // Додаємо в закладки
      await ctx.db.insert("bookmarks", {
        userId,
        tweetId: args.tweetId,
      });
      return true; // bookmarked
    }
  },
});