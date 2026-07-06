import { View, Text, ActivityIndicator, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { COLORS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileScreen() {
  const user = useQuery(api.users.currentUser);

  if (user === undefined) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (user === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Будь ласка, увійдіть у додаток</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Шапка/обкладинка профілю (сірий фон за замовчуванням у стилі X) */}
      <View style={styles.coverPhoto} />

      <View style={styles.profileInfoSection}>
        {/* Аватарка */}
        <Image
          source={{ uri: user.image ?? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde" }}
          style={styles.avatar}
        />

        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit profile</Text>
        </TouchableOpacity>

        {/* Ім'я та нікнейм */}
        <Text style={styles.nameText}>{user.name ?? user.fullname ?? "Без імені"}</Text>
        <Text style={styles.usernameText}>@{user.username ?? "user"}</Text>

        {/* Опис профілю */}
        <Text style={styles.bioText}>
          {user.bio ?? "Опис профілю відсутній. Натисніть кнопку 'Edit profile', щоб додати опис."}
        </Text>

        {/* Дата приєднання */}
        <View style={styles.joinDateContainer}>
          <Ionicons name="calendar-outline" size={16} color={COLORS.grey} />
          <Text style={styles.joinDateText}>Joined June 2026</Text>
        </View>

        {/* Статистика підписників */}
        <View style={styles.statsContainer}>
          <Text style={styles.statNumber}>{user.followingCount ?? 0} <Text style={styles.statLabel}>Following</Text></Text>
          <Text style={styles.statNumber}>{user.followersCount ?? 0} <Text style={styles.statLabel}>Followers</Text></Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  coverPhoto: {
    height: 120,
    backgroundColor: COLORS.surface,
  },
  profileInfoSection: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: COLORS.background,
    marginTop: -45,
  },
  editButton: {
    alignSelf: "flex-end",
    borderColor: COLORS.grey,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginTop: -30,
  },
  editButtonText: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 14,
  },
  nameText: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
  },
  usernameText: {
    color: COLORS.grey,
    fontSize: 15,
    marginTop: 2,
  },
  bioText: {
    color: COLORS.white,
    fontSize: 15,
    marginTop: 12,
    lineHeight: 20,
  },
  joinDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 6,
  },
  joinDateText: {
    color: COLORS.grey,
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: "row",
    marginTop: 15,
    gap: 20,
  },
  statNumber: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "bold",
  },
  statLabel: {
    color: COLORS.grey,
    fontWeight: "normal",
  },
  text: {
    color: COLORS.white,
  },
});