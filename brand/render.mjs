// Renders the brand images with Playwright: `node brand/render.mjs`
// Requires: npm i -D playwright && npx playwright install chromium
import { chromium } from "playwright";
import { fileURLToPath } from "node:url";
import path from "node:path";

const dir = path.dirname(fileURLToPath(import.meta.url));
const shots = [
  { page: "social.html", out: "social-preview.png", width: 1280, height: 640 },
  { page: "banner.html", out: "banner.png", width: 1280, height: 400 },
];

const browser = await chromium.launch();
for (const s of shots) {
  const page = await browser.newPage({ viewport: { width: s.width, height: s.height }, deviceScaleFactor: s.out === "banner.png" ? 2 : 1 });
  await page.goto("file://" + path.join(dir, s.page));
  await page.waitForLoadState("networkidle");
  await page.screenshot({ path: path.join(dir, s.out) });
  console.log("wrote", s.out);
}
await browser.close();
