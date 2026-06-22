export async function handler(event) {
  if (event.httpMethod === "OPTIONS") return response({});
  if (event.httpMethod !== "POST") return response({ error: "Only POST allowed" }, 405);
  const body = JSON.parse(event.body || "{}");
  const prompt = `Translate and structure this English quiz screenshot into German.

Return only valid JSON:
{
  "question": "deutsche Frage",
  "options": {"A":"...", "B":"...", "C":"...", "D":"...", "E":"..."},
  "note": "deutsche Erklärung, falls vorhanden",
  "topic": "deutsches Thema"
}

Keep option letters A-E unchanged. Do not solve the question, only translate/transcribe.
Existing answer key: ${(body.answer || []).join(", ")}
Existing note: ${body.note || ""}
Existing topic: ${body.topic || ""}`;

  const apiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "https://steven-sarpong.github.io/genai-quiz/",
      "X-OpenRouter-Title": "Quiz German Translation"
    },
    body: JSON.stringify({
      model: process.env.OPENROUTER_MODEL || "google/gemini-2.0-flash-exp:free",
      messages: [
        { role: "system", content: "Return only valid JSON. No markdown." },
        { role: "user", content: [
          { type: "text", text: prompt },
          { type: "image_url", image_url: { url: body.image } }
        ]}
      ],
      temperature: 0.1
    })
  });
  const result = await apiRes.json();
  const text = result.choices?.[0]?.message?.content || "{}";
  let parsed;
  try { parsed = JSON.parse(text.replace(/```json|```/g, "").trim()); }
  catch { parsed = { question:"", options:{}, note:"Übersetzung fehlgeschlagen.", topic: body.topic || "" }; }
  return response(parsed);
}
function response(data, statusCode = 200) {
  return { statusCode, headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  }, body: JSON.stringify(data) };
}
