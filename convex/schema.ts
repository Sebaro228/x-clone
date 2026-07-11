import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  // Підключаємо системні таблиці Convex Auth (користувачі, сесії тощо)
  ...authTables,

  // Розширюємо стандартну таблицю users з Convex Auth
  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    username: v.optional(v.string()),
    fullname: v.optional(v.string()),
    bio: v.optional(v.string()),
    followersCount: v.optional(v.number()),
    followingCount: v.optional(v.number()),
    tweetsCount: v.optional(v.number()),
  }).index("by_email", ["email"]),

  // Таблиця для твітів (постів)
  tweets: defineTable({
    userId: v.id("users"), // Автор твіту
    text: v.string(), // Текст твіту
    imageUrl: v.optional(v.string()), // Необов'язкове посилання на зображення в сховищі
    storageId: v.optional(v.id("_storage")), // Необов'язковий ID файлу
    likes: v.number(),
    retweets: v.number(),
    comments: v.number(),
  }).index("by_user", ["userId"]),

  // Таблиця лайків на твіти
  likes: defineTable({
    userId: v.id("users"),
    tweetId: v.id("tweets"),
  })
    .index("by_tweet", ["tweetId"])
    .index("by_user_and_tweet", ["userId", "tweetId"]),

  // Таблиця підписок на користувачів
  follows: defineTable({
    followerId: v.id("users"), // Хто підписується
    followingId: v.id("users"), // На кого підписується
  })
    .index("by_follower", ["followerId"])
    .index("by_following", ["followingId"])
    .index("by_both", ["followerId", "followingId"]),

  // Таблиця збережених твітів (Bookmarks)
  bookmarks: defineTable({
    userId: v.id("users"),
    tweetId: v.id("tweets"),
  })
    .index("by_user", ["userId"])
    .index("by_tweet", ["tweetId"])
    .index("by_both", ["userId", "tweetId"]),

  // Таблиця коментарів до твітів
  comments: defineTable({
    userId: v.id("users"),   // Автор коментаря
    tweetId: v.id("tweets"), // ID твіту, під яким залишено коментар
    content: v.string(),     // Текст коментаря
  }).index("by_tweet", ["tweetId"]),

  // Таблиця історій (Stories)
  stories: defineTable({
    userId: v.id("users"),
    imageUrl: v.string(),
    storageId: v.id("_storage"),
    expiresAt: v.number(), // Timestamp закінчення дії історії (24 години)
    views: v.number(),     // Кількість переглядів
  })
    .index("by_user", ["userId"])
    .index("by_expires", ["expiresAt"]),
});