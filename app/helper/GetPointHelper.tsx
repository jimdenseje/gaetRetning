
// getPoint is a helper function to calculate the point value based on the angle difference between the player's guess
// and the actual direction. The closer the guess is to the actual direction, the higher the points awarded.
// max points is 10000 for a perfect guess (0° difference) and decreases as the angle difference increases.
export function getPoint(a: number, b: number): number {
  let diff = Math.abs(a - b);
  if (diff > 180) diff = 360 - diff;

  return Math.round((1 - diff / 180) * 10000);
}
