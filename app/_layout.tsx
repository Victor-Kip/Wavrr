import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from '../context/auth';
import './global.css';

const RootLayoutNav = () => {
  const {user,loading} = useAuth();
  const segments = useSegments();
  const router = useRouter();


  useEffect(() => {
    // If the auth is still loading, do nothing
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      // If the user is not logged in and not already in the auth group, redirect to login
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      // If the user is logged in and trying to access auth pages, redirect to home
      router.replace('/(tabs)');
    }
  }, [user, loading, segments]);
  if(loading){
    return <>
    <View className='flex-1 justify-center items-center'>
      <ActivityIndicator size="large" />
    </View>
    </>;
  }
  return (
  <Stack>
    <Stack.Screen
    name="(tabs)"
    options={{headerShown:false}}
    />
      <Stack.Screen
    name="(auth)"
    options={{headerShown:false}}
    />
    <Stack.Screen
    name="songs/[id]"
    options={{headerShown:false}}
    />
  </Stack>);
}
export default function RootLayout(){
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
};
