export async function createGame(username: string, score: number): Promise<string> {
    const response = await fetch('https://spil.qeentu.com/jims/gaetRetningApi/upload_score.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
            player_name: username,
            score: score,
            challenge_date: new Date().toISOString().split('T')[0] // Format: YYYY-MM-DD
        }),
    });

    const data = await response.json();
    if (data.status === 'success') {
        return data.status;
    }

    throw new Error("Failed to create game");
}

export async function challengeToday(): Promise<{ direction: number; challenge_date: string }> {
  const response = await fetch(
    "https://spil.qeentu.com/jims/gaetRetningApi/challenge_today.php",
    {
      signal: AbortSignal.timeout(10000)
    }
  );

  const data = await response.json();

  if (typeof data.direction === "number" && typeof data.challenge_date === "string") {
    return {
      direction: data.direction,
      challenge_date: data.challenge_date,
    };
  }

  throw new Error("Failed to retrieve today's challenge");
}