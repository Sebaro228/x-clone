import { 
  View, 
  Text, 
  TouchableOpacity, 
  Image, 
  TextInput, 
  ActivityIndicator, 
  Alert, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView 
} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { COLORS } from "@/constants/theme";
import { styles } from "@/styles/create.styles";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";

export default function CreateScreen() {
  const router = useRouter();
  
  const currentUser = useQuery(api.users.currentUser);
  const generateUploadUrl = useMutation(api.tweets.generateUploadUrl);
  const createTweet = useMutation(api.tweets.createTweet);

  const [text, setText] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);

  // Вибір зображення з галереї
  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Помилка", "Додаток потребує дозволу на доступ до фото.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  // Публікація твіту
  const handlePost = async () => {
    if (!text.trim() && !selectedImage) {
      Alert.alert("Помилка", "Твіт не може бути порожнім.");
      return;
    }

    setIsPosting(true);

    try {
      let storageId = undefined;

      // Якщо користувач обрав картинку, завантажуємо її у Convex Storage
      if (selectedImage) {
        // Крок А: Отримуємо тимчасову адресу для завантаження
        const uploadUrl = await generateUploadUrl();

        // Крок Б: Відправляємо файл за допомогою FileSystem.uploadAsync
        const uploadResult = await FileSystem.uploadAsync(uploadUrl, selectedImage, {
          httpMethod: "POST",
          uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
          headers: {
            "Content-Type": "image/jpeg",
          },
        });

        if (uploadResult.status !== 200) {
          throw new Error("Не вдалося завантажити зображення");
        }

        // Крок В: Отримуємо storageId з відповіді Convex
        const responseData = JSON.parse(uploadResult.body);
        storageId = responseData.storageId;
      }

      // Зберігаємо твіт
      await createTweet({
        text,
        storageId,
      });

      Alert.alert("Успіх", "Твіт успішно опубліковано!");
      setText("");
      setSelectedImage(null);
      router.replace("/(tabs)");
    } catch (error) {
      console.error(error);
      Alert.alert("Помилка", "Не вдалося зберегти твіт. Спробуйте пізніше.");
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* Шапка */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.postButton, (!text.trim() && !selectedImage) && styles.postButtonDisabled]}
          onPress={handlePost}
          disabled={isPosting || (!text.trim() && !selectedImage)}
        >
          {isPosting ? (
            <ActivityIndicator color={COLORS.white} size="small" />
          ) : (
            <Text style={styles.postButtonText}>Post</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Робоча зона */}
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={styles.content}>
          <Image
            source={{ uri: currentUser?.image ?? "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde" }}
            style={styles.avatar}
          />
          <View style={styles.inputSection}>
            <TextInput
              style={styles.textInput}
              placeholder="What's happening?!"
              placeholderTextColor={COLORS.grey}
              multiline
              value={text}
              onChangeText={setText}
              maxLength={280} // Ліміт довжини твіту в X
            />

            {selectedImage && (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: selectedImage }} style={styles.previewImage} />
                <TouchableOpacity 
                  style={styles.removeImageButton}
                  onPress={() => setSelectedImage(null)}
                >
                  <Ionicons name="close" size={16} color={COLORS.white} />
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Панель інструментів */}
      <View style={styles.toolbar}>
        <TouchableOpacity onPress={pickImage}>
          <Ionicons name="image-outline" size={24} style={styles.toolbarIcon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="videocam-outline" size={24} style={styles.toolbarIcon} />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="location-outline" size={24} style={styles.toolbarIcon} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}