import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { styles } from "@/styles/feed.styles";
import { Tweet } from "@/components/Tweet";
import { StoriesSection } from "@/components/StoriesSection"; // Додано імпорт
import { useAuthActions } from "@convex-dev/auth/react";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";

export default function HomeScreen() {
  const tweets = useQuery(api.tweets.getTweets);
  const { signOut } = useAuthActions();

  if (tweets === undefined) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Home</Text>
        <TouchableOpacity onPress={() => signOut()}>
          <Ionicons name="log-out-outline" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      {/* FEED (Стрічка твітів) */}
      <FlatList
        data={tweets}
        renderItem={({ item }) => <Tweet tweet={item} />}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={<StoriesSection />} // Додано StoriesSection
        ListEmptyComponent={
          <View style={[styles.centered, { marginTop: 40 }]}>
            <Text style={{ color: COLORS.grey, fontSize: 16 }}>Твітів ще немає</Text>
          </View>
        }
      />
    </View>
  );
}