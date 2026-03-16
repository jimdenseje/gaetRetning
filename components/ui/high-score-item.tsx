import React from "react";
import { StyleSheet, Text, View, useColorScheme } from "react-native";

interface HighScoreItemProps {
  name: string;
  score: number;
  maxScore: number;
}

const HighScoreItem: React.FC<HighScoreItemProps> = ({ name, score, maxScore }) => {
  const colorScheme = useColorScheme();
  const percentage = Math.min((score / maxScore) * 100, 100);

  const styles = StyleSheet.create({
    container: {
      padding: 12,
      marginBottom: 10,
      backgroundColor: colorScheme === 'dark' ? '#1e1e1e' : '#f0f0f0',
      borderRadius: 0,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 6,
    },
    name: {
      color: colorScheme === 'dark' ? '#fff' : '#000',
      fontSize: 16,
      fontWeight: "600",
    },
    score: {
      color: colorScheme === 'dark' ? '#ffd700' : '#b8860b',
      fontSize: 16,
      fontWeight: "700",
    },
    barBackground: {
      height: 8,
      backgroundColor: colorScheme === 'dark' ? '#333' : '#e2e2e2',
      borderRadius: 0,
      overflow: "hidden",
    },
    barFill: {
      height: "100%",
      backgroundColor: colorScheme === 'dark' ? '#4caf50' : '#00d42a',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.score}>{score}</Text>
      </View>

      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${percentage}%` }]} />
      </View>
    </View>
  );
};

export default HighScoreItem;
