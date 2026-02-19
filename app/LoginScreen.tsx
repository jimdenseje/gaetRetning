
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import React, { useContext, useState } from 'react';
import { Button, StyleSheet, TextInput, useColorScheme } from 'react-native';
import { UserContext } from '../context/UserContext';

export default function LoginScreen() {
  const { setUsername } = useContext(UserContext);
  const [name, setName] = useState('');
  const colorScheme = useColorScheme() ?? 'light';

  console.log('LoginScreen rendered with color scheme:', colorScheme);

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
    
    stepContainer: {
      gap: 8,
      marginBottom: 8,
    },
    headerImage: {
      color: '#1f8300',
      bottom: -36,
      left: -20,
      position: 'absolute',
    },
    titleContainer: {
      flexDirection: 'row',
      gap: 8,
    },
  });

  return (
    <ParallaxScrollView
          headerBackgroundColor={{ light: '#00d42a', dark: '#025706' }}
          headerImage={
            <IconSymbol
              size={180}
              color="#808080"
              name="chart.line.uptrend.xyaxis"
              style={styles.headerImage}
            />
          }
          headerTitle=""
    >
          <ThemedView style={styles.stepContainer}>
            <ThemedText type="subtitle">Et brugernavn er påkrævet for at spille</ThemedText>
            <TextInput
                placeholder="Skriv dit brugernavn"
                value={name}
                onChangeText={setName}
                style={styles.input}
            />

            <Button 
                color={colorScheme === 'dark' ? '#025706' : '#00d42a'}
                title="Continue"
                onPress={() => setUsername(name)}
                disabled={!name.trim()}
            />
          </ThemedView>

    </ParallaxScrollView>
  );
}
