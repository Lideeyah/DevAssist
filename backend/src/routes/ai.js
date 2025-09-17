// backend/src/routes/ai.js
import express from "express";
import fetch from "node-fetch";
import FormData from "form-data";
import multer from "multer";
import dotenv from "dotenv";
import { authenticate } from "../middleware/auth.js";

dotenv.config();

const router = express.Router();
const upload = multer(); // for handling audio uploads

// Base URL of your FastAPI backend
const FASTAPI_URL = process.env.FASTAPI_URL || "https://lydiasolomon-devassist.hf.space";
const PROJECT_API_KEY = process.env.PROJECT_API_KEY;

// -------- Health check --------
router.get("/health", async (req, res) => {
  try {
    const response = await fetch(`${FASTAPI_URL}/`);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("❌ Health check failed:", err.message);
    res.status(500).json({ error: "FastAPI not reachable" });
  }
});

// All routes below require authentication
router.use(authenticate);

// -------- Chat endpoint --------
router.post("/chat", async (req, res) => {
  try {
    const response = await fetch(`${FASTAPI_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${PROJECT_API_KEY}`,
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error("❌ Chat error:", err.message);
    res.status(500).json({ error: "Chat request failed" });
  }
});

// -------- STT endpoint --------
router.post("/stt", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file uploaded" });
    }

    const formData = new FormData();
    formData.append("file", req.file.buffer, req.file.originalname);

    const response = await fetch(`${FASTAPI_URL}/stt`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PROJECT_API_KEY}`,
      },
      body: formData,
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error("❌ STT error:", err.message);
    res.status(500).json({ error: "STT request failed" });
  }
});

// -------- Autodoc endpoint --------
router.post("/autodoc", async (req, res) => {
  try {
    const response = await fetch(`${FASTAPI_URL}/autodoc`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${PROJECT_API_KEY}`,
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error("❌ Autodoc error:", err.message);
    res.status(500).json({ error: "Autodoc request failed" });
  }
});

export default router;
