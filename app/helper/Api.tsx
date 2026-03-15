export const API_BASE_URL = 'https://localhost:7007/api/';

export async function createGame(score: number, token: string): Promise<string> {
    const response = await fetch(API_BASE_URL + 'Score', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            scoreValue: score,
        }),
    });

    const data = await response.json();
    if (data.id) {
        return data.id;
    }
    if (data.message) {
        throw new Error(data.message);
    }

    throw new Error("Failed to create game");
}

export async function challengeToday(): Promise<{ direction: number; challenge_date: string }> {
  const response = await fetch(
    API_BASE_URL + "DailyChallenge/today",
    {
      signal: AbortSignal.timeout(10000)
    }
  );

  const data = await response.json();

  if (typeof data.direction === "number" && typeof data.challengeDate === "string") {
    return {
      direction: data.direction,
      challenge_date: data.challengeDate,
    };
  }

  throw new Error("Failed to retrieve today's challenge");
}

type ScoreEntry = {
  username: string;
  scoreValue: number;
  challengeDate: string
};

const normalizeScores = (data: Record<string, ScoreEntry[]>) => {
  const result: Record<string, Array<ScoreEntry>> = {};
  Object.entries(data).forEach(([day, arr]) => {
    result[day] = arr
      .sort((a, b) => b.scoreValue - a.scoreValue);
  });
  return result;
};

export const fetchScores = async () => {
  try {
    const response = await fetch(
      API_BASE_URL + 'Score/leaderboard',
      {
        signal: AbortSignal.timeout(10000)
      }
    );
    if (!response.ok) throw new Error("Failed to fetch scores");

    const data = await response.json();
    const normalized = normalizeScores(data);
    return normalized;
  } catch (err) {
    console.error("Error fetching scores:", err);
    return null;
  }
};

export async function login(username: string, password: string): Promise<string> {
  const response = await fetch(API_BASE_URL + 'Auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();
  if (data.token) {
    return data.token;
  }

  if (data.message) {
    throw new Error(data.message);
  }

  throw new Error("Login failed");
}

export async function signUp(username: string, password: string, age: number): Promise<string> {
  const response = await fetch(API_BASE_URL + 'Auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, age }),
  });

  const data = await response.json();
  if (data.token) {
    return data.token;
  }

  if (data.message) {
    throw new Error(data.message);
  }

  throw new Error("Sign-up failed");
}