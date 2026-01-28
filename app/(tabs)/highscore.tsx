import { FlatList, StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import HighScoreItem from '@/components/ui/high-score-item';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';

export default function Screen() {
  const sortedScores = [...scores].sort((a, b) => b.score - a.score);
  const maxScore = sortedScores[0]?.score ?? 1;

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
        data={sortedScores}
        renderItem={({ item }) => (
          <HighScoreItem
            name={item.name}
            score={item.score}
            maxScore={maxScore}
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
        data={sortedScores}
        renderItem={({ item }) => (
          <HighScoreItem
            name={item.name}
            score={item.score}
            maxScore={maxScore}
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
          Generalt spil
        </ThemedText>
      </ThemedView>
      <FlatList
        data={sortedScores}
        renderItem={({ item }) => (
          <HighScoreItem
            name={item.name}
            score={item.score}
            maxScore={maxScore}
          />
        )}
      />
    </ParallaxScrollView>
  );
}

interface ScoreItem {
  name: string;
  score: number;
}

const scores: ScoreItem[] = [
  { name: "PlayerOne", score: 370 },
  { name: "PlayerTwo", score: 820 },
  { name: "PlayerThree", score: 640 },
  { name: "PlayerFour", score: 990 },
];

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
