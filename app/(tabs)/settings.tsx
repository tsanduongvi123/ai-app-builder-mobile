import { ScrollView, Text, View, TouchableOpacity, Switch } from "react-native";
import { useState } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

export default function SettingsScreen() {
  const colors = useColors();
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  const handleLogout = () => {
    // TODO: Implement logout
  };

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-6">
          {/* Header */}
          <View className="gap-2">
            <Text className="text-4xl font-bold text-foreground">Settings</Text>
            <Text className="text-base text-muted">Manage your preferences</Text>
          </View>

          {/* Preferences Section */}
          <View className="gap-4">
            <Text className="text-lg font-semibold text-foreground">Preferences</Text>

            {/* Dark Mode */}
            <View className="bg-surface rounded-lg p-4 border border-border flex-row justify-between items-center">
              <View className="flex-1">
                <Text className="text-base font-semibold text-foreground">Dark Mode</Text>
                <Text className="text-sm text-muted mt-1">Use dark theme</Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: "#E2E8F0", true: "#3B82F6" }}
                thumbColor={darkMode ? "#1E40AF" : "#94A3B8"}
              />
            </View>

            {/* Notifications */}
            <View className="bg-surface rounded-lg p-4 border border-border flex-row justify-between items-center">
              <View className="flex-1">
                <Text className="text-base font-semibold text-foreground">Notifications</Text>
                <Text className="text-sm text-muted mt-1">Get build updates</Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: "#E2E8F0", true: "#3B82F6" }}
                thumbColor={notifications ? "#1E40AF" : "#94A3B8"}
              />
            </View>
          </View>

          {/* About Section */}
          <View className="gap-4">
            <Text className="text-lg font-semibold text-foreground">About</Text>

            <View className="bg-surface rounded-lg p-4 border border-border">
              <View className="gap-3">
                <View className="flex-row justify-between">
                  <Text className="text-sm text-muted">Version</Text>
                  <Text className="text-sm font-semibold text-foreground">1.0.0</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-sm text-muted">Build</Text>
                  <Text className="text-sm font-semibold text-foreground">7375515f</Text>
                </View>
              </View>
            </View>

            {/* Help Links */}
            <TouchableOpacity className="bg-surface rounded-lg p-4 border border-border active:opacity-70">
              <Text className="text-base font-semibold text-primary">📖 Documentation</Text>
            </TouchableOpacity>

            <TouchableOpacity className="bg-surface rounded-lg p-4 border border-border active:opacity-70">
              <Text className="text-base font-semibold text-primary">💬 Send Feedback</Text>
            </TouchableOpacity>
          </View>

          {/* Account Section */}
          <View className="gap-4">
            <Text className="text-lg font-semibold text-foreground">Account</Text>

            <TouchableOpacity
              onPress={handleLogout}
              className="bg-red-50 rounded-lg p-4 border border-red-200 active:opacity-70"
            >
              <Text className="text-base font-semibold text-red-600 text-center">Logout</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View className="items-center gap-2 mt-8">
            <Text className="text-xs text-muted">AI App Builder Mobile</Text>
            <Text className="text-xs text-muted">© 2026 All rights reserved</Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
