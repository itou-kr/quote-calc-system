// ...existing code...
import express from "express";

export function init() {
  const app = express();

  // ミドルウェア
  app.use(express.json());

  // 簡単なルート
  app.get("/", (req, res) => {
    res.send("Hello World");
  });

  return app;
}
// ...existing code...