import cors from "cors";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { careers, recommendCareers } from "./recommendationEngine.js";

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, "../../client/dist");

const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  process.env.CLIENT_URL
].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error("Not allowed by CORS"));
    }
  })
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, service: "career-recommendation-server" });
});

app.get("/api/careers", (_req, res) => {
  res.json({ careers });
});

app.post("/api/recommend", (req, res) => {
  const { interests, skills, personality } = req.body || {};

  if (!Array.isArray(interests) || !skills || !Array.isArray(personality)) {
    return res.status(400).json({
      error: "Expected interests array, skills object, and personality array."
    });
  }

  const recommendations = recommendCareers({ interests, skills, personality });
  res.json({ recommendations });
});

app.use(express.static(clientDistPath));

app.get("*", (_req, res) => {
  res.sendFile(path.join(clientDistPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Career recommendation server running on http://localhost:${PORT}`);
});
