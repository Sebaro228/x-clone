import { StyleSheet } from "react-native";
import { COLORS } from "@/constants/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  brandSection: {
    alignItems: "center",
    marginTop: 80,
    marginBottom: 40,
  },
  logoContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  appName: {
    fontSize: 32,
    fontWeight: "bold",
    color: COLORS.white,
    marginTop: 16,
  },
  tagline: {
    fontSize: 16,
    color: COLORS.grey,
    marginTop: 8,
  },
  formContainer: {
    paddingHorizontal: 24,
    gap: 16,
    width: "100%",
    alignItems: "center",
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.surfaceLight,
    paddingHorizontal: 16,
    width: "100%",
    maxWidth: 320,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    fontSize: 16,
    color: COLORS.white,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.white,
    borderRadius: 24,
    paddingVertical: 14,
    width: "100%",
    maxWidth: 320,
    marginTop: 10,
  },
  submitButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: "bold",
  },
  toggleButton: {
    marginTop: 15,
  },
  toggleButtonText: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "500",
  },
});