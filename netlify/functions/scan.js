export async function handler(event) {
  if (event.httpMethod === "OPTIONS") return response({});
  if (event.httpMethod !== "POST") return response({ error: "Only POST allowed" }, 405);
  const body = JSON.parse(event.body || "{}");
  const prompt = `You are reading a photo of a quiz/exam question (multiple choice, options A-E).
Extract and structure it. Return only valid JSON:
{
  "question": "the question text",
  "options": {"A":"...", "B":"...", "C":"...", "D":"...", "E":"..."},
  "answer": ["A"],
  "multi": false,
  "topic": "short topic label",
  "note": "short explanation of why the answer is correct, if you can infer it"
}
Only include option letters that are visible in the photo. "answer" is your best-effort guess of the correct option letter(s) based on the visible content and your own knowledge - the user will review and correct it. Set "multi" to true only if the question explicitly asks to select more than one answer.`;

  if (!process.env.OPENROUTER_API_KEY) {
    return response({ question:"", options:{}, answer:[], multi:false, topic:"", note:"Scan fehlgeschlagen.", error: "OPENROUTER_API_KEY ist auf Netlify nicht gesetzt." }, 200);
  }
  if (!body.image) {
    return response({ question:"", options:{}, answer:[], multi:false, topic:"", note:"Scan fehlgeschlagen.", error: "Kein Bild übergeben (body.image fehlt)." }, 200);
  }

  let apiRes, result;
  try {
    apiRes = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://steven-sarpong.github.io/genai-quiz/",
        "X-OpenRouter-Title": "Quiz Photo Scan"
      },
      body: JSON.stringify({
        model: process.env.OPENROUTER_MODEL || "google/gemini-2.5-flash-lite",
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
    result = await apiRes.json();
  } catch (e) {
    return response({ question:"", options:{}, answer:[], multi:false, topic:"", note:"Scan fehlgeschlagen.", error: "Netzwerkfehler beim Aufruf von OpenRouter: " + e.message }, 200);
  }

  if (!apiRes.ok || result.error) {
    return response({ question:"", options:{}, answer:[], multi:false, topic:"", note:"Scan fehlgeschlagen.", error: "OpenRouter-Fehler (" + apiRes.status + "): " + (result.error?.message || JSON.stringify(result)) }, 200);
  }

  const text = result.choices?.[0]?.message?.content || "{}";
  let parsed;
  try { parsed = JSON.parse(text.replace(/```json|```/g, "").trim()); }
  catch { parsed = { question: "", options: {}, answer: [], multi: false, topic: "", note: "Scan fehlgeschlagen.", error: "Antwort war kein gültiges JSON: " + text.slice(0,200) }; }
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
