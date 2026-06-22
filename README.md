# GenAI Quiz V6 🚀

Ein universelles KI-gestütztes Quiz- und Prüfungstraining mit:

- ✅ Lernmodus
- ✅ Prüfungsmodus
- ✅ 60-Minuten-Timer
- ✅ Bestehensgrenze (65%)
- ✅ Fehleranalyse
- ✅ Themenstatistik
- ✅ Mehrsprachigkeit (DE / EN)
- ✅ GitHub Pages Hosting
- ✅ Netlify Functions
- ✅ OpenRouter AI Integration
- ✅ Automatische Übersetzung von Fragen per KI
- ✅ Unterstützung für zukünftige Quiz-Typen (ISTQB, GenAI, CKA, Linux, AWS, Security+, etc.)

---

# Funktionen

## Lernmodus

- Sofortige Auswertung
- Richtige Lösung direkt sichtbar
- Erklärung anzeigen
- Perfekt zum Lernen

## Prüfungsmodus

- Antworten werden gespeichert
- Keine direkte Auswertung
- Ergebnis erst am Ende
- Realistische Prüfungssimulation

## Prüfungssimulator

- Zufällige Fragen
- Timer
- Bestehensgrenze 65%

---

# Bewertung

| Ergebnis | Status |
|-----------|----------|
| < 65 % | ❌ Nicht bestanden |
| ≥ 65 % | ✅ Bestanden |

---

# Mehrsprachigkeit

Der Quiztrainer unterstützt:

- 🇩🇪 Deutsch
- 🇬🇧 Englisch

### Besonderheit

Die Originalfragen liegen als Screenshots vor.

Über OpenRouter + Netlify werden diese:

1. per OCR erkannt
2. übersetzt
3. lokal gespeichert
4. im Quiz angezeigt

---

# Projektstruktur

```text
genai-quiz/
│
├── index.html
│
├── README.md
│
└── netlify
    └── functions
        └── translate.js
```

---

# GitHub Pages

Das Frontend wird über GitHub Pages bereitgestellt.

Repository:

```text
https://github.com/steven-sarpong/genai-quiz
```

Live URL:

```text
https://steven-sarpong.github.io/genai-quiz/
```

---

# Netlify Function

Die Übersetzungsfunktion läuft auf Netlify.

Beispiel URL:

```text
https://keen-swan-cdc7f5.netlify.app/.netlify/functions/translate
```

---

# OpenRouter Integration

Die KI-Übersetzung läuft über OpenRouter.

Aktuell verwendetes Modell:

```javascript
nvidia/nemotron-3-ultra-550b-a55b:free
```

Alternativen:

```javascript
google/gemini-2.5-flash
```

```javascript
nvidia/nemotron-3-nano-omni:free
```

```javascript
nvidia/nemotron-parse
```

---

# Environment Variables

In Netlify hinterlegen:

```text
OPENROUTER_API_KEY
```

Optional:

```text
OPENROUTER_MODEL
```

Beispiel:

```text
OPENROUTER_MODEL=nvidia/nemotron-3-ultra-550b-a55b:free
```

---

# Automatische Übersetzung

Workflow:

```text
Quiz
 ↓
Screenshot Frage
 ↓
Netlify Function
 ↓
OpenRouter
 ↓
OCR
 ↓
Übersetzung
 ↓
JSON
 ↓
Quiz
```

---

# Zukünftige Features

## Quiz Manager

Eigene Quiz erstellen:

- GenAI
- ISTQB
- CKA
- Linux Essentials
- AWS
- Security+
- Azure
- Kubernetes

---

## PDF Import

Geplant:

```text
PDF hochladen
 ↓
Fragen erkennen
 ↓
KI analysiert
 ↓
Antworten erzeugen
 ↓
Quiz automatisch erstellen
```

---

## AI Solution Engine

Geplant:

```text
Neue Frage
 ↓
OpenRouter
 ↓
Lösungsvorschlag
 ↓
Review
 ↓
Lösungsschlüssel
```

---

# Lokale Entwicklung

Projekt klonen:

```bash
git clone https://github.com/steven-sarpong/genai-quiz.git
```

Starten:

```bash
cd genai-quiz
```

```bash
open index.html
```

oder

```bash
python -m http.server 8000
```

---

# Deployment

## GitHub

```bash
git add .
git commit -m "Update Quiz"
git push
```

## Netlify

Automatisches Deployment nach Git Push.

---

# Tastenkürzel

| Taste | Funktion |
|---------|----------|
| A-E | Antwort wählen |
| Enter | Prüfen |
| ← | Vorherige Frage |
| → | Nächste Frage |

---

# Autor

Steven Sarpong

---

# Vision

Ein universeller AI-Prüfungstrainer, der jede Zertifizierung automatisch in ein interaktives Lernsystem verwandeln kann.

Ziel:

```text
PDF
 ↓
AI Analyse
 ↓
Quiz
 ↓
Training
 ↓
Prüfung bestehen
```

🚀
