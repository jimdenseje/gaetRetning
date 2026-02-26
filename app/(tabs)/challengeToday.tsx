import { Image } from 'expo-image';
import * as Location from 'expo-location';
import { Magnetometer } from 'expo-sensors';
import { Platform, StyleSheet, useColorScheme } from 'react-native';

import { challengeToday, createGame } from '@/app/helper/Api';
import { bearingToQuadrant } from '@/app/helper/CompassHelper';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { UserContext } from '@/context/UserContext';
import { useContext, useEffect, useState } from 'react';
import { getPoint } from '../helper/GetPointHelper';

export default function Screen() {
  const colorScheme = useColorScheme();
  const { username } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [heading, setHeading] = useState(0);
  const [bearing, setBearing] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const styles = StyleSheet.create({
    link: {
      color: colorScheme === 'dark' ? '#A1CEDC' : '#1D3D47',
    },
    button: {
      backgroundColor: colorScheme === 'dark' ? '#1D3D47' : '#A1CEDC',
      marginBottom: 28,
      padding: 8,
      borderRadius: 8,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    titleContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    headingContainer: {
      fontSize: 70,
      lineHeight: 70,
      fontWeight: 'bold',
      
      alignItems: 'center',
      textAlign: 'center',
      marginTop: 20,
      marginBottom: 20-8,
    },
    stepContainer: {
      gap: 8,
      marginBottom: 8,
    },
    centerView: {
      margin: 'auto',
      marginTop: 0,
    },
    compass: {
      height: 160,
      width: 160,
      marginTop: 0,
    },
    loadtitle: {
      marginBottom: 20,
    },
    headerImage: {
      color: '#808080',
      bottom: -90,
      left: -30,
      position: 'absolute',
    },
  });

  {/*
  if (Platform.OS === 'web') {
    return (
      <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }
      headerTitle="Spil">
      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Manglende funktion</ThemedText>
        <ThemedText>
          Din platform understøtter ikke kompassfunktionen
        </ThemedText>
      </ThemedView>
    </ParallaxScrollView>
    )
  }
  */}

  useEffect(() => {
    const run = async () => {
      setError(null);
      if (!loading) return;

      try {
        const challenge = await challengeToday();
        setBearing(challenge.direction);
        setLoading(false);
      } catch (errorMessage) {
        setError(errorMessage instanceof Error ? errorMessage.message : "An error occurred");
      }

      // wait 5 second before next request
      setTimeout(run, 5000);
    };

    run();
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web') {
      return;
    }

    Magnetometer.setUpdateInterval(100);

    const subscription = Magnetometer.addListener((data) => {
      let angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
      angle = angle >= 0 ? angle : angle + 360;
      setHeading(Math.round(angle));
    });

    return () => subscription.remove();
  }, []);

  const [lat, setLat] = useState(0);
  const [long, setLong] = useState(0);
  useEffect(() => {
    if (Platform.OS === 'web') {
      return;
    }

    let subscription: Location.LocationSubscription | null = null;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;

      /*
      const location = await Location.getCurrentPositionAsync({});
        setLat(location.coords.latitude);
        setLong(location.coords.longitude);
      */

      subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 5000,
          distanceInterval: 1,
        },
        (location) => {
          setLat(location.coords.latitude);
          setLong(location.coords.longitude);
        }
      );
    })();
    
    return () => {
      subscription?.remove();
    };
  }, []);

  if (loading) return (
    <ThemedView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ThemedText style={styles.loadtitle}>Indlæser udfordring...</ThemedText>
      {
        error && <ThemedText>{error+"\n     Prøver igen om 5 sekunder."}</ThemedText>
      }
    </ThemedView>
  );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={220}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }
      headerTitle='I dags spil'
      cached={false}
      >
      <ThemedView style={styles.stepContainer}>
        {/*
        <ThemedText type="subtitle">Debug</ThemedText>
        <ThemedText>
          {`Current Compass Heading: `}
          <ThemedText type="defaultSemiBold">{heading.toFixed(2)}°</ThemedText>
        </ThemedText>

        <ThemedText>
          {`Lat: `}
          <ThemedText type="defaultSemiBold">{lat.toFixed(10)}°</ThemedText>
        </ThemedText>
        
        <ThemedText>
          {`Long: `}
          <ThemedText type="defaultSemiBold">{long.toFixed(10)}°</ThemedText>
        </ThemedText>
        */}
        
        <ThemedText
          style={styles.centerView}>
          <Image
            source={require('@/assets/images/compass.png')}
            style={styles.compass}
            tintColor={colorScheme === 'dark' ? '#ffffff' : '#000000'}
          />
        </ThemedText>

        <ThemedText>
          Bevæg din enheds retning mod den angivne retning, billedet over kan være en hjælp til at finde den rigtige retning.
        </ThemedText>

        <ThemedText style={styles.headingContainer}>
          {bearingToQuadrant(bearing)}
        </ThemedText>
        
        <ThemedText
          style={styles.button}
          onPress={() => {
              if (username) {
                createGame(username, getPoint(heading, bearing))
                .then((status) => {
                  alert(`Score indsendt: ${status}`);
                })
                .catch((error) => {
                  alert(`Fejl ved indsendelse: ${error}`);
                });
              }
            }}
        >Indsend retning</ThemedText>

        {/*

        <ThemedText>
          Åbn fanen <Link href="/challengeToday" style={styles.link}>I dags spil</Link> for at se dagens udfordring.
        </ThemedText>

        <ThemedText>
          Åbn fanen <Link href="/highscore" style={styles.link}>Highscore</Link> for at se dagens resultater.
        </ThemedText>

        */}
      </ThemedView>
        
    </ParallaxScrollView>
  );
}
