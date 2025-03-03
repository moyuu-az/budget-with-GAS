const { createServer } = require("https");
const { parse } = require("url");
const next = require("next");
const fs = require("fs");
const path = require("path");
const mkcert = require("mkcert");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

async function setupServer() {
  // 証明書を作成
  const CA = await mkcert.createCA({
    organization: "Budget App CA",
    countryCode: "JP",
    state: "Tokyo",
    locality: "Shibuya",
    validityDays: 365,
  });

  const cert = await mkcert.createCert({
    domains: ["localhost", "127.0.0.1"],
    validityDays: 365,
    caKey: CA.key,
    caCert: CA.cert,
  });

  // HTTPS オプション
  const httpsOptions = {
    key: cert.key,
    cert: cert.cert,
  };

  // Next.js アプリを準備
  await app.prepare();

  // HTTPS サーバーを作成
  createServer(httpsOptions, (req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3000, (err) => {
    if (err) throw err;
    console.log("> Ready on https://localhost:3000");
  });
}

setupServer().catch((err) => {
  console.error("証明書の設定中にエラーが発生しました:", err);
  process.exit(1);
});
