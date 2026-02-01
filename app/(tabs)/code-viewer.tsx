import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useState, useMemo } from "react";
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

export default function CodeViewerScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

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

  const selectedFile = projectData.files[selectedFileIndex];
  const filteredFiles = projectData.files.filter((f) =>
    f.path.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFileIcon = (path: string) => {
    if (path.endsWith(".tsx")) return "⚛️";
    if (path.endsWith(".ts")) return "📘";
    if (path.endsWith(".json")) return "📋";
    if (path.endsWith(".css")) return "🎨";
    if (path.endsWith(".md")) return "📖";
    return "📄";
  };

  return (
    <ScreenContainer className="p-0">
      <View className="flex-1 flex-row">
        {/* File List Sidebar */}
        <View className="w-1/3 bg-surface border-r border-border">
          {/* Header */}
          <View className="p-3 border-b border-border gap-2">
            <Text className="text-sm font-bold text-foreground">Files</Text>
            <TextInput
              placeholder="Search..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="bg-background border border-border rounded px-2 py-1 text-xs text-foreground"
              placeholderTextColor="#94A3B8"
            />
          </View>

          {/* File List */}
          <FlatList
            data={filteredFiles}
            keyExtractor={(item) => item.path}
            renderItem={({ item, index }) => {
              const actualIndex = projectData!.files.findIndex((f) => f.path === item.path);
              return (
                <TouchableOpacity
                  onPress={() => setSelectedFileIndex(actualIndex)}
                  className={`px-3 py-2 border-b border-border ${
                    selectedFileIndex === actualIndex ? "bg-primary/20" : ""
                  }`}
                >
                  <View className="gap-1">
                    <View className="flex-row items-center gap-1">
                      <Text className="text-sm">{getFileIcon(item.path)}</Text>
                      <Text
                        className={`text-xs font-semibold flex-1 ${
                          selectedFileIndex === actualIndex
                            ? "text-primary"
                            : "text-foreground"
                        }`}
                        numberOfLines={1}
                      >
                        {item.path.split("/").pop()}
                      </Text>
                    </View>
                    <Text className="text-xs text-muted">{item.path}</Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>

        {/* Code Editor */}
        <View className="flex-2">
          {selectedFile ? (
            <>
              {/* File Header */}
              <View className="bg-surface border-b border-border p-3 gap-1">
                <Text className="text-sm font-bold text-foreground">{selectedFile.path}</Text>
                <Text className="text-xs text-muted">
                  {selectedFile.content.length} characters
                </Text>
              </View>

              {/* Code Display */}
              <ScrollView className="flex-1 p-3" horizontal>
                <ScrollView>
                  <Text className="text-xs font-mono text-foreground leading-relaxed">
                    {selectedFile.content}
                  </Text>
                </ScrollView>
              </ScrollView>
            </>
          ) : (
            <View className="flex-1 items-center justify-center">
              <Text className="text-muted">Select a file to view</Text>
            </View>
          )}
        </View>
      </View>

      {/* Bottom Actions */}
      <View className="bg-surface border-t border-border p-3 flex-row gap-2">
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-1 bg-surface border border-border px-3 py-2 rounded"
        >
          <Text className="text-foreground font-semibold text-center text-sm">Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            // TODO: Implement preview
            router.replace({
              pathname: "/(tabs)/app-preview",
              params: {
                projectData: params.projectData,
              },
            });
          }}
          className="flex-1 bg-primary px-3 py-2 rounded"
        >
          <Text className="text-background font-semibold text-center text-sm">Preview App</Text>
        </TouchableOpacity>
      </View>
    </ScreenContainer>
  );
}
