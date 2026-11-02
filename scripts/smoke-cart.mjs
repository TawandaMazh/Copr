import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "/usr/local/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
});

const page = await browser.newPage();
page.on("pageerror", (err) => console.log("PAGEERROR", err.message));
page.on("console", (msg) => {
  if (msg.type() === "error") console.log("CONSOLE", msg.text());
});

await page.goto("http://localhost:3000/shop/training-mesh-tee", {
  waitUntil: "networkidle0",
  timeout: 60000,
});

await page.waitForSelector("button");
const buttons = await page.$$eval("button", (els) =>
  els.map((b) => ({
    text: b.textContent?.trim(),
    disabled: b.disabled,
  })),
);
console.log("buttons", buttons.filter((b) => /bag|Wishlist|XS|Black/i.test(b.text || "")));

const addBtn = await page.evaluateHandle(() =>
  [...document.querySelectorAll("button")].find((b) =>
    b.textContent?.includes("Add to bag"),
  ),
);
const el = addBtn.asElement();
if (!el) {
  console.log("NO ADD BUTTON");
} else {
  const disabled = await el.evaluate((b) => b.disabled);
  console.log("add disabled?", disabled);
  await el.click();
  await new Promise((r) => setTimeout(r, 800));
  const bagText = await page.evaluate(() => document.body.innerText.slice(0, 500));
  console.log("body snippet after click:\n", bagText);
  const store = await page.evaluate(() => localStorage.getItem("copr-commerce-v1"));
  console.log("localStorage", store);
}

await browser.close();
