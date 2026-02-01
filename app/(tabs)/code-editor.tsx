import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useRouter, useLocalSearchParams } from "expo-router";

interface ProjectFile {
  id: number;
  fileName: string;
  filePath: string;
  fileType: string;
  content: string;
}

export default function CodeEditorScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const projectId = params.projectId as string;

  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showFileList, setShowFileList] = useState(true);

  useEffect(() => {
    // TODO: Load files from API
    // For now, show placeholder
    setFiles([
      {
        id: 1,
        fileName: "index.tsx",
        filePath: "app/(tabs)/index.tsx",
        fileType: "tsx",
        content: "// Home screen code here",
      },
      {
        id: 2,
        fileName: "projects.tsx",
        filePath: "app/(tabs)/projects.tsx",
        fileType: "tsx",
        content: "// Projects screen code here",
      },
    ]);
  }, [projectId]);

  const handleSelectFile = (file: ProjectFile) => {
    setSelectedFile(file);
    setEditedContent(file.content);
    setShowFileList(false);
  };

  const handleSaveFile = async () => {
    if (!selectedFile) return;

    setIsSaving(true);
    try {
      // TODO: Save file to API
      setSelectedFile({
        ...selectedFile,
        content: editedContent,
      });
      // Show success message
      setIsSaving(false);
    } catch (error) {
      console.error("Error saving file:", error);
      setIsSaving(false);
    }
  };

  const handleAddNewFile = () => {
    // TODO: Implement add new file
  };

  if (showFileList) {
    return (
      <ScreenContainer className="p-6">
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 gap-6">
            {/* Header */}
            <View className="gap-2">
              <Text className="text-3xl font-bold text-foreground">Code Editor</Text>
              <Text className="text-base text-muted">Edit your project files</Text>
            </View>

            {/* File List */}
            <View className="gap-3">
              {files.map((file) => (
                <TouchableOpacity
                  key={file.id}
                  onPress={() => handleSelectFile(file)}
                  className="bg-surface rounded-lg p-4 border border-border active:opacity-70"
                >
                  <View className="gap-2">
                    <View className="flex-row justify-between items-center">
                      <Text className="text-base font-semibold text-foreground flex-1">
                        {file.fileName}
                      </Text>
                      <View className="bg-primary/20 px-2 py-1 rounded">
                        <Text className="text-xs font-semibold text-primary">
                          {file.fileType}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-xs text-muted">{file.filePath}</Text>
                    <Text className="text-xs text-muted">
                      {file.content.length} characters
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Add New File Button */}
            <TouchableOpacity
              onPress={handleAddNewFile}
              className="bg-primary px-6 py-3 rounded-lg active:opacity-80"
            >
              <Text className="text-background font-semibold text-center">+ Add New File</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </ScreenContainer>
    );
  }

  if (!selectedFile) {
    return (
      <ScreenContainer className="flex items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-0">
      <View className="flex-1">
        {/* Header */}
        <View className="bg-surface border-b border-border p-4 gap-2">
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-lg font-semibold text-foreground">{selectedFile.fileName}</Text>
              <Text className="text-xs text-muted">{selectedFile.filePath}</Text>
            </View>
            <TouchableOpacity
              onPress={() => setShowFileList(true)}
              className="bg-primary/20 px-3 py-2 rounded"
            >
              <Text className="text-sm font-semibold text-primary">Files</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Code Editor */}
        <View className="flex-1 border-b border-border">
          <TextInput
            value={editedContent}
            onChangeText={setEditedContent}
            multiline
            scrollEnabled
            className="flex-1 bg-surface text-foreground p-4 font-mono text-sm"
            placeholderTextColor="#94A3B8"
            editable={!isSaving}
          />
        </View>

        {/* Footer Actions */}
        <View className="bg-surface border-t border-border p-4 gap-2 flex-row">
          <TouchableOpacity
            onPress={() => setShowFileList(true)}
            className="flex-1 bg-surface border border-border px-4 py-3 rounded-lg active:opacity-70"
          >
            <Text className="text-foreground font-semibold text-center">Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSaveFile}
            disabled={isSaving}
            className={`flex-1 px-4 py-3 rounded-lg ${
              isSaving ? "bg-gray-300" : "bg-primary active:opacity-80"
            }`}
          >
            <Text className="text-background font-semibold text-center">
              {isSaving ? "Saving..." : "Save"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenContainer>
  );
}
