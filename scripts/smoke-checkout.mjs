import puppeteer from "puppeteer-core";

const browser = await puppeteer.launch({
  executablePath: "/usr/local/bin/google-chrome",
  headless: true,
  args: ["--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage"],
});
const page = await browser.newPage();
page.setViewport({ width: 1280, height: 900 });
page.on("pageerror", (err) => console.log("PAGEERROR", err.message));

await page.goto("http://localhost:3000/shop/training-mesh-tee", {
  waitUntil: "networkidle0",
});
await page.evaluate(() => localStorage.clear());
await page.reload({ waitUntil: "networkidle0" });

await page.evaluate(() => {
  const btn = [...document.querySelectorAll("button")].find((b) =>
    b.textContent?.includes("Add to bag"),
  );
  btn?.click();
});
await new Promise((r) => setTimeout(r, 500));

const drawer = await page.evaluate(() =>
  document.body.innerText.includes("Checkout"),
);
console.log("drawer shows checkout?", drawer);

await page.goto("http://localhost:3000/checkout", { waitUntil: "networkidle0" });
await page.type('input[name="fullName"]', "Thandi Phiri");
await page.type('input[name="email"]', "thandi@example.com");
await page.type('input[name="phone"]', "+260971234567");
await page.select('select[name="area"]', "Kabulonga");
await page.type('input[name="neighbourhood"]', "Twin Palm Road");
await page.type('input[name="landmark"]', "Blue gate");

await Promise.all([
  page.waitForNavigation({ waitUntil: "networkidle0", timeout: 15000 }).catch(() => null),
  page.click('button[type="submit"]'),
]);
await new Promise((r) => setTimeout(r, 1000));

console.log("url", page.url());
const text = await page.evaluate(() => document.body.innerText);
console.log(
  "has HELD?",
  /HELD/i.test(text),
  "has tracking?",
  /Order tracking|Brand shipments/i.test(text),
);

if (/Mark shipped/i.test(text)) {
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll("button")].find((b) =>
      b.textContent?.includes("Mark shipped"),
    );
    btn?.click();
  });
  await new Promise((r) => setTimeout(r, 400));
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll("button")].find((b) =>
      b.textContent?.includes("Confirm delivery"),
    );
    btn?.click();
  });
  await new Promise((r) => setTimeout(r, 400));
  const after = await page.evaluate(() => document.body.innerText);
  console.log("released?", /released|Escrow released/i.test(after));
}

await page.goto("http://localhost:3000/account", { waitUntil: "networkidle0" });
await page.type('input[name="fullName"]', "Thandi Phiri");
await page.type('input[name="email"]', "thandi@example.com");
await page.click('button[type="submit"]');
await new Promise((r) => setTimeout(r, 500));
const account = await page.evaluate(() => document.body.innerText);
console.log("signed in?", /Signed in|thandi@example.com|Thandi/i.test(account));
console.log("account snippet", account.slice(0, 400));

await browser.close();
console.log("DONE");
