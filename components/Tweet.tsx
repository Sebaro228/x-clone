import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { styles } from "@/styles/feed.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { Id } from "@/convex/_generated/dataModel";
import { CommentsModal } from "./CommentsModal";
import { formatDistanceToNow } from "date-fns";

export type TweetProps = {
  tweet: {
    _id: Id<"tweets">;
    userId: Id<"users">;
    text: string;
    imageUrl?: string;
    likes: number;
    comments: number;
    _creationTime: number;
    isLiked: boolean;
    isBookmarked: boolean;
    author: {
      _id: string;
      username: string;
      fullname: string;
      image: string;
    };
  };
};

export const Tweet = ({ tweet }: TweetProps) => {
  const currentUser = useQuery(api.users.currentUser);

  // Стан для миттєвого оновлення UI
  const [isLiked, setIsLiked] = useState(tweet.isLiked);
  const [likesCount, setLikesCount] = useState(tweet.likes);
  const [isBookmarked, setIsBookmarked] = useState(tweet.isBookmarked);
  const [commentsCount, setCommentsCount] = useState(tweet.comments);
  const [showComments, setShowComments] = useState(false);

  // Mutations
  const toggleLike = useMutation(api.tweets.toggleLike);
  const toggleBookmark = useMutation(api.bookmarks.toggleBookmark);
  const deleteTweet = useMutation(api.tweets.deleteTweet);

  // Обробник лайків з оптимістичним оновленням
  const handleLike = async () => {
    try {
      const nextIsLiked = !isLiked;
      setIsLiked(nextIsLiked);
      setLikesCount((prev) => (nextIsLiked ? prev + 1 : Math.max(0, prev - 1)));

      const serverIsLiked = await toggleLike({ tweetId: tweet._id });
      
      if (serverIsLiked !== nextIsLiked) {
        setIsLiked(serverIsLiked);
        setLikesCount((prev) => (serverIsLiked ? prev + 1 : Math.max(0, prev - 1)));
      }
    } catch (error) {
      console.error(error);
      setIsLiked(tweet.isLiked);
      setLikesCount(tweet.likes);
    }
  };

  // Обробник закладок
  const handleBookmark = async () => {
    try {
      setIsBookmarked(!isBookmarked);
      await toggleBookmark({ tweetId: tweet._id });
    } catch (error) {
      console.error(error);
      setIsBookmarked(tweet.isBookmarked);
    }
  };

  // Обробник видалення
  const handleDelete = () => {
    Alert.alert(
      "Delete Tweet",
      "Are you sure you want to delete this tweet?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteTweet({ tweetId: tweet._id });
              Alert.alert("Success", "Tweet deleted successfully.");
            } catch (error) {
              console.error(error);
              Alert.alert("Error", "Failed to delete tweet.");
            }
          },
        },
      ]
    );
  };

  const isOwner = currentUser?._id === tweet.userId;

  return (
    <View style={styles.tweet}>
      {/* Ліва частина: Аватар */}
      <View style={styles.tweetLeft}>
        <Image source={{ uri: tweet.author.image }} style={styles.tweetAvatar} />
      </View>

      {/* Права частина: Вміст твіту */}
      <View style={styles.tweetRight}>
        <View style={styles.tweetHeader}>
          <View style={styles.tweetHeaderInfo}>
            <Text style={styles.fullname}>{tweet.author.fullname}</Text>
            <Text style={styles.username}>@{tweet.author.username}</Text>
            <Text style={styles.dot}>·</Text>
            <Text style={styles.timeAgo}>
              {formatDistanceToNow(tweet._creationTime, { addSuffix: false })}
            </Text>
          </View>
          
          {/* Кнопка видалення показується лише власнику */}
          {isOwner && (
            <TouchableOpacity onPress={handleDelete}>
              <Ionicons name="trash-outline" size={16} color={COLORS.grey} />
            </TouchableOpacity>
          )}
        </View>

        {/* Текст твіту */}
        <Text style={styles.tweetText}>{tweet.text}</Text>

        {/* Зображення твіту */}
        {tweet.imageUrl && (
          <Image
            source={{ uri: tweet.imageUrl }}
            style={styles.tweetImage}
            resizeMode="cover"
          />
        )}

        {/* Панель дій */}
        <View style={styles.tweetActions}>
          <TouchableOpacity style={styles.actionButton} onPress={() => setShowComments(true)}>
            <Ionicons name="chatbubble-outline" size={18} color={COLORS.grey} />
            <Text style={styles.actionText}>{commentsCount}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleLike}>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={18}
              color={isLiked ? "#e53e3e" : COLORS.grey}
            />
            <Text style={[styles.actionText, isLiked && { color: "#e53e3e" }]}>
              {likesCount}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleBookmark}>
            <Ionicons
              name={isBookmarked ? "bookmark" : "bookmark-outline"}
              size={18}
              color={isBookmarked ? COLORS.primary : COLORS.grey}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Модальне вікно відповідей */}
      {showComments && (
        <CommentsModal
          tweetId={tweet._id}
          visible={showComments}
          onClose={() => setShowComments(false)}
          onCommentsCountChange={setCommentsCount}
        />
      )}
    </View>
  );
};