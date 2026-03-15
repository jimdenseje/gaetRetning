import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Image } from 'expo-image';
import React, { useContext, useState } from 'react';
import { StyleSheet, TextInput, useColorScheme } from 'react-native';
import { UserContext } from '../context/UserContext';
import { login, signUp } from './helper/Api';

type LoginDataTemp = {
  username: string;
  password: string;
  age: string;
};

export default function LoginScreen() {
  const { setAuth } = useContext(UserContext);
  const colorScheme = useColorScheme() ?? 'light';

  const [form, setForm] = useState<LoginDataTemp>({
    username: '',
    password: '',
    age: '',
  });

  const [loadingLogin, setLoadingLogin] = useState(false);
  const [loadingSignUp, setLoadingSignUp] = useState(false);

  const updateField = (field: keyof LoginDataTemp, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleLogin = async () => {
    if (!form.username || !form.password) return;
    
    setLoadingLogin(true);

    try {
      const token = await login(form.username, form.password);
      await setAuth(form.username, token);
    } catch (err) {
      alert(err || 'Login failed');
    } finally {
      setLoadingLogin(false);
    }

  };

  const handleSignUp = async () => {
    if (!form.username || !form.password || !form.age) return;

    setLoadingSignUp(true);

    try {
      const token = await signUp(form.username, form.password, parseInt(form.age));
      await setAuth(form.username, token);
    } catch (err) {
      alert(err || 'Sign-up failed');
    } finally {
      setLoadingSignUp(false);
    }
  };

  const styles = StyleSheet.create({
    container: { padding: 20 },
    input: {
      borderWidth: 1,
      padding: 10,
      marginBottom: 10,
      color: colorScheme === 'dark' ? '#ffffff' : '#000000',
      backgroundColor: colorScheme === 'dark' ? undefined : '#ffffff',
      borderColor: colorScheme === 'dark' ? '#ffffff' : '#000000',
    },
    button: {
      backgroundColor: colorScheme === 'dark' ? '#1D3D47' : '#A1CEDC',
      marginBottom: 28,
      padding: 10,
      borderRadius: 8,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    headerImage: {
      color: '#1f8300',
      bottom: -36,
      left: -20,
      position: 'absolute',
    },
    stepContainer: {
      gap: 8,
      marginBottom: 8,
    },
    compass: {
      height: 140,
      width: 140,
      marginTop: 10,
      marginLeft: 10,
    },
  });

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#00d42a', dark: '#025706' }}
      headerImage={
          <Image
            source={require('@/assets/images/compass.png')}
            style={styles.compass}
            tintColor={colorScheme === 'dark' ? '#ffffff' : '#000000'}
          />
      }
      headerTitle="Gæt Retning"
      cached={false}
    >
      <ThemedView style={styles.stepContainer}>
        <TextInput
          placeholder="Skriv dit brugernavn"
          value={form.username}
          onChangeText={(text) => updateField('username', text)}
          style={styles.input}
        />

        <TextInput
          placeholder="Skriv dit password"
          secureTextEntry
          value={form.password}
          onChangeText={(text) => updateField('password', text)}
          style={styles.input}
        />

        <ThemedText
          style={styles.button}
          onPress={handleLogin}
          disabled={!form.username || !form.password || loadingLogin}
        >
          {loadingLogin ? 'Logger ind...' : 'Login'}
        </ThemedText>

        <TextInput
          placeholder="Skriv din alder"
          keyboardType="numeric"
          value={form.age}
          onChangeText={(text) => 
            updateField('age', text.replace(/[^0-9]/g, ''))
          }
          style={styles.input}
        />
        
        {form.age && Number(parseInt(form.age)).toString() !== form.age && (
          <ThemedText style={{ marginTop: -14, marginBottom: 8, marginLeft: 10 }}>
            Indtast venligst en gyldig alder
          </ThemedText>
        )}

        <ThemedText
          style={styles.button}
          onPress={handleSignUp}
          disabled={!form.username || !form.password || !form.age || loadingSignUp}
        >
          {loadingSignUp ? 'Opretter...' : 'Opret konto'}
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}