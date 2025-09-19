// backend/src/routes/ai.js
import express from "express";
import fetch from "node-fetch";
import FormData from "form-data";
import multer from "multer";
import dotenv from "dotenv";
import { authenticate } from "../middleware/auth.js";

dotenv.config();

const router = express.Router();
const upload = multer();

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

// ✅ Require auth below this line
router.use(authenticate);

// -------- Chat endpoint --------
router.post("/chat", async (req, res) => {
  try {
    const payload = {
      question:
        req.body.question ??
        req.body.message ??
        req.body.prompt ??
        req.body.text ??
        "",
    };

    const response = await fetch(`${FASTAPI_URL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${PROJECT_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("❌ Error in /chat proxy:", err.message);
    res.status(500).json({ error: "Chat proxy failed" });
  }
});

// -------- STT endpoint --------
router.post("/stt", upload.single("file"), async (req, res) => {
  try {
    const formData = new FormData();
    formData.append("file", req.file.buffer, req.file.originalname);
    if (req.body.lang_hint) formData.append("lang_hint", req.body.lang_hint);

    const response = await fetch(`${FASTAPI_URL}/stt`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PROJECT_API_KEY}`,
      },
      body: formData,
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("❌ Error in /stt proxy:", err.message);
    res.status(500).json({ error: "STT proxy failed" });
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

// -------- SME Generate endpoint --------
router.post("/sme/generate", async (req, res) => {
  try {
    const response = await fetch(`${FASTAPI_URL}/sme/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${PROJECT_API_KEY}`,
      },
      body: JSON.stringify(req.body),
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("❌ SME generate error:", err.message);
    res.status(500).json({ error: "Failed to generate SME site" });
  }
});

// -------- SME Speech Generate endpoint --------
router.post("/sme/speech-generate", upload.single("file"), async (req, res) => {
  try {
    const formData = new FormData();
    formData.append("file", req.file.buffer, req.file.originalname);
    if (req.body.lang_hint) formData.append("lang_hint", req.body.lang_hint);

    const response = await fetch(`${FASTAPI_URL}/sme/speech-generate`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PROJECT_API_KEY}`,
      },
      body: formData,
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("❌ SME speech-generate error:", err.message);
    res.status(500).json({ error: "Failed to generate SME site from speech" });
  }
});

export default router;
