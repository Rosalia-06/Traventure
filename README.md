# 🌍 Traventure – Smart Travel App

Traventure is a web-based travel application that helps users explore nearby places, discover food spots, plan routes, and get intelligent travel suggestions in a single platform. It is designed to simplify trip planning while promoting efficient and eco-friendly travel choices.

---

## 🚀 Features

**Explore Places**
Browse popular destinations, nearby attractions, and local spots.

**Food Recommendations**
Discover restaurants, cafés, and street food options around you.

**Smart Navigation**
Choose from multiple route options based on your preference:
* Fastest route
* Eco-friendly route
* Less crowded route
* Well-developed roads

**AI Travel Assistant**
A Gemini-powered chatbot for travel planning, food suggestions, route guidance, and weather-based recommendations — with conversation history and user-preference-aware responses.

**Weather Insights**
Plan activities based on current weather conditions.

**Eco-Friendly Travel**
Encourages sustainable travel through optimized route suggestions and low-impact travel options.

---

## 🛠️ Tech Stack

**Frontend:** React (Vite), custom CSS
**Backend:** Python, FastAPI
**AI:** Google Gemini API (`gemini-3.6-flash`) via `google-genai` SDK
**Deployment:** Render (frontend and backend as separate services)

---

## 📂 Project Structure

traventure/
│── public/
│── src/
│ └── SmartTravelApp.jsx # Main app incl. AI chat UI
│── backend/
│ ├── main.py # FastAPI app + /chat endpoint
│ ├── requirements.txt
│ └── .env.example
│── package.json
│── vite.config.js


---

## 🧑‍💻 Getting Started (Frontend)

```bash
git clone https://github.com/Rosalia-06/Traventure.git
cd Traventure
npm install
npm run dev
```
Runs at `http://localhost:5173`

---

## ⚙️ Getting Started (Backend)

```bash
cd backend
python -m venv venv
venv\Scripts\activate      # Windows
pip install -r requirements.txt
```

Create a `.env` file in `backend/` (copy `.env.example` and add your real key):

GEMINI_API_KEY=your_actual_key_here


Run it:
```bash
uvicorn main:app --reload --port 8000
```
Runs at `http://127.0.0.1:8000` — visit `/docs` for the interactive API explorer.

---

## 🌍 Live Demo

Frontend: https://traventure-4m5a.onrender.com
Backend: https://traventure-backend-jx6j.onrender.com

---

## ⚠️ Note

The AI chatbot requires a valid `GEMINI_API_KEY` set as an environment variable on the backend (locally in `.env`, or in Render's dashboard for deployment). Without it, chatbot responses will fail.

---

## 📌 Future Improvements

* Real-time maps integration
* Live location tracking
* Improved mobile responsiveness
* Multi-city support

---

## 🤝 Contributing

Contributions are welcome. Feel free to fork the repository and submit a pull request.

---

## 📜 License

This project is open-source and available under the MIT License.

---

## 👩‍💻 Author

Developed by **Rosalia-06**