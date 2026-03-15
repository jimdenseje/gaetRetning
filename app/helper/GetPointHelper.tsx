
// beregn point baseret på hvor tæt a og b er på hinanden,
// hvor 0 point er 180 grader fra hinanden, og 10000 point er det samme
export function getPoint(a: number, b: number): number {
  let diff = Math.abs(a - b);
  if (diff > 180) diff = 360 - diff;

  return Math.round((1 - diff / 180) * 10000);
}
