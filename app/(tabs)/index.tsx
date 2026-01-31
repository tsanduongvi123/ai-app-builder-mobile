import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";

/**
 * Home Screen - AI App Builder
 *
 * Main entry point for the app with quick actions to create new apps
 * and view existing projects.
 */
export default function HomeScreen() {
  const router = useRouter();

  const handleCreateApp = () => {
    router.push("/(tabs)/create-app");
  };

  const handleViewProjects = () => {
    router.push("/(tabs)/projects");
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-8">
          {/* Hero Section */}
          <View className="items-center gap-2 mt-4">
            <Text className="text-4xl font-bold text-foreground">AI App Builder</Text>
            <Text className="text-base text-muted text-center">
              Create amazing apps with AI in minutes
            </Text>
          </View>

          {/* Feature Highlights */}
          <View className="gap-3">
            <View className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
              <Text className="text-2xl mb-2">✨</Text>
              <Text className="text-lg font-semibold text-foreground mb-1">AI-Powered</Text>
              <Text className="text-sm text-muted">
                Describe your idea and let AI build the app
              </Text>
            </View>

            <View className="bg-green-50 rounded-2xl p-6 border border-green-200">
              <Text className="text-2xl mb-2">👁️</Text>
              <Text className="text-lg font-semibold text-foreground mb-1">Instant Preview</Text>
              <Text className="text-sm text-muted">
                See your app come to life in real-time
              </Text>
            </View>

            <View className="bg-orange-50 rounded-2xl p-6 border border-orange-200">
              <Text className="text-2xl mb-2">📦</Text>
              <Text className="text-lg font-semibold text-foreground mb-1">Build APK</Text>
              <Text className="text-sm text-muted">
                Package your app and share it instantly
              </Text>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="gap-3">
            <TouchableOpacity
              onPress={handleCreateApp}
              className="bg-primary px-6 py-4 rounded-xl active:opacity-80"
            >
              <Text className="text-background font-semibold text-center text-lg">
                + Create New App
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleViewProjects}
              className="bg-surface border-2 border-primary px-6 py-4 rounded-xl active:opacity-80"
            >
              <Text className="text-primary font-semibold text-center text-lg">
                View My Projects
              </Text>
            </TouchableOpacity>
          </View>

          {/* Info Box */}
          <View className="bg-blue-50 rounded-lg p-4 gap-2">
            <Text className="text-sm font-semibold text-blue-900">💡 How it works</Text>
            <Text className="text-xs text-blue-800 leading-relaxed">
              1. Describe your app idea{"\n"}2. AI generates the code{"\n"}3. Preview and edit{"\n"}4.
              Build and download APK
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
