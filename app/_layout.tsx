import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Platform } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useContext } from 'react';
import { UserContext, UserProvider } from '../context/UserContext';
import LoginScreen from './LoginScreen';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {

  return (
    <UserProvider>
      <AppLayout />
    </UserProvider>
  );
}

function AppLayout() {
  const { username } = useContext(UserContext);
  const colorScheme = useColorScheme();

  console.log('Current username:', username);

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {username || Platform.OS === 'web' ? (
        <>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
          <StatusBar style="auto" />
        </>
      ) : (
        <LoginScreen />
      )}
    </ThemeProvider>
  );
}
