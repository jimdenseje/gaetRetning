import AsyncStorage from "@react-native-async-storage/async-storage";

export type LocalScore = {
  score: number;
  date: string;
};

const SCORES_KEY = "@local_scores";

export async function getLocalScores(): Promise<LocalScore[]> {
  try {
    const stored = await AsyncStorage.getItem(SCORES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (err) {
    console.error("Failed to load local scores:", err);
    return [];
  }
}

export async function addLocalScore(score: number) {
  try {
    const scores = await getLocalScores();

    const newEntry: LocalScore = {
      score,
      date: new Date().toISOString(),
    };

    const top10 = [...scores, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    await AsyncStorage.setItem(SCORES_KEY, JSON.stringify(top10));
  } catch (err) {
    console.error("Failed to store local score:", err);
  }
}