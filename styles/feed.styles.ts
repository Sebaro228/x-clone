import { COLORS } from "@/constants/theme";
import { Dimensions, Platform, StyleSheet } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.surfaceLight,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.white,
  },
  storiesContainer: {
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.surfaceLight,
  },
  storyWrapper: {
    alignItems: "center",
    marginHorizontal: 8,
    width: 72,
  },
  storyRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    padding: 2,
    backgroundColor: COLORS.background,
    borderWidth: 2,
    borderColor: COLORS.primary,
    marginBottom: 4,
  },
  noStory: {
    borderColor: COLORS.grey,
  },
  storyAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  storyUsername: {
    fontSize: 11,
    color: COLORS.white,
    textAlign: "center",
  },
  tweet: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.surfaceLight,
    flexDirection: "row",
  },
  tweetLeft: {
    marginRight: 12,
  },
  tweetRight: {
    flex: 1,
  },
  tweetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  tweetHeaderInfo: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 4,
  },
  fullname: {
    fontSize: 15,
    fontWeight: "bold",
    color: COLORS.white,
  },
  username: {
    fontSize: 14,
    color: COLORS.grey,
  },
  dot: {
    fontSize: 14,
    color: COLORS.grey,
  },
  timeAgo: {
    fontSize: 14,
    color: COLORS.grey,
  },
  tweetAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
  },
  tweetText: {
    fontSize: 15,
    lineHeight: 20,
    color: COLORS.white,
    marginBottom: 10,
  },
  tweetImage: {
    width: "100%",
    height: 200,
    borderRadius: 14,
    marginBottom: 10,
  },
  tweetActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
    paddingRight: 24,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionText: {
    fontSize: 13,
    color: COLORS.grey,
  },
  modalContainer: {
    backgroundColor: COLORS.background,
    marginBottom: Platform.OS === "ios" ? 44 : 0,
    flex: 1,
    marginTop: Platform.OS === "ios" ? 44 : 0,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.surfaceLight,
  },
  modalTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600",
  },
  commentsList: {
    flex: 1,
  },
  commentContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.surfaceLight,
  },
  commentAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentUsername: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 2,
  },
  commentText: {
    color: COLORS.white,
    fontSize: 14,
    lineHeight: 18,
  },
  commentTime: {
    color: COLORS.grey,
    fontSize: 12,
    marginTop: 4,
  },
  commentInput: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.surfaceLight,
    backgroundColor: COLORS.background,
  },
  input: {
    flex: 1,
    color: COLORS.white,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 12,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    fontSize: 14,
  },
  postButton: {
    color: COLORS.primary,
    fontWeight: "600",
    fontSize: 14,
  },
  postButtonDisabled: {
    opacity: 0.5,
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
});