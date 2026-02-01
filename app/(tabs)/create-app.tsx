import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  FlatList,
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

interface GenerationLog {
  id: string;
  message: string;
  type: "info" | "success" | "error" | "status";
}

export default function CreateAppScreen() {
  const router = useRouter();
  const [appName, setAppName] = useState("");
  const [appDescription, setAppDescription] = useState("");
  const [selectedType, setSelectedType] = useState("utility");
  const [isGenerating, setIsGenerating] = useState(false);
  const [logs, setLogs] = useState<GenerationLog[]>([]);

  const createProjectMutation = trpc.projects.create.useMutation();
  const generateAppMutation = trpc.ai.generateApp.useMutation();

  const addLog = (message: string, type: "info" | "success" | "error" | "status" = "info") => {
    setLogs((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        message,
        type,
      },
    ]);
  };

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
    setLogs([]);
    addLog("🚀 Starting AI generation...", "status");

    try {
      // Create project first
      addLog("📝 Creating project...", "info");
      const projectRes = await createProjectMutation.mutateAsync({
        name: appName,
        description: appDescription,
        type: selectedType,
        aiPrompt: appDescription,
      });

      if (!projectRes.projectId) {
        throw new Error("Failed to create project");
      }

      addLog(`✅ Project created (ID: ${projectRes.projectId})`, "success");
      addLog("🤖 Generating app code with AI...", "status");

      // Generate app code
      const generateRes = await generateAppMutation.mutateAsync({
        prompt: appDescription,
        appType: selectedType,
      });

      if (generateRes.success && generateRes.project) {
        addLog(`✅ App generated successfully!`, "success");
        addLog(`📦 Project: ${generateRes.project.projectName}`, "info");
        addLog(`📚 Files: ${generateRes.project.files?.length || 0} files`, "info");
        addLog(`📦 Dependencies: ${generateRes.project.dependencies?.length || 0} packages`, "info");

        // Navigate to code viewer after 3 seconds
        setTimeout(() => {
          router.replace({
            pathname: "/(tabs)/code-viewer",
            params: {
              projectId: projectRes.projectId.toString(),
              projectData: JSON.stringify(generateRes.project),
            },
          });
        }, 3000);
      } else {
        const errorMsg = generateRes?.error || "Unknown error";
        addLog(`❌ Error: ${errorMsg}`, "error");
        Alert.alert("Generation Failed", errorMsg);
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      addLog(`❌ Error: ${errorMsg}`, "error");
      Alert.alert("Error", errorMsg);
      console.error("Generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (isGenerating) {
    return (
      <ScreenContainer className="p-0">
        <View className="flex-1 bg-surface">
          {/* Header */}
          <View className="bg-primary px-6 py-4 gap-2">
            <Text className="text-2xl font-bold text-background">Generating Your App...</Text>
            <Text className="text-sm text-background/80">This may take a minute</Text>
          </View>

          {/* Logs */}
          <View className="flex-1 p-4">
            <FlatList
              data={logs}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View className="mb-2 pb-2 border-b border-border">
                  <Text
                    className={`text-sm font-mono ${
                      item.type === "error"
                        ? "text-error"
                        : item.type === "success"
                          ? "text-success"
                          : item.type === "status"
                            ? "text-primary"
                            : "text-muted"
                    }`}
                  >
                    {item.message}
                  </Text>
                </View>
              )}
              onEndReached={() => {
                // Auto scroll to bottom
              }}
              scrollEnabled
            />
          </View>

          {/* Loading indicator */}
          <View className="items-center pb-6">
            <ActivityIndicator size="large" color="#0a7ea4" />
          </View>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <View className="gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-3xl font-bold text-foreground">Create New App</Text>
            <Text className="text-base text-muted">Describe your app idea and let AI build it</Text>
          </View>

          {/* App Name Input */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">App Name *</Text>
            <TextInput
              placeholder="e.g., Todo List, Weather App"
              value={appName}
              onChangeText={setAppName}
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground"
              placeholderTextColor="#94A3B8"
              editable={!isGenerating}
            />
          </View>

          {/* App Type Selection */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-foreground">App Type *</Text>
            <View className="flex-row flex-wrap gap-2">
              {APP_TYPES.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  onPress={() => setSelectedType(type.id)}
                  disabled={isGenerating}
                  className={`flex-1 min-w-[45%] px-3 py-3 rounded-lg border-2 items-center justify-center ${
                    selectedType === type.id
                      ? "bg-primary border-primary"
                      : "bg-surface border-border"
                  }`}
                >
                  <Text className="text-2xl mb-1">{type.icon}</Text>
                  <Text
                    className={`text-xs font-semibold text-center ${
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
            <Text className="text-sm font-semibold text-foreground">App Description *</Text>
            <TextInput
              placeholder="Describe what your app should do. Be specific about features, design, and functionality."
              value={appDescription}
              onChangeText={setAppDescription}
              multiline
              numberOfLines={6}
              className="bg-surface border border-border rounded-lg px-4 py-3 text-foreground text-base"
              placeholderTextColor="#94A3B8"
              editable={!isGenerating}
              textAlignVertical="top"
            />
            <Text className="text-xs text-muted">
              {appDescription.length} characters
            </Text>
          </View>

          {/* Tips */}
          <View className="bg-blue-50 rounded-lg p-4 gap-2">
            <Text className="text-sm font-semibold text-blue-900">💡 Tips for better results:</Text>
            <Text className="text-xs text-blue-800 leading-relaxed">
              • Be specific about features{"\n"}• Describe the user interface{"\n"}• Mention any
              special requirements{"\n"}• Include color preferences if any
            </Text>
          </View>

          {/* Generate Button */}
          <TouchableOpacity
            onPress={handleGenerate}
            disabled={isGenerating || !appName.trim() || !appDescription.trim()}
            className={`px-6 py-4 rounded-lg items-center justify-center ${
              isGenerating || !appName.trim() || !appDescription.trim()
                ? "bg-gray-300"
                : "bg-primary"
            }`}
          >
            <Text className="text-background font-semibold text-lg">
              {isGenerating ? "Generating..." : "Generate App"}
            </Text>
          </TouchableOpacity>

          {/* Spacer */}
          <View className="h-4" />
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
