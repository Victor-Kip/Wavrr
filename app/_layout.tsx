import { Stack, useRouter, useSegments } from "expo-router";

import { MusicProvider, useMusic } from "@/context/musicContext";
import { useEffect } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import AuthProvider, { useAuth } from "../context/auth";

import "./global.css";

const RootLayoutNav = () => {
  const { loading, role } = useAuth();
  const { stopPlayback } = useMusic();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    const inAuthGroup = segments[0] === "(auth)";
    const isAuthenticated = !!role;
    if (!isAuthenticated && !inAuthGroup) {
      router.replace("/(auth)/userlogin");
      stopPlayback();
    } else if (isAuthenticated && inAuthGroup) {
      if (role === "artist") {
        router.replace("/(drawer)/(artist)/dashboard");
      } else if (role === "user") {
        router.replace("/(drawer)/(tabs)");
      }
    }
  }, [loading, segments, role,stopPlayback,router]);

  if (loading) {
    return (
      <>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" />
          <Text>please wait</Text>
        </View>
      </>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(drawer)" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="songs/[id]" />
      <Stack.Screen name="(stack)" />
      <Stack.Screen name="items/[id]" />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <MusicProvider>
        <RootLayoutNav />
      </MusicProvider>
    </AuthProvider>
  );
}
