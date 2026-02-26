import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { ActivityIndicator, FlatList, Platform, StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import HighScoreItem from '@/components/ui/high-score-item';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { useEffect, useState } from 'react';
import { getLocalScores, LocalScore } from '../helper/LocalStore';

type ScoreEntry = {
  player_name: string;
  score: number;
  challenge_date: string
};

type ScoresByDay = {
  today?: ScoreEntry[];
  yesterday?: ScoreEntry[];
  general?: ScoreEntry[];
  [key: string]: ScoreEntry[] | undefined;
};

export default function Screen() {
  const [scoresByDay, setScoresByDay] = useState<ScoresByDay>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cached, setCached] = useState(true);
  const [scores, setScores] = useState<LocalScore[]>([]);

  const SCORES_KEY = "@scores";
  const API_URL = "https://spil.qeentu.com/jims/gaetRetningApi/leaderboard.php";

  const normalizeScores = (data: Record<string, ScoreEntry[]>) => {
    const result: Record<string, Array<ScoreEntry>> = {};
    Object.entries(data).forEach(([day, arr]) => {
      result[day] = arr
        .sort((a, b) => b.score - a.score);
    });
    return result;
  };

  const fetchScores = async () => {
    try {
      const response = await fetch(API_URL, {signal: AbortSignal.timeout(10000)});
      if (!response.ok) throw new Error("Failed to fetch scores");

      const data = await response.json();
      const normalized = normalizeScores(data);

      setScoresByDay(normalized);
      await AsyncStorage.setItem(SCORES_KEY, JSON.stringify(normalized));
      setCached(false);
    } catch (err) {
      //setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const loadScores = async () => {
    try {
      const stored = await AsyncStorage.getItem(SCORES_KEY);
      if (stored) setScoresByDay(JSON.parse(stored));
      setLoading(false);

      const netState = await NetInfo.fetch();
      if (netState.isConnected) {
        await fetchScores();
      } else {
        console.warn("No internet connection. Showing cached scores.");
        //setError("No internet connection. Showing cached scores.");
      }

    } catch (err) {
      console.error("Error loading scores:", err);
      //setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
    }
  };

  useEffect(() => {
    loadScores();

    const interval = setInterval(async () => {
      const netState = await NetInfo.fetch();
      if (netState.isConnected) await fetchScores();
    }, 5_000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const loadLocalScores = async () => {
    const data = await getLocalScores();
    setScores(data);
  };

  useEffect(() => {
    loadLocalScores();
    
    const localInterval = setInterval(async () => {
      loadLocalScores();
    }, 100);

    return () => {
      clearInterval(localInterval);
    };
  }, []);

  if (loading) return <ActivityIndicator style={{ flex: 1 }} />;
  if (error) return <ThemedText>{error}</ThemedText>;

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
      headerTitle="Highscore"
      cached={cached}
      >
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}
          lightColor='#004d0f'
          darkColor='#00d40b'
          >
          I dags spil
        </ThemedText>
      </ThemedView>
      <FlatList
        data={scoresByDay['today'] || []}
        renderItem={({ item }) => (
          <HighScoreItem
            name={item.player_name}
            score={item.score}
            maxScore={scoresByDay['today'] && scoresByDay['today'].length > 0 ? Math.max(...scoresByDay['today'].map(s => s.score)) : 0}
          />
        )}
      />

      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}
          lightColor='#004d0f'
          darkColor='#00d40b'
          >
          I gårs spil
        </ThemedText>
      </ThemedView>
      <FlatList
        data={scoresByDay['yesterday'] || []}
        renderItem={({ item }) => (
          <HighScoreItem
            name={item.player_name}
            score={item.score}
            maxScore={scoresByDay['yesterday'] && scoresByDay['yesterday'].length > 0 ? Math.max(...scoresByDay['yesterday'].map(s => s.score)) : 0}
          />
        )}
      />

      {Platform.OS !== 'web' && (
        <>
          <ThemedView style={styles.titleContainer}>
            <ThemedText
              type="title"
              style={{
                fontFamily: Fonts.rounded,
              }}
              lightColor='#004d0f'
              darkColor='#00d40b'
              >
              Lokal highscore
            </ThemedText>
          </ThemedView>
          <FlatList
            data={scores}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <HighScoreItem
                name={item.date}
                score={item.score}
                maxScore={scores.length > 0 ? Math.max(...scores.map(s => s.score)) : 0}
              />
            )}
          />
        </>
      )}

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
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
