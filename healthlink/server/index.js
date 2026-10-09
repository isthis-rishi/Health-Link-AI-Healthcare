import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Health Link API is running" });
});

app.post("/api/ai/symptom-check", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    const SYSTEM_PROMPT = `You are an AI-powered medical triage assistant for a community healthcare application. Your role is to:

1. Ask focused, relevant follow-up questions about the patient's symptoms (one or two at a time)
2. Assess the urgency of the situation based on the symptoms described
3. After gathering enough information (usually 3-5 exchanges), provide a triage recommendation

Your triage levels are:
- EMERGENCY: Life-threatening symptoms requiring immediate medical attention (e.g., chest pain, difficulty breathing, severe bleeding, loss of consciousness)
- URGENT: Needs medical attention within a few hours (e.g., high fever, severe pain, allergic reactions)
- ROUTINE: Can be addressed with a scheduled appointment (e.g., mild cold, minor aches, skin rashes)
- SELF-CARE: Can be managed at home with basic care (e.g., common cold, minor headache, small cuts)

Rules:
- Be empathetic and reassuring but never diagnose specific conditions
- Always ask about critical red-flag symptoms when relevant
- Ask about duration, severity, and any existing medical conditions
- Keep responses concise and easy to understand
- When you have enough information, provide your triage assessment in this exact format:

**TRIAGE ASSESSMENT**
Level: [EMERGENCY/URGENT/ROUTINE/SELF-CARE]
Summary: [Brief summary of symptoms]
Recommendation: [What the patient should do next]

- Never replace professional medical advice
- If symptoms suggest an emergency, immediately recommend calling emergency services`;

    const contents = messages.map(msg => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }]
    }));

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents,
          generationConfig: { temperature: 0.7, maxOutputTokens: 500 }
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Gemini API error:", errorData);
      return res.status(500).json({ error: "AI service unavailable" });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return res.status(500).json({ error: "No response from AI" });
    }

    let triageResult = null;
    if (text.includes("TRIAGE ASSESSMENT")) {
      const levelMatch = text.match(/Level:\s*(EMERGENCY|URGENT|ROUTINE|SELF-CARE)/i);
      const summaryMatch = text.match(/Summary:\s*(.+?)(?:\n|$)/i);
      const recommendationMatch = text.match(/Recommendation:\s*(.+?)(?:\n|$)/i);

      if (levelMatch) {
        triageResult = {
          level: levelMatch[1].toUpperCase(),
          summary: summaryMatch ? summaryMatch[1].trim() : "",
          recommendation: recommendationMatch ? recommendationMatch[1].trim() : ""
        };
      }
    }

    res.json({ message: text, triageResult });
  } catch (error) {
    console.error("Symptom check error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http:
});
