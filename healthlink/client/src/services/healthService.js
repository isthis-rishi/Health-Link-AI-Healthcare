const GEMINI_API_KEY = "AIzaSyARIiyNEviYo1GGf84uJhNKmO0aI_8hjJk";

const SYSTEM_PROMPT = `You are an AI medical triage assistant for Health Link, a community healthcare app.

Your job:
1. Ask focused follow-up questions (1-2 at a time)
2. Be empathetic and concise (2-3 sentences + question)
3. After 3-5 exchanges, provide triage assessment

When ready, use this EXACT format:
**TRIAGE ASSESSMENT**
Level: [EMERGENCY/URGENT/ROUTINE/SELF-CARE]
Summary: [Brief symptom summary]
Recommendation: [What patient should do]

EMERGENCY = life-threatening (call 108/112 immediately)
URGENT = needs care within hours
ROUTINE = schedule appointment
SELF-CARE = manage at home

Never diagnose specific conditions. Always recommend consulting a doctor for medical advice.`;

export const sendSymptomQuery = async (conversationMessages) => {
  const contents = [];

  for (const msg of conversationMessages) {
    const role = msg.role === "user" ? "user" : "model";
    if (contents.length > 0 && contents[contents.length - 1].role === role) {
      contents[contents.length - 1].parts[0].text += "\n" + msg.content;
    } else {
      contents.push({ role, parts: [{ text: msg.content }] });
    }
  }

  while (contents.length > 0 && contents[0].role !== "user") {
    contents.shift();
  }

  if (contents.length === 0) {
    throw new Error("No messages to send");
  }

  const models = [
    "gemini-2.0-flash",
    "gemini-2.5-flash",
    "gemini-1.5-flash-latest"
  ];

  let lastError = "";

  for (const model of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`;

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents,
          generationConfig: { temperature: 0.7, maxOutputTokens: 500 }
        })
      });

      if (!response.ok) {
        const errText = await response.text();
        lastError = `${model}: ${response.status} - ${errText.substring(0, 150)}`;
        console.warn("Model failed:", lastError);
        continue;
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!text) {
        lastError = `${model}: Empty response`;
        continue;
      }

      let triageResult = null;
      if (text.includes("TRIAGE ASSESSMENT")) {
        const lv = text.match(/Level:\s*(EMERGENCY|URGENT|ROUTINE|SELF-CARE)/i);
        const sm = text.match(/Summary:\s*(.+?)(?:\n|$)/i);
        const rc = text.match(/Recommendation:\s*(.+?)(?:\n|$)/i);
        if (lv) {
          triageResult = {
            level: lv[1].toUpperCase(),
            summary: sm ? sm[1].trim() : "",
            recommendation: rc ? rc[1].trim() : ""
          };
        }
      }

      return { message: text, triageResult };
    } catch (err) {
      lastError = `${model}: ${err.message}`;
      continue;
    }
  }

  throw new Error(lastError || "All models failed");
};
