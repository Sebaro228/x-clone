import { 
  Text, 
  View, 
  TouchableOpacity, 
  Alert, 
  ActivityIndicator, 
  TextInput, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView 
} from "react-native";
import { styles } from "@/styles/auth.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";

export default function LoginScreen() {
  const { signIn } = useAuthActions();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Помилка", "Будь ласка, заповніть обов'язкові поля.");
      return;
    }

    if (isSignUp && !name.trim()) {
      Alert.alert("Помилка", "Будь ласка, вкажіть ім'я.");
      return;
    }

    setIsLoading(true);
    try {
      if (isSignUp) {
        await signIn("password", {
          email,
          password,
          name,
          flow: "signUp",
        });
        Alert.alert("Успіх", "Акаунт створено!");
      } else {
        await signIn("password", {
          email,
          password,
          flow: "signIn",
        });
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Помилка", isSignUp ? "Пошта вже зайнята." : "Неправильний email або пароль.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={styles.brandSection}>
          <View style={styles.logoContainer}>
            <Ionicons name="logo-twitter" size={36} color={COLORS.primary} />
          </View>
          <Text style={styles.appName}>X Clone</Text>
          <Text style={styles.tagline}>
            {isSignUp ? "Join X today" : "See what's happening now"}
          </Text>
        </View>

        <View style={styles.formContainer}>
          {isSignUp && (
            <View style={styles.inputWrapper}>
              <Ionicons name="person-outline" size={20} color={COLORS.grey} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Ім'я"
                placeholderTextColor={COLORS.grey}
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          )}

          <View style={styles.inputWrapper}>
            <Ionicons name="mail-outline" size={20} color={COLORS.grey} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={COLORS.grey}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.grey} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Пароль"
              placeholderTextColor={COLORS.grey}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <TouchableOpacity
            style={[styles.submitButton, isLoading && { opacity: 0.6 }]}
            activeOpacity={0.9}
            onPress={handleAuth}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.surface} size="small" />
            ) : (
              <Text style={styles.submitButtonText}>
                {isSignUp ? "Зареєструватися" : "Увійти"}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)} style={styles.toggleButton}>
            <Text style={styles.toggleButtonText}>
              {isSignUp ? "Вже є акаунт? Увійти" : "Немає акаунту? Зареєструватися"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}