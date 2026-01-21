import { StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';

export default function Screen() {
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
      headerTitle="Highscore">
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}
          lightColor='#004d0f'
          darkColor='#00d40b'
          >
          Highscore
        </ThemedText>
      </ThemedView>
      <ThemedText>Hvem er den bedste</ThemedText>
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
