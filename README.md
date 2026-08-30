# 🌍 Traventure – AI-Powered Travel Companion

Traventure is a web app that helps users explore nearby places, get real-time weather-aware suggestions, find food spots, and chat with an AI travel assistant — built for eco-friendly, informed trip planning.

**Live App:** https://traventure-4m5a.onrender.com
**Backend API:** https://traventure-backend-jx6j.onrender.com
**Repo:** https://github.com/Rosalia-06/Traventure

---

## ✨ Features

**AI Travel Assistant**
A Gemini-powered chatbot for travel planning, food suggestions, route guidance, and weather-based recommendations. Maintains conversation history within a session and adapts to stated user preferences (budget, group size, interests). Falls back automatically between two Gemini models if the primary one is unavailable.

**Real-Time Weather**
Uses the browser's actual GPS location (via Open-Meteo, no API key required) to show live temperature and conditions for wherever the user actually is.

**Location-Aware Nearby Places & Food**
Home and Explore pages detect the user's real city (via reverse geocoding) and ask the AI backend for real, named places and restaurants near that location — dynamic per user, cached per session to reduce API load.

**Smart Navigation**
Route options (fastest / eco-friendly / less crowded / well-developed roads) via the AI assistant.

**Eco-Friendly Focus**
Suggestions weighted toward walkable, metro-friendly, low-impact travel choices.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite) |
| Backend | Python, FastAPI |
| AI | Google Gemini API (`gemini-3.5-flash-lite`, auto-fallback to `gemini-3.6-flash`) via `google-genai` SDK (v2.20.0+) |
| Weather | Open-Meteo API (free, no key required) |
| Geolocation | Browser Geolocation API + BigDataCloud reverse geocoding (free, no key required) |
| Deployment | Render (frontend and backend as two separate services) |

---

## 📂 Project Structure

Traventure/
├── src/
│ └── SmartTravelApp.jsx # Main app: pages, chatbot, weather, places
├── backend/
│ ├── main.py # FastAPI app, /chat endpoint, Gemini integration
│ ├── requirements.txt
│ └── .env.example
├── public/
├── package.json
└── vite.config.js


---

## 🧑‍💻 Running Locally

**Frontend:**
```bash
git clone https://github.com/Rosalia-06/Traventure.git
cd Traventure
npm install
npm run dev
```
Runs at `http://localhost:5173`

**Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate      # Windows
pip install -r requirements.txt
```
Copy `.env.example` to `.env` and add your own free Gemini key from https://aistudio.google.com/apikey:

GEMINI_API_KEY=your_actual_key_here

```bash
uvicorn main:app --reload --port 8000
```
Runs at `http://127.0.0.1:8000` — visit `/docs` for the interactive API explorer.

---

## ⚠️ Known Limitations (Honest Disclosure)

- **AI-generated data, not a live Places API.** Nearby places and restaurants come from Gemini's trained knowledge, not a live database like Google Places. Names are real, but ratings and "open now" status are AI-estimated. Chosen deliberately over a paid Places API for this prototype.
- **Free-tier Gemini quota and model churn.** Google's free tier has real daily/per-request limits, and during development this week, three different Gemini model versions were deprecated mid-build. A model-fallback list is built in, but a free API can still occasionally show a fallback message under heavy simultaneous use.
- **Map page uses illustrative pins, not live geodata.** Visual navigation aid, not tied to precise real-world coordinates.
- **Backend cold starts.** Runs on Render's free tier, which spins down after ~15 minutes idle. First request after that can take 30-50 seconds.
- **Location permission required.** Weather and nearby-places features need browser location access; if denied, they show a fallback message instead of data.
- **Chat history resets on page reload.** Conversation context persists within a session but isn't saved across refreshes or navigation away from the chat page.

---

## 🔒 Security

- **Rate limiting** on the `/chat` endpoint (10 requests/minute per IP) via `slowapi`, to prevent abuse and protect the free-tier Gemini quota from being exhausted by direct API calls that bypass the frontend.
- **CORS restricted** to the app's actual frontend origins only — the backend does not accept cross-origin browser requests from arbitrary sites.
- **API key never exposed to the client** — `GEMINI_API_KEY` is loaded server-side only via environment variables and is never sent in any frontend response or bundled JS.

---

## 🔮 Future Improvements

- Real-time Places API integration (Google Places / Foursquare) for live ratings and open/closed status
- Persistent chat history across sessions
- Live map with real coordinates and routing
- Keep-alive mechanism to avoid backend cold starts
- Multi-city support

---

## 👩‍💻 Author

**Vanshika Sangal**
GitHub: [@Rosalia-06](https://github.com/Rosalia-06)

---

## 📜 License

Open-source, available under the MIT License.