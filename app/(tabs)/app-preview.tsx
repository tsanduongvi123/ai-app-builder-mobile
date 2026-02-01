import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useLocalSearchParams, useRouter } from "expo-router";

interface ProjectFile {
  path: string;
  content: string;
}

interface GeneratedProject {
  projectName: string;
  description: string;
  files: ProjectFile[];
  dependencies: string[];
  instructions: string;
}

export default function AppPreviewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<"preview" | "info" | "dependencies">("preview");

  let projectData: GeneratedProject | null = null;
  try {
    const projectDataStr = params.projectData as string;
    if (projectDataStr) {
      projectData = JSON.parse(projectDataStr);
    }
  } catch (error) {
    console.error("Error parsing project data:", error);
  }

  if (!projectData) {
    return (
      <ScreenContainer className="flex items-center justify-center">
        <View className="gap-4 items-center">
          <Text className="text-lg font-semibold text-foreground">No project data found</Text>
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-primary px-6 py-3 rounded-lg"
          >
            <Text className="text-background font-semibold">Go Back</Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-0">
      <View className="flex-1">
        {/* Header */}
        <View className="bg-primary px-6 py-4 gap-2">
          <Text className="text-2xl font-bold text-background">{projectData.projectName}</Text>
          <Text className="text-sm text-background/80">{projectData.description}</Text>
        </View>

        {/* Tab Navigation */}
        <View className="flex-row bg-surface border-b border-border">
          {(["preview", "info", "dependencies"] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              className={`flex-1 py-3 border-b-2 ${
                activeTab === tab ? "border-primary" : "border-transparent"
              }`}
            >
              <Text
                className={`text-center text-sm font-semibold ${
                  activeTab === tab ? "text-primary" : "text-muted"
                }`}
              >
                {tab === "preview"
                  ? "📱 Preview"
                  : tab === "info"
                    ? "ℹ️ Info"
                    : "📦 Dependencies"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Content */}
        <View className="flex-1">
          {activeTab === "preview" && (
            <View className="flex-1 items-center justify-center bg-surface">
              <View className="gap-4 items-center px-6">
                <Text className="text-4xl">📱</Text>
                <Text className="text-lg font-semibold text-foreground text-center">
                  App Preview Coming Soon
                </Text>
                <Text className="text-sm text-muted text-center">
                  The app preview will be available after building the project.
                </Text>
                <View className="bg-blue-50 rounded-lg p-4 gap-2 w-full">
                  <Text className="text-sm font-semibold text-blue-900">💡 Next Steps:</Text>
                  <Text className="text-xs text-blue-800 leading-relaxed">
                    1. Review the code in the Code Viewer{"\n"}2. Build the APK{"\n"}3. Test on
                    your device
                  </Text>
                </View>
              </View>
            </View>
          )}

          {activeTab === "info" && (
            <ScrollView className="flex-1 p-6">
              <View className="gap-4">
                <View className="gap-2">
                  <Text className="text-lg font-bold text-foreground">Project Information</Text>
                </View>

                <View className="bg-surface rounded-lg p-4 border border-border gap-3">
                  <View className="gap-1">
                    <Text className="text-xs font-semibold text-muted">PROJECT NAME</Text>
                    <Text className="text-base font-semibold text-foreground">
                      {projectData.projectName}
                    </Text>
                  </View>

                  <View className="gap-1">
                    <Text className="text-xs font-semibold text-muted">DESCRIPTION</Text>
                    <Text className="text-sm text-foreground leading-relaxed">
                      {projectData.description}
                    </Text>
                  </View>

                  <View className="gap-1">
                    <Text className="text-xs font-semibold text-muted">FILES</Text>
                    <Text className="text-base font-semibold text-foreground">
                      {projectData.files.length} files
                    </Text>
                  </View>

                  <View className="gap-1">
                    <Text className="text-xs font-semibold text-muted">SETUP INSTRUCTIONS</Text>
                    <Text className="text-sm text-foreground leading-relaxed font-mono">
                      {projectData.instructions}
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          )}

          {activeTab === "dependencies" && (
            <ScrollView className="flex-1 p-6">
              <View className="gap-4">
                <View className="gap-2">
                  <Text className="text-lg font-bold text-foreground">Dependencies</Text>
                  <Text className="text-sm text-muted">
                    {projectData.dependencies.length} packages required
                  </Text>
                </View>

                <View className="gap-2">
                  {projectData.dependencies.map((dep, index) => (
                    <View
                      key={index}
                      className="bg-surface rounded-lg p-3 border border-border flex-row items-center"
                    >
                      <Text className="text-lg mr-3">📦</Text>
                      <Text className="text-sm font-mono text-foreground flex-1">{dep}</Text>
                    </View>
                  ))}
                </View>

                <View className="bg-blue-50 rounded-lg p-4 gap-2 mt-4">
                  <Text className="text-sm font-semibold text-blue-900">💡 Installation:</Text>
                  <Text className="text-xs text-blue-800 font-mono">
                    pnpm install {"\n"}or{"\n"}npm install
                  </Text>
                </View>
              </View>
            </ScrollView>
          )}
        </View>

        {/* Bottom Actions */}
        <View className="bg-surface border-t border-border p-4 flex-row gap-2">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex-1 bg-surface border border-border px-4 py-3 rounded-lg"
          >
            <Text className="text-foreground font-semibold text-center">Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              // TODO: Implement build APK
              alert("Build APK feature coming soon!");
            }}
            className="flex-1 bg-primary px-4 py-3 rounded-lg"
          >
            <Text className="text-background font-semibold text-center">📦 Build APK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenContainer>
  );
}
