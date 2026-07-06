import { StyleSheet, Dimensions } from "react-native";
import { COLORS } from "@/constants/theme";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.surfaceLight,
  },
  cancelText: {
    color: COLORS.white,
    fontSize: 16,
  },
  postButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postButtonDisabled: {
    opacity: 0.5,
  },
  postButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "bold",
  },
  content: {
    flex: 1,
    flexDirection: "row",
    padding: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  inputSection: {
    flex: 1,
  },
  textInput: {
    color: COLORS.white,
    fontSize: 18,
    minHeight: 100,
    textAlignVertical: "top",
  },
  imagePreviewContainer: {
    position: "relative",
    marginTop: 15,
    borderRadius: 14,
    overflow: "hidden",
    maxWidth: width - 84,
    height: 200,
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  toolbar: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 0.5,
    borderTopColor: COLORS.surfaceLight,
    alignItems: "center",
    gap: 20,
  },
  toolbarIcon: {
    color: COLORS.primary,
  },
});