import { useState, useRef, useEffect } from "react";

// ─── Styles ──────────────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:        #0a0f1a;
    --surface:   #111827;
    --card:      #1a2235;
    --border:    rgba(255,255,255,0.07);
    --accent:    #38bdf8;
    --accent2:   #f59e0b;
    --accent3:   #34d399;
    --text:      #e2e8f0;
    --muted:     #64748b;
    --user-bg:   #1e3a5f;
    --ai-bg:     #1a2235;
    --font-head: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
    --radius:    16px;
    --radius-sm: 10px;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--font-body); }

  /* ── Layout ── */
  .ts-app {
    display: flex;
    flex-direction: column;
    height: 100vh;
    max-width: 480px;
    margin: 0 auto;
    background: var(--bg);
    position: relative;
    overflow: hidden;
  }

  /* ── Ambient grid background ── */
  .ts-app::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(56,189,248,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(56,189,248,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
    z-index: 0;
  }

  /* ── Header ── */
  .ts-header {
    position: relative;
    z-index: 10;
    padding: 20px 20px 16px;
    background: linear-gradient(180deg, #0a0f1a 80%, transparent);
    display: flex;
    align-items: center;
    gap: 14px;
    border-bottom: 1px solid var(--border);
  }
  .ts-logo {
    width: 42px; height: 42px;
    background: linear-gradient(135deg, var(--accent), #0369a1);
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
    box-shadow: 0 0 20px rgba(56,189,248,0.3);
  }
  .ts-title { font-family: var(--font-head); font-size: 20px; font-weight: 700; letter-spacing: -0.3px; }
  .ts-subtitle { font-size: 12px; color: var(--muted); margin-top: 1px; font-weight: 300; }
  .ts-status {
    margin-left: auto;
    display: flex; align-items: center; gap: 6px;
    font-size: 11px; color: var(--accent3); font-weight: 500; letter-spacing: 0.3px;
  }
  .ts-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: var(--accent3);
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.5; transform: scale(0.85); }
  }

  /* ── Quick chips ── */
  .ts-chips {
    position: relative; z-index: 10;
    display: flex; gap: 8px;
    padding: 12px 20px;
    overflow-x: auto;
    scrollbar-width: none;
  }
  .ts-chips::-webkit-scrollbar { display: none; }
  .ts-chip {
    flex-shrink: 0;
    padding: 7px 14px;
    border-radius: 99px;
    border: 1px solid var(--border);
    background: var(--card);
    color: var(--text);
    font-family: var(--font-body);
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s;
    white-space: nowrap;
    display: flex; align-items: center; gap: 5px;
  }
  .ts-chip:hover {
    border-color: var(--accent);
    color: var(--accent);
    background: rgba(56,189,248,0.08);
    transform: translateY(-1px);
  }

  /* ── Messages ── */
  .ts-messages {
    flex: 1;
    overflow-y: auto;
    padding: 12px 16px 8px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    position: relative;
    z-index: 5;
    scrollbar-width: thin;
    scrollbar-color: var(--border) transparent;
  }

  /* ── Message bubbles ── */
  .ts-msg { display: flex; gap: 10px; align-items: flex-end; animation: fadeUp 0.3s ease; }
  .ts-msg.user { flex-direction: row-reverse; }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .ts-avatar {
    width: 30px; height: 30px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; flex-shrink: 0;
    background: linear-gradient(135deg, var(--accent), #0369a1);
    box-shadow: 0 0 12px rgba(56,189,248,0.25);
  }
  .ts-msg.user .ts-avatar {
    background: linear-gradient(135deg, var(--accent2), #d97706);
    box-shadow: 0 0 12px rgba(245,158,11,0.25);
  }

  .ts-bubble {
    max-width: 80%;
    padding: 12px 15px;
    border-radius: var(--radius);
    font-size: 14px;
    line-height: 1.6;
    position: relative;
  }
  .ts-msg.ai   .ts-bubble { background: var(--ai-bg);   border: 1px solid var(--border); border-bottom-left-radius: 4px; }
  .ts-msg.user .ts-bubble { background: var(--user-bg); border: 1px solid rgba(56,189,248,0.2); border-bottom-right-radius: 4px; }

  /* ── Typing indicator ── */
  .ts-typing { display: flex; gap: 5px; padding: 4px 2px; align-items: center; }
  .ts-typing span {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--accent); opacity: 0.5;
    animation: bounce 1.2s infinite;
  }
  .ts-typing span:nth-child(2) { animation-delay: 0.2s; }
  .ts-typing span:nth-child(3) { animation-delay: 0.4s; }
  @keyframes bounce {
    0%, 80%, 100% { transform: translateY(0);    opacity: 0.5; }
    40%           { transform: translateY(-5px); opacity: 1;   }
  }

  /* ── Place cards inside messages ── */
  .ts-places { display: flex; flex-direction: column; gap: 8px; margin-top: 10px; }
  .ts-place-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 10px 12px;
    display: flex; gap: 10px; align-items: center;
    transition: border-color 0.2s;
    cursor: pointer;
  }
  .ts-place-card:hover { border-color: rgba(56,189,248,0.4); }
  .ts-place-icon {
    width: 36px; height: 36px; border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; flex-shrink: 0;
  }
  .ts-place-info .name { font-size: 13px; font-weight: 500; color: var(--text); }
  .ts-place-info .meta { font-size: 11px; color: var(--muted); margin-top: 2px; }
  .ts-badge {
    margin-left: auto; flex-shrink: 0;
    font-size: 10px; padding: 3px 8px; border-radius: 99px;
    font-weight: 600; letter-spacing: 0.3px;
  }
  .ts-badge.open  { background: rgba(52,211,153,0.15); color: var(--accent3); }
  .ts-badge.busy  { background: rgba(245,158,11,0.15);  color: var(--accent2); }

  /* ── Weather widget ── */
  .ts-weather {
    background: linear-gradient(135deg, rgba(56,189,248,0.1), rgba(99,102,241,0.1));
    border: 1px solid rgba(56,189,248,0.2);
    border-radius: var(--radius-sm);
    padding: 12px 14px;
    margin-top: 10px;
    display: flex; align-items: center; gap: 14px;
  }
  .ts-weather .icon { font-size: 36px; }
  .ts-weather .temp { font-family: var(--font-head); font-size: 28px; font-weight: 700; }
  .ts-weather .desc { font-size: 12px; color: var(--muted); }

  /* ── Input area ── */
  .ts-input-area {
    position: relative; z-index: 10;
    padding: 12px 16px 20px;
    background: linear-gradient(0deg, #0a0f1a 85%, transparent);
    display: flex; gap: 10px; align-items: flex-end;
  }
  .ts-input-wrap {
    flex: 1;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 99px;
    display: flex; align-items: center;
    padding: 10px 16px;
    gap: 8px;
    transition: border-color 0.2s;
  }
  .ts-input-wrap:focus-within { border-color: rgba(56,189,248,0.5); }
  .ts-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: var(--text);
    font-family: var(--font-body);
    font-size: 14px;
    resize: none;
    max-height: 100px;
    line-height: 1.5;
  }
  .ts-input::placeholder { color: var(--muted); }

  .ts-send-btn {
    width: 42px; height: 42px; border-radius: 50%;
    background: linear-gradient(135deg, var(--accent), #0369a1);
    border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
    transition: all 0.2s;
    flex-shrink: 0;
    box-shadow: 0 0 16px rgba(56,189,248,0.3);
  }
  .ts-send-btn:hover:not(:disabled) { transform: scale(1.08); box-shadow: 0 0 24px rgba(56,189,248,0.5); }
  .ts-send-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

  /* ── Welcome screen ── */
  .ts-welcome {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    flex: 1; padding: 32px 24px; text-align: center; gap: 8px;
  }
  .ts-welcome-icon { font-size: 52px; margin-bottom: 8px; animation: float 3s ease-in-out infinite; }
  @keyframes float {
    0%, 100% { transform: translateY(0);   }
    50%       { transform: translateY(-8px); }
  }
  .ts-welcome h2 { font-family: var(--font-head); font-size: 22px; font-weight: 700; }
  .ts-welcome p  { color: var(--muted); font-size: 14px; line-height: 1.6; max-width: 280px; }

  /* ── Message markdown-like formatting ── */
  .ts-bubble strong { color: var(--accent); font-weight: 600; }
  .ts-bubble em     { color: var(--accent2); font-style: normal; }
  .ts-bubble .tip   {
    margin-top: 8px; padding: 8px 10px;
    background: rgba(52,211,153,0.08); border-left: 3px solid var(--accent3);
    border-radius: 0 6px 6px 0; font-size: 12px; color: var(--accent3);
  }

  /* ── Timestamp ── */
  .ts-time { font-size: 10px; color: var(--muted); margin-top: 4px; text-align: right; }
  .ts-msg.ai .ts-time { text-align: left; }

  /* scrollbar */
  .ts-messages::-webkit-scrollbar       { width: 4px; }
  .ts-messages::-webkit-scrollbar-track { background: transparent; }
  .ts-messages::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }
`;

// ─── RULE-BASED AI ENGINE ─────────────────────────────────────────────────────
const RULE_SYSTEM_PROMPT = `You are TravelBot, an intelligent travel assistant inside the "Travel Smart" app.
You help users plan trips, discover places, find food, and get weather-based advice.

PERSONALITY:
- Friendly, concise, knowledgeable local guide
- Use relevant emojis naturally (not excessively)
- Always give ACTIONABLE suggestions, not generic advice

RESPONSE RULES:
1. Keep responses short and punchy (3-6 sentences max for plain text)
2. When suggesting places, ALWAYS output a JSON block at the END of your response (after your text) in this exact format:
   [PLACES_JSON]
   [{"name":"...", "type":"...", "emoji":"...", "rating":"4.5★", "status":"Open", "desc":"..."}]
   [/PLACES_JSON]
   Include 2-4 places when relevant.

3. When user asks about weather or conditions, output a weather block:
   [WEATHER_JSON]
   {"temp":"28°C", "condition":"Sunny", "emoji":"☀️", "advice":"..."}
   [/WEATHER_JSON]

4. For rainy/bad weather → suggest indoor places (cafés, museums, malls, galleries)
5. For hot weather → suggest morning/evening plans, shade, water activities
6. For food queries → suggest restaurants/street food with quick descriptions
7. For "things to do" → mix of activities based on time of day
8. Always end with a short tip or follow-up question to keep the conversation going.

PLACE TYPES & EMOJIS: restaurant🍽️, café☕, museum🏛️, park🌳, beach🏖️, mall🛍️, bar🍸, viewpoint🌅, temple🛕, market🛒, hotel🏨, gym💪

Do NOT say you can't access real-time data. Instead, give confident, helpful mock recommendations as if you're a knowledgeable local.`;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function now() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function parseAIResponse(raw) {
  let text = raw;
  let places = [];
  let weather = null;

  const placesMatch = raw.match(/\[PLACES_JSON\]([\s\S]*?)\[\/PLACES_JSON\]/);
  if (placesMatch) {
    try { places = JSON.parse(placesMatch[1].trim()); } catch {}
    text = text.replace(/\[PLACES_JSON\][\s\S]*?\[\/PLACES_JSON\]/, "").trim();
  }

  const weatherMatch = raw.match(/\[WEATHER_JSON\]([\s\S]*?)\[\/WEATHER_JSON\]/);
  if (weatherMatch) {
    try { weather = JSON.parse(weatherMatch[1].trim()); } catch {}
    text = text.replace(/\[WEATHER_JSON\][\s\S]*?\[\/WEATHER_JSON\]/, "").trim();
  }

  return { text, places, weather };
}

function renderText(text) {
  // Bold **text**, italic *text*, and tip lines
  return text
    .split("\n")
    .map((line, i) => {
      const isTip = line.toLowerCase().startsWith("💡") || line.toLowerCase().startsWith("tip:");
      const formatted = line
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.+?)\*/g, "<em>$1</em>");
      if (isTip) return `<div class="tip">${formatted}</div>`;
      return `<span>${formatted}</span>`;
    })
    .join("<br/>");
}

// ─── Quick prompt chips ───────────────────────────────────────────────────────
const CHIPS = [
  { label: "Things to do today", icon: "🗺️" },
  { label: "Best food nearby",   icon: "🍜" },
  { label: "Rainy day plans",    icon: "🌧️" },
  { label: "Plan 3-hour trip",   icon: "⏱️" },
  { label: "Local hidden gems",  icon: "💎" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function PlaceCard({ place }) {
  return (
    <div className="ts-place-card">
      <div className="ts-place-icon" style={{ background: "rgba(56,189,248,0.1)" }}>
        {place.emoji}
      </div>
      <div className="ts-place-info">
        <div className="name">{place.name}</div>
        <div className="meta">{place.rating} · {place.desc}</div>
      </div>
      <span className={`ts-badge ${place.status === "Open" ? "open" : "busy"}`}>
        {place.status}
      </span>
    </div>
  );
}

function WeatherWidget({ w }) {
  return (
    <div className="ts-weather">
      <div className="icon">{w.emoji}</div>
      <div>
        <div className="temp">{w.temp}</div>
        <div className="desc">{w.condition} · {w.advice}</div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="ts-msg ai">
      <div className="ts-avatar">✈️</div>
      <div className="ts-bubble">
        <div className="ts-typing">
          <span /><span /><span />
        </div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function TravelSmartApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState("");
  const [loading, setLoading]   = useState(false);
  const messagesEndRef           = useRef(null);
  const textareaRef              = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 100) + "px";
  }, [input]);

  async function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg = { role: "user", content: trimmed, time: now() };
    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInput("");
    setLoading(true);

    try {
      const apiMessages = updatedHistory.map(m => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.rawContent || m.content,
      }));

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: RULE_SYSTEM_PROMPT,
          messages: apiMessages,
        }),
      });

      const data = await res.json();
      const raw = data.content?.find(b => b.type === "text")?.text || "Sorry, I couldn't process that.";
      const { text: parsedText, places, weather } = parseAIResponse(raw);

      setMessages(prev => [
        ...prev,
        {
          role:       "assistant",
          content:    parsedText,
          rawContent: raw,
          places,
          weather,
          time:       now(),
        },
      ]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role:    "assistant",
          content: "Oops — couldn't connect right now. Try again in a moment! 🔄",
          places:  [],
          weather: null,
          time:    now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }

  return (
    <>
      <style>{STYLES}</style>
      <div className="ts-app">

        {/* Header */}
        <header className="ts-header">
          <div className="ts-logo">✈️</div>
          <div>
            <div className="ts-title">Travel Smart</div>
            <div className="ts-subtitle">Your AI travel companion</div>
          </div>
          <div className="ts-status">
            <div className="ts-dot" />
            AI Online
          </div>
        </header>

        {/* Quick chips */}
        <div className="ts-chips">
          {CHIPS.map(c => (
            <button key={c.label} className="ts-chip" onClick={() => sendMessage(c.label)}>
              {c.icon} {c.label}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="ts-messages">
          {messages.length === 0 && (
            <div className="ts-welcome">
              <div className="ts-welcome-icon">🌍</div>
              <h2>Where to today?</h2>
              <p>Ask me anything — food spots, weather advice, hidden gems, or a full trip plan.</p>
            </div>
          )}

          {messages.map((msg, idx) => (
            <div key={idx} className={`ts-msg ${msg.role === "user" ? "user" : "ai"}`}>
              <div className="ts-avatar">
                {msg.role === "user" ? "👤" : "✈️"}
              </div>
              <div>
                <div className="ts-bubble">
                  <span dangerouslySetInnerHTML={{ __html: renderText(msg.content) }} />
                  {msg.weather && <WeatherWidget w={msg.weather} />}
                  {msg.places?.length > 0 && (
                    <div className="ts-places">
                      {msg.places.map((p, i) => <PlaceCard key={i} place={p} />)}
                    </div>
                  )}
                </div>
                <div className="ts-time">{msg.time}</div>
              </div>
            </div>
          ))}

          {loading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="ts-input-area">
          <div className="ts-input-wrap">
            <span style={{ fontSize: 16 }}>🔍</span>
            <textarea
              ref={textareaRef}
              className="ts-input"
              rows={1}
              placeholder="Ask anything about your trip..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
            />
          </div>
          <button
            className="ts-send-btn"
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
          >
            ➤
          </button>
        </div>

      </div>
    </>
  );
}
