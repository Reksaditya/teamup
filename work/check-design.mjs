import fs from "node:fs";
const css = fs.readFileSync("app/globals.css", "utf8");
const readTokens = (block) =>
  Object.fromEntries(
    [...block.matchAll(/--([\w-]+):\s*(#[\da-f]{6})\s*;/gi)].map((m) => [
      m[1],
      m[2],
    ]),
  );
const lum = (hex) =>
  hex
    .slice(1)
    .match(/../g)
    .map((n) => parseInt(n, 16) / 255)
    .map((n) => (n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4))
    .reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
const ratio = (tokens, a, b) => {
  const x = lum(tokens[a]),
    y = lum(tokens[b]);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};
const pairs = [];
for (const text of ["text", "secondary", "muted", "link"])
  for (const bg of ["canvas", "surface", "raised", "input", "selected"])
    pairs.push([text, bg, 4.5]);
for (const state of ["info", "success", "warning", "danger"])
  pairs.push([state + "-text", state + "-bg", 4.5]);
pairs.push(
  ["on-accent", "brand", 4.5],
  ["on-accent", "hover", 4.5],
  ["on-accent", "pressed", 4.5],
  ["neutral-text", "neutral-bg", 4.5],
);
for (const bg of ["canvas", "surface", "raised", "input", "selected"])
  pairs.push(["control", bg, 3], ["focus", bg, 3]);
const results = ["light", "dark"].flatMap((theme) => {
  const selector =
    theme === "light"
      ? /:root\s*\{([^}]+)\}/
      : /\[data-theme="dark"\]\s*\{([^}]+)\}/;
  const tokens = readTokens(css.match(selector)[1]);
  return pairs.map(([a, b, target]) => ({
    theme,
    foreground: a,
    background: b,
    ratio: Number(ratio(tokens, a, b).toFixed(2)),
    target,
    pass: ratio(tokens, a, b) >= target,
  }));
});
fs.writeFileSync(
  "outputs/light-dark-contrast.json",
  JSON.stringify(results, null, 2) + "\n",
);
const failed = results.filter((r) => !r.pass);
console.log(JSON.stringify({ checked: results.length, failed }, null, 2));
if (failed.length) process.exitCode = 1;
