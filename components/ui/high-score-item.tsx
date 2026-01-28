import React from "react";
import { StyleSheet, Text, View } from "react-native";

interface HighScoreItemProps {
  name: string;
  score: number;
  maxScore: number;
}

const HighScoreItem: React.FC<HighScoreItemProps> = ({ name, score, maxScore }) => {
  const percentage = Math.min((score / maxScore) * 100, 100);

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

const styles = StyleSheet.create({
  container: {
    padding: 12,
    marginBottom: 10,
    backgroundColor: "#1e1e1e",
    borderRadius: 0,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  name: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  score: {
    color: "#ffd700",
    fontSize: 16,
    fontWeight: "700",
  },
  barBackground: {
    height: 8,
    backgroundColor: "#333",
    borderRadius: 0,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    backgroundColor: "#4caf50",
  },
});
