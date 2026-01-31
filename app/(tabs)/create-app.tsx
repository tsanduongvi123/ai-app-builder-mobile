import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";
import { useRouter } from "expo-router";

const APP_TYPES = [
  { id: "game", label: "Game", icon: "🎮" },
  { id: "utility", label: "Utility", icon: "🛠️" },
  { id: "social", label: "Social", icon: "👥" },
  { id: "productivity", label: "Productivity", icon: "📊" },
  { id: "other", label: "Other", icon: "✨" },
];

export default function CreateAppScreen() {
  const router = useRouter();
  const [appName, setAppName] = useState("");
  const [appDescription, setAppDescription] = useState("");
  const [selectedType, setSelectedType] = useState("utility");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationOutput, setGenerationOutput] = useState("");

  const createProjectMutation = trpc.projects.create.useMutation();
  const generateAppMutation = trpc.ai.generateApp.useMutation();

  const handleGenerate = async () => {
    if (!appName.trim()) {
      Alert.alert("Error", "Please enter an app name");
      return;
    }

    if (!appDescription.trim()) {
      Alert.alert("Error", "Please describe your app");
      return;
    }

    setIsGenerating(true);
    setGenerationOutput("Initializing AI generation...\n");

    try {
      // Create project first
      const projectRes = await createProjectMutation.mutateAsync({
        name: appName,
        description: appDescription,
        type: selectedType,
        aiPrompt: appDescription,
      });

      setGenerationOutput((prev) => prev + "Project created. Starting AI generation...\n");

      // Generate app code
      const generateRes = await generateAppMutation.mutateAsync({
        prompt: appDescription,
        appType: selectedType,
      });

      if (generateRes.success && generateRes.project) {
        setGenerationOutput(
          (prev) =>
            prev +
            `✅ App generated successfully!\n\nProject: ${generateRes.project.projectName}\n`
        );

        // Navigate to projects screen after 2 seconds
        setTimeout(() => {
          router.replace("/(tabs)/projects");
        }, 2000);
      } else {
        setGenerationOutput((prev) => prev + `❌ Error: ${generateRes?.error || 'Unknown error'}\n`);
      }
    } catch (error) {
      setGenerationOutput(
        (prev) =>
          prev +
          `❌ Error: ${error instanceof Error ? error.message : "Unknown error"}\n`
      );
    } finally {
      setIsGenerating(false);
    }
  };

  if (isGenerating) {
    return (
      <ScreenContainer className="p-6">
        <View className="flex-1 gap-4">
          <Text className="text-2xl font-bold text-foreground">Generating Your App...</Text>

          <View className="flex-1 bg-surface rounded-xl p-4 border border-border">
            <ScrollView>
              <Text className="text-sm font-mono text-foreground">{generationOutput}</Text>
            </ScrollView>
          </View>

          <ActivityIndicator size="large" color="#3B82F6" />
          <Text className="text-center text-muted">This may take a minute...</Text>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Create New App</Text>
            <Text className="text-base text-muted">
              Describe your app idea and let AI build it for you
            </Text>
          </View>

          {/* App Name Input */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">App Name</Text>
            <TextInput
              placeholder="e.g., Todo List, Weather App"
              value={appName}
              onChangeText={setAppName}
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholderTextColor="#94A3B8"
            />
          </View>

          {/* App Type Selection */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">App Type</Text>
            <View className="flex-row flex-wrap gap-2">
              {APP_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  onPress={() => setSelectedType(type.id)}
                  className={`flex-1 min-w-[45%] px-3 py-2 rounded-lg border-2 items-center ${
                    selectedType === type.id
                      ? "bg-primary border-primary"
                      : "bg-surface border-border"
                  }`}
                >
                  <Text className="text-lg">{type.icon}</Text>
                  <Text
                    className={`text-xs font-semibold mt-1 ${
                      selectedType === type.id ? "text-background" : "text-foreground"
                    }`}
                  >
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* App Description Input */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Description</Text>
            <TextInput
              placeholder="Describe what your app should do..."
              value={appDescription}
              onChangeText={setAppDescription}
              multiline
              numberOfLines={5}
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholderTextColor="#94A3B8"
              textAlignVertical="top"
            />
            <Text className="text-xs text-muted">
              {appDescription.length} characters
            </Text>
          </View>

          {/* Generate Button */}
          <TouchableOpacity
            onPress={handleGenerate}
            disabled={isGenerating || !appName.trim() || !appDescription.trim()}
            className={`px-6 py-4 rounded-xl ${
              isGenerating || !appName.trim() || !appDescription.trim()
                ? "bg-gray-300"
                : "bg-primary active:opacity-80"
            }`}
          >
            <Text className="text-background font-semibold text-center text-lg">
              {isGenerating ? "Generating..." : "Generate with AI"}
            </Text>
          </TouchableOpacity>

          {/* Info Box */}
          <View className="bg-blue-50 rounded-lg p-4 gap-2">
            <Text className="text-sm font-semibold text-blue-900">💡 Tips</Text>
            <Text className="text-xs text-blue-800">
              Be specific about features you want. For example: "A todo list app with categories,
              due dates, and notifications"
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
