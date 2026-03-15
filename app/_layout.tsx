import { useColorScheme } from '@/hooks/use-color-scheme';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import 'react-native-reanimated';
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
  const { username, tokenCreatedAt} = useContext(UserContext);
  const colorScheme = useColorScheme();

  const [today, setToday] = useState(
    new Date().toISOString().split('T')[0]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setToday(new Date().toISOString().split('T')[0]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const isValidToday =
    tokenCreatedAt !== null &&
    tokenCreatedAt === today;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {isValidToday || Platform.OS === 'web' ? (
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
