
export function bearingToQuadrant(deg: number): string {
  /* hvis deg er negativ eller større en 360, normaliseres det til [0, 360]
  f.eks. -10 -> 350, 370 -> 10
  tænker man at "(deg + 360) % 360" altid vil give det samme resultat så tager man fejl,
  da tal mindre en -360 vil forblive negative,
  da f.eks. -410 + 360 = -50, og -50 % 360 = -50
  */
  deg = ((deg % 360) + 360) % 360;

  if (deg === 0) return "N";
  if (deg === 90) return "E";
  if (deg === 180) return "S";
  if (deg === 270) return "W";

  const directions = [
    {name: "N", deg: 0},
    {name: "E", deg: 90},
    {name: "S", deg: 180},
    {name: "W", deg: 270}
  ];

  let closest = directions.reduce((prev, curr) => {
    let diff = Math.abs(deg - curr.deg);
    if (diff > 180) diff = 360 - diff;
    return diff < prev.diff ? {dir: curr.name, diff: diff, deg: curr.deg} : prev;
  }, {diff: 360, dir: "", deg: 0});

  let primary = closest.dir;
  let angle = (deg - closest.deg + 360) % 360;

  let secondary;
  if (primary === "N") secondary = angle <= 180 ? "E" : "W";
  else if (primary === "E") secondary = angle <= 180 ? "S" : "N";
  else if (primary === "S") secondary = angle <= 180 ? "W" : "E";
  else if (primary === "W") secondary = angle <= 180 ? "N" : "S";

  if (angle > 180) angle = 360 - angle;

  return `${primary} ${angle.toFixed(0)}° ${secondary}`;
}
