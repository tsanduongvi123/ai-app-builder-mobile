import { ScrollView, Text, View, TouchableOpacity, FlatList, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { trpc } from "@/lib/trpc";
import { useRouter } from "expo-router";

export default function ProjectsScreen() {
  const router = useRouter();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { data: projectsData, isLoading, refetch } = trpc.projects.list.useQuery();

  useEffect(() => {
    if (projectsData) {
      setProjects(projectsData);
      setLoading(false);
    }
  }, [projectsData]);

  const handleCreateNew = () => {
    router.push("/(tabs)/create-app");
  };

  const handleProjectPress = (projectId: number) => {
    // Navigate to projects screen
    router.push("/(tabs)/projects");
  };

  if (isLoading) {
    return (
      <ScreenContainer className="flex items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-4xl font-bold text-foreground">My Projects</Text>
            <Text className="text-base text-muted">
              {projects.length} {projects.length === 1 ? "project" : "projects"}
            </Text>
          </View>

          {/* Create New Button */}
          <TouchableOpacity
            onPress={handleCreateNew}
            className="bg-primary px-6 py-4 rounded-xl active:opacity-80"
          >
            <Text className="text-background font-semibold text-center text-lg">
              + Create New App
            </Text>
          </TouchableOpacity>

          {/* Projects List */}
          {projects.length === 0 ? (
            <View className="flex-1 items-center justify-center gap-4">
              <Text className="text-lg text-muted">No projects yet</Text>
              <Text className="text-sm text-muted text-center">
                Create your first AI-powered app to get started
              </Text>
            </View>
          ) : (
            <View className="gap-3">
              {projects.map((project) => (
                <TouchableOpacity
                  key={project.id}
                  onPress={() => handleProjectPress(project.id)}
                  className="bg-surface rounded-xl p-4 border border-border active:opacity-70"
                >
                  <View className="gap-2">
                    <View className="flex-row justify-between items-start">
                      <Text className="text-lg font-semibold text-foreground flex-1">
                        {project.name}
                      </Text>
                      <View className="bg-primary/20 px-3 py-1 rounded-full">
                        <Text className="text-xs font-semibold text-primary capitalize">
                          {project.type}
                        </Text>
                      </View>
                    </View>

                    {project.description && (
                      <Text className="text-sm text-muted line-clamp-2">
                        {project.description}
                      </Text>
                    )}

                    <View className="flex-row justify-between items-center mt-2">
                      <Text className="text-xs text-muted">
                        {new Date(project.updatedAt).toLocaleDateString()}
                      </Text>
                      <View className="flex-row gap-2">
                        <View
                          className={`px-2 py-1 rounded ${
                            project.status === "generated"
                              ? "bg-green-100"
                              : project.status === "built"
                              ? "bg-blue-100"
                              : "bg-gray-100"
                          }`}
                        >
                          <Text
                            className={`text-xs font-semibold capitalize ${
                              project.status === "generated"
                                ? "text-green-700"
                                : project.status === "built"
                                ? "text-blue-700"
                                : "text-gray-700"
                            }`}
                          >
                            {project.status}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
