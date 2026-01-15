import { Stack, useRouter, useSegments } from 'expo-router';
import { onAuthStateChanged, User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { auth } from '../firebaseConfig';
import './global.css';

export default function RootLayout() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const segments = useSegments(); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (initializing) setInitializing(false);
    });

    return unsubscribe; 
  }, []);

  // Redirect logic
  useEffect(() => {
    if (initializing) return;

    //check if user in auth group
    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      // If user is not logged in and not in auth group, send to login
      router.replace('/(auth)/signup');
    } else if (user && inAuthGroup) {
      // If user is logged in and tries to see login screen, send to tabs
      router.replace('/(tabs)');
    }
  }, [user, initializing, segments]);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  return <Stack>
    <Stack.Screen
    name="(tabs)"
    options={{headerShown:false}}
    />
    <Stack.Screen
    name="songs/[id]"
    options={{headerShown:false}}
    />
  </Stack>;
}
