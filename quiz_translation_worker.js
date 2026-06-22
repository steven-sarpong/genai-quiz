export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders() });
    if (request.method !== "POST") return json({ error: "Only POST allowed" }, 405);

    const body = await request.json();
    const target = body.targetLanguage === "en" ? "English" : body.targetLanguage;

    const prompt = `
You translate and structure quiz screenshots.
Target language: ${target}

Return only valid JSON:
{
  "question": "translated question text",
  "options": {"A":"...", "B":"...", "C":"...", "D":"...", "E":"..."},
  "note": "translated explanation if provided",
  "topic": "translated topic"
}

Keep option letters A-E unchanged. Do not solve the question, only translate/transcribe.
Existing answer key: ${(body.answer || []).join(", ")}
Existing note: ${body.note || ""}
Existing topic: ${body.topic || ""}
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": env.SITE_URL || "https://steven-sarpong.github.io/genai-quiz/",
        "X-OpenRouter-Title": "Quiz Translation Worker"
      },
      body: JSON.stringify({
        model: env.OPENROUTER_MODEL || "google/gemini-2.0-flash-exp:free",
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

    const result = await response.json();
    const text = result.choices?.[0]?.message?.content || "{}";
    let parsed;
    try { parsed = JSON.parse(text.replace(/```json|```/g, "").trim()); }
    catch(e) { parsed = { question:"", options:{}, note:"Translation failed.", topic: body.topic || "" }; }
    return json(parsed);
  }
};
function json(data,status=200){return new Response(JSON.stringify(data),{status,headers:{...corsHeaders(),"Content-Type":"application/json"}})}
function corsHeaders(){return {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"POST, OPTIONS","Access-Control-Allow-Headers":"Content-Type"}}
