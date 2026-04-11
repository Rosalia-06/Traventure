import { useState, useRef, useEffect, useCallback } from "react";

// ─── Design Tokens & Global Styles ──────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=Cabinet+Grotesk:wght@300;400;500;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:         #070d18;
    --surface:    #0f1923;
    --card:       #141f2e;
    --card2:      #192638;
    --border:     rgba(255,255,255,0.07);
    --border2:    rgba(255,255,255,0.12);
    --accent:     #38bdf8;
    --accent-dim: rgba(56,189,248,0.12);
    --green:      #34d399;
    --green-dim:  rgba(52,211,153,0.12);
    --amber:      #fbbf24;
    --amber-dim:  rgba(251,191,36,0.12);
    --coral:      #fb7185;
    --coral-dim:  rgba(251,113,133,0.12);
    --purple:     #a78bfa;
    --purple-dim: rgba(167,139,250,0.12);
    --text:       #e2e8f0;
    --text2:      #94a3b8;
    --text3:      #475569;
    --nav-h:      72px;
    --head:       'Syne', sans-serif;
    --body:       'Cabinet Grotesk', sans-serif;
    --r:          16px;
    --r-sm:       10px;
    --r-xs:       7px;
  }

  html, body, #root { height: 100%; }
  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--body);
    -webkit-font-smoothing: antialiased;
  }

  .app-shell {
    display: flex;
    flex-direction: column;
    height: 100vh;
    max-width: 430px;
    margin: 0 auto;
    position: relative;
    overflow: hidden;
    background: var(--bg);
  }

  /* ambient grid */
  .app-shell::before {
    content:'';position:absolute;inset:0;z-index:0;pointer-events:none;
    background-image:linear-gradient(rgba(56,189,248,0.025) 1px,transparent 1px),
      linear-gradient(90deg,rgba(56,189,248,0.025) 1px,transparent 1px);
    background-size:48px 48px;
  }

  /* ── Page container ── */
  .page { flex:1; overflow-y:auto; padding-bottom:calc(var(--nav-h) + 12px); position:relative; z-index:1; scrollbar-width:thin; scrollbar-color:var(--border) transparent; }
  .page::-webkit-scrollbar { width:3px; }
  .page::-webkit-scrollbar-thumb { background:var(--border); border-radius:4px; }

  /* ── Bottom nav ── */
  .bottom-nav {
    height: var(--nav-h);
    background: rgba(10,15,28,0.92);
    backdrop-filter: blur(20px);
    border-top: 1px solid var(--border);
    display: flex;
    align-items: stretch;
    position: relative; z-index: 100;
    flex-shrink: 0;
  }
  .nav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    cursor: pointer;
    transition: all 0.2s;
    border: none;
    background: transparent;
    color: var(--text3);
    font-family: var(--body);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.3px;
    padding-bottom: 4px;
    position: relative;
  }
  .nav-item.active { color: var(--accent); }
  .nav-item .nav-icon { font-size: 20px; transition: transform 0.2s; }
  .nav-item.active .nav-icon { transform: translateY(-2px); }
  .nav-item::after {
    content:''; position:absolute; bottom:0; left:50%; transform:translateX(-50%);
    width:0; height:2px; background:var(--accent); border-radius:1px;
    transition: width 0.25s;
  }
  .nav-item.active::after { width:24px; }

  /* ── AI FAB ── */
  .ai-fab {
    position: absolute;
    bottom: calc(var(--nav-h) + 18px);
    right: 18px;
    width: 52px; height: 52px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--accent), #0369a1);
    border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px;
    box-shadow: 0 0 28px rgba(56,189,248,0.45);
    z-index: 90;
    transition: all 0.25s;
    animation: fabPulse 3s ease-in-out infinite;
  }
  @keyframes fabPulse {
    0%,100%{box-shadow:0 0 28px rgba(56,189,248,0.45);}
    50%{box-shadow:0 0 44px rgba(56,189,248,0.7);}
  }
  .ai-fab:hover { transform: scale(1.1); }

  /* ── Shared Section header ── */
  .sec-hd { display:flex; align-items:center; justify-content:space-between; padding:0 18px 10px; }
  .sec-title { font-family:var(--head); font-size:17px; font-weight:700; letter-spacing:-0.2px; }
  .sec-link { font-size:12px; color:var(--accent); cursor:pointer; }

  /* ── Cards ── */
  .card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--r);
    overflow: hidden;
  }
  .card:hover { border-color: var(--border2); }

  /* ── Badges ── */
  .badge {
    font-size: 10px; font-weight: 600;
    padding: 3px 9px; border-radius: 99px;
    letter-spacing: 0.3px;
  }
  .badge-green { background:var(--green-dim); color:var(--green); }
  .badge-amber { background:var(--amber-dim); color:var(--amber); }
  .badge-accent { background:var(--accent-dim); color:var(--accent); }
  .badge-coral  { background:var(--coral-dim);  color:var(--coral); }
  .badge-purple { background:var(--purple-dim); color:var(--purple); }

  /* ── Chips row ── */
  .chips-row { display:flex; gap:8px; overflow-x:auto; padding:0 18px 2px; scrollbar-width:none; }
  .chips-row::-webkit-scrollbar { display:none; }
  .chip {
    flex-shrink:0; padding:7px 14px; border-radius:99px;
    border:1px solid var(--border); background:var(--card);
    color:var(--text); font-family:var(--body); font-size:12px;
    cursor:pointer; transition:all 0.2s; white-space:nowrap;
    display:flex; align-items:center; gap:5px;
  }
  .chip:hover,.chip.active { border-color:var(--accent); color:var(--accent); background:var(--accent-dim); }

  /* ── Pulse dot ── */
  .pulse-dot {
    width:7px;height:7px;border-radius:50%;background:var(--green);
    animation:pulseDot 2s infinite;
  }
  @keyframes pulseDot{0%,100%{opacity:1;transform:scale(1);}50%{opacity:.5;transform:scale(.85);}}

  /* ── Animations ── */
  @keyframes fadeUp{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
  @keyframes fadeIn{from{opacity:0;}to{opacity:1;}}
  @keyframes float{0%,100%{transform:translateY(0);}50%{transform:translateY(-7px);}}
  @keyframes shimmer{0%{background-position:-200% 0;}100%{background-position:200% 0;}}
  @keyframes spinIn{from{opacity:0;transform:rotate(-15deg) scale(.9);}to{opacity:1;transform:rotate(0) scale(1);}}

  .fade-up { animation: fadeUp 0.35s ease both; }

  /* ══════════ HOME PAGE ══════════ */
  .home-hero {
    padding: 24px 18px 18px;
    position: relative;
  }
  .home-greeting { font-size:13px; color:var(--text2); margin-bottom:2px; }
  .home-title { font-family:var(--head); font-size:24px; font-weight:800; letter-spacing:-0.5px; line-height:1.2; }
  .home-title span { color:var(--accent); }

  .weather-card {
    margin: 0 18px;
    background: linear-gradient(135deg, rgba(56,189,248,0.15) 0%, rgba(99,102,241,0.12) 100%);
    border: 1px solid rgba(56,189,248,0.25);
    border-radius: var(--r);
    padding: 16px 18px;
    display: flex; align-items: center; gap: 16px;
    cursor: pointer;
    transition: all 0.2s;
    animation: fadeUp 0.4s ease both;
  }
  .weather-card:hover { border-color: rgba(56,189,248,0.5); transform:translateY(-1px); }
  .weather-icon { font-size: 52px; animation: float 4s ease-in-out infinite; flex-shrink:0; }
  .weather-temp { font-family:var(--head); font-size:36px; font-weight:800; line-height:1; }
  .weather-meta { font-size:12px; color:var(--text2); margin-top:4px; }
  .weather-advice {
    margin-left:auto; font-size:11px; color:var(--text2);
    background:rgba(255,255,255,0.05); border-radius:var(--r-sm);
    padding:6px 10px; max-width:110px; text-align:center; line-height:1.4; flex-shrink:0;
  }

  .section-wrap { margin-top:22px; animation: fadeUp 0.4s ease both; }

  .quick-action-grid {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 8px; padding: 0 18px;
  }
  .quick-btn {
    background: var(--card); border:1px solid var(--border);
    border-radius:var(--r-sm); padding:12px 4px 10px;
    display:flex; flex-direction:column; align-items:center; gap:5px;
    cursor:pointer; transition:all 0.2s; text-align:center;
  }
  .quick-btn:hover { border-color:var(--accent); transform:translateY(-2px); }
  .quick-btn .qb-icon { font-size:22px; }
  .quick-btn .qb-label { font-size:10px; color:var(--text2); font-weight:500; letter-spacing:0.2px; }

  .place-scroll { display:flex; gap:12px; padding:0 18px; overflow-x:auto; scrollbar-width:none; }
  .place-scroll::-webkit-scrollbar { display:none; }
  .place-mini {
    flex-shrink:0; width:150px; background:var(--card); border:1px solid var(--border);
    border-radius:var(--r); overflow:hidden; cursor:pointer; transition:all 0.2s;
  }
  .place-mini:hover { border-color:var(--border2); transform:translateY(-2px); }
  .place-mini-img {
    height:90px; background:linear-gradient(135deg, rgba(56,189,248,0.15), rgba(167,139,250,0.15));
    display:flex; align-items:center; justify-content:center; font-size:36px;
  }
  .place-mini-body { padding:8px 10px; }
  .place-mini-name { font-size:13px; font-weight:600; }
  .place-mini-sub  { font-size:11px; color:var(--text2); margin-top:2px; }

  .restaurant-card-row { display:flex; gap:12px; padding:0 18px; overflow-x:auto; scrollbar-width:none; }
  .restaurant-card-row::-webkit-scrollbar { display:none; }
  .rest-card {
    flex-shrink:0; width:200px; background:var(--card); border:1px solid var(--border);
    border-radius:var(--r); overflow:hidden; cursor:pointer; transition:all 0.2s;
  }
  .rest-card:hover { border-color:var(--border2); transform:translateY(-2px); }
  .rest-img {
    height:110px;
    display:flex; align-items:center; justify-content:center; font-size:42px;
  }
  .rest-body { padding:10px 12px; }
  .rest-name { font-size:13px; font-weight:600; }
  .rest-meta { font-size:11px; color:var(--text2); margin-top:3px; display:flex; align-items:center; gap:6px; }

  /* ══════════ EXPLORE PAGE ══════════ */
  .explore-header { padding:24px 18px 14px; }
  .explore-search {
    display:flex; align-items:center; gap:8px;
    background:var(--card); border:1px solid var(--border);
    border-radius:99px; padding:11px 16px; margin:0 18px 14px;
    transition:border-color 0.2s;
  }
  .explore-search:focus-within { border-color:rgba(56,189,248,.5); }
  .explore-search input {
    flex:1; background:transparent; border:none; outline:none;
    color:var(--text); font-family:var(--body); font-size:14px;
  }
  .explore-search input::placeholder { color:var(--text3); }

  .filter-row { display:flex; gap:8px; padding:0 18px 4px; overflow-x:auto; scrollbar-width:none; }
  .filter-row::-webkit-scrollbar { display:none; }
  .filter-chip {
    flex-shrink:0; padding:6px 14px; border-radius:99px;
    border:1px solid var(--border); background:var(--card);
    color:var(--text2); font-size:12px; cursor:pointer; transition:all 0.2s; white-space:nowrap;
  }
  .filter-chip.active, .filter-chip:hover { background:var(--accent); color:#000; border-color:var(--accent); }

  .explore-grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; padding:14px 18px; }
  .ex-card {
    background:var(--card); border:1px solid var(--border); border-radius:var(--r);
    overflow:hidden; cursor:pointer; transition:all 0.2s;
  }
  .ex-card:hover { border-color:var(--border2); transform:translateY(-2px); }
  .ex-card-img {
    height:100px;
    display:flex; align-items:center; justify-content:center; font-size:38px;
    background:linear-gradient(135deg, var(--card), var(--card2));
  }
  .ex-card-body { padding:10px; }
  .ex-card-name { font-size:13px; font-weight:600; }
  .ex-card-meta { font-size:11px; color:var(--text2); margin-top:3px; }
  .ex-card-footer { display:flex; align-items:center; justify-content:space-between; margin-top:7px; }

  /* ══════════ MAP PAGE ══════════ */
  .map-container { position:relative; height:100%; display:flex; flex-direction:column; }
  .map-view {
    flex:1; background:var(--card);
    position:relative; overflow:hidden; min-height:300px;
  }
  .map-grid {
    position:absolute; inset:0;
    background-image:
      linear-gradient(rgba(56,189,248,0.05) 1px,transparent 1px),
      linear-gradient(90deg,rgba(56,189,248,0.05) 1px,transparent 1px);
    background-size:32px 32px;
  }
  .map-roads {
    position:absolute; inset:0; opacity:0.35;
  }
  .map-pin {
    position:absolute; transform:translate(-50%,-50%);
    display:flex; flex-direction:column; align-items:center;
    cursor:pointer; transition:transform 0.2s;
  }
  .map-pin:hover { transform:translate(-50%,-50%) scale(1.15); }
  .pin-dot {
    width:36px; height:36px; border-radius:50%;
    display:flex; align-items:center; justify-content:center;
    font-size:18px; border:2px solid rgba(255,255,255,0.2);
    box-shadow:0 4px 16px rgba(0,0,0,0.4);
  }
  .pin-label {
    margin-top:4px; font-size:10px; font-weight:600;
    background:var(--surface); border:1px solid var(--border);
    border-radius:var(--r-xs); padding:2px 7px;
    white-space:nowrap;
  }
  .user-pin {
    position:absolute; transform:translate(-50%,-50%);
    width:16px; height:16px; border-radius:50%;
    background:var(--accent);
    box-shadow:0 0 0 4px rgba(56,189,248,.25), 0 0 0 8px rgba(56,189,248,.1);
    animation:userPing 2s ease-in-out infinite;
  }
  @keyframes userPing{0%,100%{box-shadow:0 0 0 4px rgba(56,189,248,.25),0 0 0 8px rgba(56,189,248,.1);}50%{box-shadow:0 0 0 6px rgba(56,189,248,.35),0 0 0 12px rgba(56,189,248,.08);}}

  .map-search-bar {
    position:absolute; top:14px; left:14px; right:14px; z-index:10;
    background:rgba(15,25,35,0.9); backdrop-filter:blur(12px);
    border:1px solid var(--border2); border-radius:var(--r-sm);
    display:flex; align-items:center; gap:8px; padding:10px 14px;
  }
  .map-search-bar input {
    flex:1; background:transparent; border:none; outline:none;
    color:var(--text); font-family:var(--body); font-size:13px;
  }
  .map-search-bar input::placeholder { color:var(--text3); }

  .route-panel {
    background:var(--surface); border-top:1px solid var(--border);
    padding:14px 18px; flex-shrink:0;
  }
  .route-title { font-family:var(--head); font-size:14px; font-weight:700; margin-bottom:10px; }
  .route-options { display:flex; gap:8px; overflow-x:auto; scrollbar-width:none; margin-bottom:12px; }
  .route-options::-webkit-scrollbar { display:none; }
  .route-opt {
    flex-shrink:0; padding:8px 12px; border-radius:var(--r-sm);
    border:1px solid var(--border); background:var(--card);
    cursor:pointer; transition:all 0.2s; text-align:center; min-width:90px;
  }
  .route-opt.selected { border-color:var(--accent); background:var(--accent-dim); }
  .route-opt .r-icon { font-size:18px; margin-bottom:3px; }
  .route-opt .r-label { font-size:11px; font-weight:600; color:var(--text); }
  .route-opt .r-sub   { font-size:10px; color:var(--text2); margin-top:1px; }

  .route-info {
    background:var(--card); border:1px solid var(--border); border-radius:var(--r-sm);
    padding:10px 14px; display:flex; align-items:center; gap:14px;
  }
  .route-stat { text-align:center; flex:1; }
  .route-stat .val { font-family:var(--head); font-size:18px; font-weight:700; color:var(--accent); }
  .route-stat .lbl { font-size:10px; color:var(--text2); margin-top:1px; }
  .route-divider { width:1px; height:30px; background:var(--border); }

  /* ══════════ CHATBOT PAGE ══════════ */
  .chat-page { display:flex; flex-direction:column; height:100%; overflow:hidden; }
  .chat-header {
    padding:20px 18px 14px; border-bottom:1px solid var(--border);
    display:flex; align-items:center; gap:12px; flex-shrink:0;
    background:linear-gradient(180deg,var(--bg) 80%,transparent);
  }
  .chat-logo {
    width:40px;height:40px; border-radius:12px;
    background:linear-gradient(135deg,var(--accent),#0369a1);
    display:flex;align-items:center;justify-content:center;font-size:18px;
    box-shadow:0 0 20px rgba(56,189,248,.3);flex-shrink:0;
  }
  .chat-title { font-family:var(--head); font-size:18px; font-weight:700; }
  .chat-sub   { font-size:11px; color:var(--text2); margin-top:1px; }
  .chat-status { margin-left:auto; display:flex; align-items:center; gap:5px; font-size:11px; color:var(--green); }

  .chat-chips { display:flex; gap:8px; padding:10px 16px 2px; overflow-x:auto; scrollbar-width:none; flex-shrink:0; }
  .chat-chips::-webkit-scrollbar { display:none; }

  .chat-messages {
    flex:1; overflow-y:auto; padding:10px 14px 6px;
    display:flex; flex-direction:column; gap:10px;
    scrollbar-width:thin; scrollbar-color:var(--border) transparent;
  }
  .chat-messages::-webkit-scrollbar { width:3px; }
  .chat-messages::-webkit-scrollbar-thumb { background:var(--border); border-radius:3px; }

  .msg { display:flex; gap:8px; align-items:flex-end; animation:fadeUp 0.3s ease; }
  .msg.user { flex-direction:row-reverse; }
  .msg-avatar {
    width:28px;height:28px;border-radius:50%;display:flex;align-items:center;
    justify-content:center;font-size:13px;flex-shrink:0;
    background:linear-gradient(135deg,var(--accent),#0369a1);
    box-shadow:0 0 10px rgba(56,189,248,.2);
  }
  .msg.user .msg-avatar { background:linear-gradient(135deg,var(--amber),#d97706); box-shadow:0 0 10px rgba(251,191,36,.2); }
  .msg-bubble {
    max-width:82%; padding:10px 14px; border-radius:var(--r);
    font-size:13.5px; line-height:1.6;
  }
  .msg.ai .msg-bubble { background:var(--card); border:1px solid var(--border); border-bottom-left-radius:4px; }
  .msg.user .msg-bubble { background:#1e3a5f; border:1px solid rgba(56,189,248,.2); border-bottom-right-radius:4px; }
  .msg-time { font-size:10px; color:var(--text3); margin-top:3px; }
  .msg.ai .msg-time { text-align:left; }
  .msg.user .msg-time { text-align:right; }

  .typing { display:flex; gap:5px; padding:3px 2px; align-items:center; }
  .typing span {
    width:6px;height:6px;border-radius:50%;background:var(--accent);opacity:.5;
    animation:bounce 1.2s infinite;
  }
  .typing span:nth-child(2){animation-delay:.2s;}
  .typing span:nth-child(3){animation-delay:.4s;}
  @keyframes bounce{0%,80%,100%{transform:translateY(0);opacity:.5;}40%{transform:translateY(-5px);opacity:1;}}

  .place-cards { display:flex; flex-direction:column; gap:7px; margin-top:8px; }
  .p-card {
    background:rgba(255,255,255,.04);border:1px solid var(--border);
    border-radius:var(--r-sm);padding:9px 11px;
    display:flex;gap:9px;align-items:center;cursor:pointer;transition:border-color .2s;
  }
  .p-card:hover { border-color:rgba(56,189,248,.4); }
  .p-icon { width:34px;height:34px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0;background:var(--accent-dim); }
  .p-name { font-size:12.5px;font-weight:600; }
  .p-meta { font-size:11px;color:var(--text2);margin-top:1px; }

  .weather-inline {
    background:linear-gradient(135deg,rgba(56,189,248,.1),rgba(99,102,241,.1));
    border:1px solid rgba(56,189,248,.2); border-radius:var(--r-sm);
    padding:10px 12px; margin-top:8px;
    display:flex;align-items:center;gap:12px;
  }
  .wi-icon { font-size:32px; }
  .wi-temp { font-family:var(--head);font-size:24px;font-weight:700; }
  .wi-desc { font-size:11px;color:var(--text2); }

  .chat-input-area {
    padding:10px 14px 18px; flex-shrink:0;
    background:linear-gradient(0deg,var(--bg) 80%,transparent);
    display:flex;gap:8px;align-items:flex-end;
  }
  .chat-input-wrap {
    flex:1;background:var(--card);border:1px solid var(--border);
    border-radius:99px;display:flex;align-items:center;padding:9px 14px;gap:7px;
    transition:border-color .2s;
  }
  .chat-input-wrap:focus-within { border-color:rgba(56,189,248,.5); }
  .chat-input {
    flex:1;background:transparent;border:none;outline:none;
    color:var(--text);font-family:var(--body);font-size:13.5px;
    resize:none;max-height:90px;line-height:1.5;
  }
  .chat-input::placeholder { color:var(--text3); }
  .send-btn {
    width:40px;height:40px;border-radius:50%;flex-shrink:0;
    background:linear-gradient(135deg,var(--accent),#0369a1);
    border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;
    font-size:15px;transition:all .2s;
    box-shadow:0 0 14px rgba(56,189,248,.3);
  }
  .send-btn:hover:not(:disabled){transform:scale(1.08);box-shadow:0 0 22px rgba(56,189,248,.5);}
  .send-btn:disabled{opacity:.4;cursor:not-allowed;}

  .chat-welcome {
    flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;
    padding:32px 24px;text-align:center;gap:8px;
  }
  .cw-icon { font-size:48px;margin-bottom:6px;animation:float 3s ease-in-out infinite; }
  .cw-title { font-family:var(--head);font-size:21px;font-weight:700; }
  .cw-sub { color:var(--text2);font-size:13px;line-height:1.6;max-width:260px; }

  .bubble-bold { color:var(--accent);font-weight:600; }
  .bubble-em   { color:var(--amber); }
  .bubble-tip  {
    margin-top:7px;padding:7px 9px;
    background:rgba(52,211,153,.08);border-left:3px solid var(--green);
    border-radius:0 6px 6px 0;font-size:12px;color:var(--green);
  }

  /* ══════════ PROFILE / PREFERENCES ══════════ */
  .profile-header { padding:28px 18px 18px; display:flex;flex-direction:column;align-items:center;gap:10px; }
  .avatar-circle {
    width:72px;height:72px;border-radius:50%;
    background:linear-gradient(135deg,var(--accent),#0369a1);
    display:flex;align-items:center;justify-content:center;
    font-size:28px;box-shadow:0 0 24px rgba(56,189,248,.35);
  }
  .profile-name { font-family:var(--head);font-size:20px;font-weight:700; }
  .profile-email { font-size:12px;color:var(--text2); }

  .pref-section { padding:0 18px;margin-bottom:20px; }
  .pref-label { font-family:var(--head);font-size:14px;font-weight:700;margin-bottom:10px; }
  .pref-grid { display:grid;grid-template-columns:1fr 1fr;gap:8px; }
  .pref-item {
    background:var(--card);border:1px solid var(--border);border-radius:var(--r-sm);
    padding:12px 14px;cursor:pointer;transition:all .2s;display:flex;align-items:center;gap:10px;
  }
  .pref-item.selected { border-color:var(--accent);background:var(--accent-dim); }
  .pref-item:hover { border-color:var(--border2); }
  .pref-icon { font-size:20px; }
  .pref-name { font-size:12px;font-weight:600; }
  .pref-desc { font-size:10px;color:var(--text2);margin-top:1px; }

  .setting-row {
    display:flex;align-items:center;justify-content:space-between;
    padding:13px 18px;border-bottom:1px solid var(--border);cursor:pointer;
    transition:background .2s;
  }
  .setting-row:hover { background:rgba(255,255,255,.02); }
  .setting-label { font-size:14px;font-weight:500; }
  .setting-sub   { font-size:11px;color:var(--text2);margin-top:1px; }
  .toggle {
    width:42px;height:24px;border-radius:99px;
    background:var(--text3);position:relative;transition:background .2s;cursor:pointer;
  }
  .toggle.on { background:var(--accent); }
  .toggle::after {
    content:'';position:absolute;width:18px;height:18px;border-radius:50%;
    background:#fff;top:3px;left:3px;transition:transform .2s;
  }
  .toggle.on::after { transform:translateX(18px); }
`;

// ─── AI System Prompt ────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are TravelBot, the AI brain of "Travel Smart" — a sustainable travel app.
Help users explore places, plan routes, find food, get weather advice, and travel sustainably.

PERSONALITY: Friendly local guide. Concise. Action-oriented. Use emojis naturally.

RESPONSE FORMAT:
1. Keep text to 2-5 sentences.
2. For places, append at response end:
[PLACES_JSON][{"name":"...", "type":"...", "emoji":"...", "rating":"4.2★", "status":"Open", "desc":"...", "distance":"1.2 km"}][/PLACES_JSON]
Include 2-4 places when relevant.

3. For weather, append:
[WEATHER_JSON]{"temp":"31°C", "condition":"Partly Cloudy", "emoji":"⛅", "advice":"Great for outdoor dining"}[/WEATHER_JSON]

4. Route suggestions should emphasize: Less crowded roads · Eco-friendly options · Well-developed roads · User preference routes. NEVER suggest "safety routes" as a category.

5. Rain → indoor (cafés, museums, malls). Heat → shaded/AC places. Nice weather → outdoor places.
6. End with a quick tip or follow-up question.

SUSTAINABLE TRAVEL TIPS: Suggest walking/cycling when < 2km, public transit, eco-certified hotels, plant-based food options. 

Do NOT say you lack real-time data. Give confident local-knowledge recommendations.`;

// ─── Static Data ─────────────────────────────────────────────────────────────
const NEARBY_PLACES = [
  { name: "Raj Mahal Palace", emoji: "🏰", type: "Heritage", rating: "4.7★", desc: "1.2 km", color: "var(--purple-dim)" },
  { name: "Spice Garden", emoji: "🌿", type: "Park", rating: "4.5★", desc: "0.8 km", color: "var(--green-dim)" },
  { name: "Old Market Lane", emoji: "🛒", type: "Market", rating: "4.3★", desc: "2.1 km", color: "var(--amber-dim)" },
  { name: "Sunrise Viewpoint", emoji: "🌅", type: "Viewpoint", rating: "4.9★", desc: "3.4 km", color: "var(--coral-dim)" },
  { name: "Lotus Lake Park", emoji: "🌸", type: "Nature", rating: "4.6★", desc: "1.8 km", color: "var(--green-dim)" },
];

const RESTAURANTS = [
  { name: "Dhaba House", emoji: "🍛", cuisine: "North Indian", rating: "4.6★", dist: "0.5 km", price: "₹₹", bg: "linear-gradient(135deg,rgba(251,191,36,.15),rgba(251,113,133,.1))" },
  { name: "Green Leaf Café", emoji: "🥗", cuisine: "Vegan · Eco", rating: "4.8★", dist: "1.1 km", price: "₹₹₹", bg: "linear-gradient(135deg,rgba(52,211,153,.15),rgba(56,189,248,.1))" },
  { name: "Street Bites", emoji: "🌮", cuisine: "Street Food", rating: "4.4★", dist: "0.3 km", price: "₹", bg: "linear-gradient(135deg,rgba(167,139,250,.15),rgba(251,191,36,.1))" },
  { name: "The Rooftop", emoji: "🌃", cuisine: "Pan-Asian", rating: "4.5★", dist: "2.0 km", price: "₹₹₹₹", bg: "linear-gradient(135deg,rgba(56,189,248,.15),rgba(167,139,250,.1))" },
];

const EXPLORE_DATA = [
  { name: "Taj Mahal", emoji: "🕌", cat: "Heritage", rating: "5.0★", dist: "4 km", badge: "Iconic", badgeCls: "badge-accent", budget: "₹₹" },
  { name: "Amber Fort", emoji: "🏯", cat: "Heritage", rating: "4.8★", dist: "8 km", badge: "Popular", badgeCls: "badge-purple", budget: "₹₹" },
  { name: "Local Biryani", emoji: "🍚", cat: "Food", rating: "4.7★", dist: "1 km", badge: "Open", badgeCls: "badge-green", budget: "₹" },
  { name: "Rooftop Café", emoji: "☕", cat: "Café", rating: "4.6★", dist: "0.8 km", badge: "Trending", badgeCls: "badge-amber", budget: "₹₹" },
  { name: "Lotus Temple", emoji: "🌸", cat: "Temple", rating: "4.9★", dist: "3 km", badge: "Sacred", badgeCls: "badge-coral", budget: "Free" },
  { name: "Night Market", emoji: "🌙", cat: "Market", rating: "4.5★", dist: "2 km", badge: "Hidden Gem", badgeCls: "badge-purple", budget: "₹" },
  { name: "Eco Trail", emoji: "🌿", cat: "Nature", rating: "4.4★", dist: "5 km", badge: "Eco", badgeCls: "badge-green", budget: "Free" },
  { name: "Old Bazaar", emoji: "🛍️", cat: "Market", rating: "4.3★", dist: "1.5 km", badge: "Local Fav", badgeCls: "badge-amber", budget: "₹" },
];

const ROUTE_OPTIONS = [
  { id: "fastest",   icon: "⚡", label: "Fastest", sub: "12 min", km: "3.2 km", desc: "Via main road" },
  { id: "uncrowded", icon: "🌿", label: "Less Crowded", sub: "18 min", km: "4.1 km", desc: "Quiet streets" },
  { id: "eco",       icon: "♻️", label: "Eco-Friendly", sub: "22 min", km: "3.8 km", desc: "Cycle/walk path" },
  { id: "developed", icon: "🛣️", label: "Best Roads", sub: "15 min", km: "3.5 km", desc: "Highway route" },
];

const MAP_PINS = [
  { id: 1, x: "28%", y: "32%", emoji: "🏰", label: "Palace", bg: "var(--purple-dim)" },
  { id: 2, x: "65%", y: "45%", emoji: "🍛", label: "Dhaba House", bg: "var(--amber-dim)" },
  { id: 3, x: "45%", y: "68%", emoji: "☕", label: "Green Café", bg: "var(--green-dim)" },
  { id: 4, x: "72%", y: "25%", emoji: "🌅", label: "Viewpoint", bg: "var(--coral-dim)" },
];

const QUICK_CHIPS = [
  { label: "Things to do today", icon: "🗺️" },
  { label: "Best food nearby",   icon: "🍜" },
  { label: "Rainy day plans",    icon: "🌧️" },
  { label: "Plan 3-hour trip",   icon: "⏱️" },
  { label: "Eco-friendly spots", icon: "🌿" },
  { label: "Local hidden gems",  icon: "💎" },
];

const TRAVELER_PREFS = [
  { id: "budget",    icon: "💰", name: "Budget Traveler",  desc: "Best value picks" },
  { id: "foodie",    icon: "🍽️", name: "Food Lover",       desc: "Top local bites" },
  { id: "nature",    icon: "🌿", name: "Nature Lover",     desc: "Trails & outdoors" },
  { id: "culture",   icon: "🏛️", name: "Cultural Explorer",desc: "Heritage & art" },
  { id: "eco",       icon: "♻️", name: "Eco Traveler",     desc: "Sustainable routes" },
  { id: "adventure", icon: "🎒", name: "Adventurer",       desc: "Off the beaten path" },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function now() { return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }); }

function parseAI(raw) {
  let text = raw, places = [], weather = null;
  const pm = raw.match(/\[PLACES_JSON\]([\s\S]*?)\[\/PLACES_JSON\]/);
  if (pm) { try { places = JSON.parse(pm[1].trim()); } catch {} text = text.replace(/\[PLACES_JSON\][\s\S]*?\[\/PLACES_JSON\]/, "").trim(); }
  const wm = raw.match(/\[WEATHER_JSON\]([\s\S]*?)\[\/WEATHER_JSON\]/);
  if (wm) { try { weather = JSON.parse(wm[1].trim()); } catch {} text = text.replace(/\[WEATHER_JSON\][\s\S]*?\[\/WEATHER_JSON\]/, "").trim(); }
  return { text, places, weather };
}

function renderBubble(text) {
  return text.split("\n").map((line, i) => {
    const isTip = line.startsWith("💡") || line.toLowerCase().startsWith("tip:");
    const html = line
      .replace(/\*\*(.+?)\*\*/g, '<span class="bubble-bold">$1</span>')
      .replace(/\*(.+?)\*/g, '<span class="bubble-em">$1</span>');
    if (isTip) return `<div class="bubble-tip">${html}</div>`;
    return `<span>${html}</span>`;
  }).join("<br/>");
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function WeatherCard({ onChat }) {
  const weathers = [
    { emoji: "☀️", temp: "34°C", cond: "Sunny & Clear", advice: "Great for outdoor exploration!" },
    { emoji: "⛅", temp: "28°C", cond: "Partly Cloudy", advice: "Perfect for sightseeing" },
    { emoji: "🌧️", temp: "22°C", cond: "Light Rain",    advice: "Try indoor cafés & museums" },
  ];
  const [wi] = useState(() => weathers[Math.floor(Math.random() * weathers.length)]);
  return (
    <div className="weather-card" onClick={() => onChat("What should I do in this weather?")}>
      <div className="weather-icon">{wi.emoji}</div>
      <div>
        <div className="weather-temp">{wi.temp}</div>
        <div className="weather-meta">{wi.cond} · Ghaziabad</div>
      </div>
      <div className="weather-advice">{wi.advice}</div>
    </div>
  );
}

// ─── Pages ────────────────────────────────────────────────────────────────────
function HomePage({ onChat, onNavigate }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="page">
      <div className="home-hero fade-up">
        <div className="home-greeting">{greeting} 👋</div>
        <div className="home-title">Where to<br/><span>today?</span></div>
      </div>

      <WeatherCard onChat={onChat} />

      <div className="section-wrap" style={{ animationDelay: "0.05s" }}>
        <div className="sec-hd">
          <div className="sec-title">Quick Actions</div>
        </div>
        <div className="quick-action-grid">
          {[
            { icon: "🗺️", label: "Explore", action: () => onNavigate("explore") },
            { icon: "🧭", label: "Navigate", action: () => onNavigate("map") },
            { icon: "🤖", label: "Ask AI", action: () => onNavigate("chat") },
            { icon: "♻️", label: "Eco Routes", action: () => onNavigate("map") },
          ].map(b => (
            <button key={b.label} className="quick-btn" onClick={b.action}>
              <span className="qb-icon">{b.icon}</span>
              <span className="qb-label">{b.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="section-wrap" style={{ animationDelay: "0.1s" }}>
        <div className="sec-hd">
          <div className="sec-title">Nearby Places</div>
          <div className="sec-link" onClick={() => onNavigate("explore")}>See all</div>
        </div>
        <div className="place-scroll">
          {NEARBY_PLACES.map(p => (
            <div key={p.name} className="place-mini" onClick={() => onChat(`Tell me about ${p.name}`)}>
              <div className="place-mini-img" style={{ background: p.color }}>{p.emoji}</div>
              <div className="place-mini-body">
                <div className="place-mini-name">{p.name}</div>
                <div className="place-mini-sub">{p.rating} · {p.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="section-wrap" style={{ animationDelay: "0.15s" }}>
        <div className="sec-hd">
          <div className="sec-title">🍽️ Food Highlights</div>
          <div className="sec-link" onClick={() => onNavigate("explore")}>See all</div>
        </div>
        <div className="restaurant-card-row">
          {RESTAURANTS.map(r => (
            <div key={r.name} className="rest-card" onClick={() => onChat(`Tell me about ${r.name}`)}>
              <div className="rest-img" style={{ background: r.bg }}>{r.emoji}</div>
              <div className="rest-body">
                <div className="rest-name">{r.name}</div>
                <div className="rest-meta">
                  <span>{r.rating}</span>
                  <span>·</span>
                  <span>{r.dist}</span>
                  <span>·</span>
                  <span className="badge badge-amber">{r.price}</span>
                </div>
                <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 4 }}>{r.cuisine}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding: "22px 18px 4px" }} className="fade-up">
        <div style={{
          background: "linear-gradient(135deg, rgba(56,189,248,.12), rgba(167,139,250,.1))",
          border: "1px solid rgba(56,189,248,.25)", borderRadius: "var(--r)",
          padding: "16px", display: "flex", alignItems: "center", gap: "14px",
          cursor: "pointer"
        }} onClick={() => onNavigate("chat")}>
          <div style={{ fontSize: 36 }}>🤖</div>
          <div>
            <div style={{ fontFamily: "var(--head)", fontSize: 15, fontWeight: 700 }}>Ask Your AI Guide</div>
            <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 2 }}>Get personalised suggestions, route tips & more</div>
          </div>
          <div style={{ marginLeft: "auto", fontSize: 20, color: "var(--accent)" }}>›</div>
        </div>
      </div>
    </div>
  );
}

function ExplorePage({ onChat, onNavigate }) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const filters = ["All", "Food", "Heritage", "Café", "Nature", "Market", "Temple"];

  const filtered = EXPLORE_DATA.filter(item => {
    const matchFilter = activeFilter === "All" || item.cat === activeFilter;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="page">
      <div className="explore-header">
        <div className="sec-title" style={{ fontSize: 22, fontFamily: "var(--head)", fontWeight: 800, marginBottom: 4 }}>Explore</div>
        <div style={{ fontSize: 13, color: "var(--text2)" }}>Discover places around you</div>
      </div>
      <div className="explore-search">
        <span style={{ fontSize: 15, color: "var(--text3)" }}>🔍</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search places, food, activities..."
        />
        {search && <span style={{ cursor: "pointer", color: "var(--text2)" }} onClick={() => setSearch("")}>✕</span>}
      </div>
      <div className="filter-row">
        {filters.map(f => (
          <button key={f} className={`filter-chip ${activeFilter === f ? "active" : ""}`}
            onClick={() => setActiveFilter(f)}>{f}</button>
        ))}
      </div>
      <div className="explore-grid">
        {filtered.map((item, i) => (
          <div key={item.name} className="ex-card fade-up" style={{ animationDelay: `${i * 0.04}s` }}
            onClick={() => onChat(`Tell me more about ${item.name} and how to get there`)}>
            <div className="ex-card-img" style={{ fontSize: 42 }}>{item.emoji}</div>
            <div className="ex-card-body">
              <div className="ex-card-name">{item.name}</div>
              <div className="ex-card-meta">{item.cat} · {item.dist}</div>
              <div className="ex-card-footer">
                <span className={`badge ${item.badgeCls}`}>{item.badge}</span>
                <span style={{ fontSize: 11, color: "var(--text2)" }}>{item.rating}</span>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "32px", color: "var(--text2)" }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🔍</div>
            <div>No results for "{search}"</div>
          </div>
        )}
      </div>
    </div>
  );
}

function MapPage({ onChat, destination }) {
  const [selectedRoute, setSelectedRoute] = useState("uncrowded");
  const [dest, setDest] = useState(destination || "");
  const [activePin, setActivePin] = useState(null);
  const route = ROUTE_OPTIONS.find(r => r.id === selectedRoute);

  return (
    <div className="page" style={{ paddingBottom: 0 }}>
      <div className="map-container" style={{ height: "calc(100vh - 72px)" }}>
        {/* Map View */}
        <div className="map-view">
          <div className="map-grid" />
          {/* Stylised road lines */}
          <svg className="map-roads" viewBox="0 0 430 360" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
            <line x1="0" y1="180" x2="430" y2="180" stroke="rgba(56,189,248,0.15)" strokeWidth="6"/>
            <line x1="215" y1="0" x2="215" y2="360" stroke="rgba(56,189,248,0.15)" strokeWidth="6"/>
            <line x1="0" y1="90" x2="430" y2="270" stroke="rgba(56,189,248,0.08)" strokeWidth="3"/>
            <line x1="0" y1="50" x2="430" y2="50" stroke="rgba(255,255,255,0.04)" strokeWidth="2"/>
            <line x1="0" y1="300" x2="430" y2="300" stroke="rgba(255,255,255,0.04)" strokeWidth="2"/>
            {/* Route highlight */}
            {selectedRoute === "eco" && <path d="M215 360 Q 150 280 120 200 Q 90 120 145 80" stroke="var(--green)" strokeWidth="3" fill="none" strokeDasharray="8,4" opacity="0.7"/>}
            {selectedRoute === "fastest" && <path d="M215 360 L 215 180 L 280 90" stroke="var(--accent)" strokeWidth="3" fill="none" opacity="0.7"/>}
            {selectedRoute === "uncrowded" && <path d="M215 360 Q 180 300 160 230 Q 130 150 200 80" stroke="var(--green)" strokeWidth="3" fill="none" strokeDasharray="5,3" opacity="0.7"/>}
            {selectedRoute === "developed" && <path d="M215 360 L 215 180 Q 220 130 285 90" stroke="var(--amber)" strokeWidth="3" fill="none" opacity="0.7"/>}
          </svg>
          {/* User location */}
          <div className="user-pin" style={{ left: "50%", top: "70%" }} />
          {/* Place pins */}
          {MAP_PINS.map(pin => (
            <div key={pin.id} className="map-pin" style={{ left: pin.x, top: pin.y }}
              onClick={() => { setActivePin(pin); onChat(`Tell me about ${pin.label} and how to get there from my location`); }}>
              <div className="pin-dot" style={{ background: pin.bg }}>{pin.emoji}</div>
              {activePin?.id === pin.id && <div className="pin-label">{pin.label}</div>}
            </div>
          ))}
          {/* Search bar */}
          <div className="map-search-bar">
            <span style={{ fontSize: 14, color: "var(--text2)" }}>📍</span>
            <input
              value={dest}
              onChange={e => setDest(e.target.value)}
              placeholder="Search destination..."
              onKeyDown={e => e.key === "Enter" && onChat(`Navigate to ${dest} - suggest best route`)}
            />
            {dest && (
              <button style={{ background: "var(--accent)", border: "none", borderRadius: "var(--r-xs)", color: "#000", padding: "4px 10px", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "var(--body)" }}
                onClick={() => onChat(`Navigate to ${dest} - suggest best route`)}>
                GO
              </button>
            )}
          </div>
        </div>

        {/* Route Panel */}
        <div className="route-panel">
          <div className="route-title">Choose Your Route</div>
          <div className="route-options">
            {ROUTE_OPTIONS.map(r => (
              <div key={r.id} className={`route-opt ${selectedRoute === r.id ? "selected" : ""}`}
                onClick={() => setSelectedRoute(r.id)}>
                <div className="r-icon">{r.icon}</div>
                <div className="r-label">{r.label}</div>
                <div className="r-sub">{r.sub}</div>
              </div>
            ))}
          </div>
          <div className="route-info">
            <div className="route-stat"><div className="val">{route.sub}</div><div className="lbl">Duration</div></div>
            <div className="route-divider" />
            <div className="route-stat"><div className="val">{route.km}</div><div className="lbl">Distance</div></div>
            <div className="route-divider" />
            <div className="route-stat">
              <div className="val" style={{ fontSize: 13, color: route.id === "eco" ? "var(--green)" : "var(--accent)" }}>
                {route.id === "eco" ? "🌿 Eco" : route.id === "uncrowded" ? "😌 Calm" : route.id === "developed" ? "🛣️ Smooth" : "⚡ Fast"}
              </div>
              <div className="lbl">{route.desc}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ChatPage({ prefs, initialMessage }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState(initialMessage || "");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  const taRef  = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 90) + "px";
  }, [input]);

  useEffect(() => {
    if (initialMessage) {
      sendMessage(initialMessage);
      // clear it so re-navigating doesn't re-send
    }
  }, []); // eslint-disable-line

  const buildSystemPrompt = () => {
    let base = SYSTEM_PROMPT;
    if (prefs.length > 0) {
      base += `\n\nUSER PREFERENCES: ${prefs.join(", ")}. Tailor suggestions accordingly.`;
    }
    return base;
  };

  async function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed || loading) return;
    const userMsg = { role: "user", content: trimmed, time: now() };
    const history = [...messages, userMsg];
    setMessages(history);
    setInput("");
    setLoading(true);
    try {
      const apiMsgs = history.map(m => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.rawContent || m.content,
      }));
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: buildSystemPrompt(),
          messages: apiMsgs,
        }),
      });
      const data = await res.json();
      const raw = data.content?.find(b => b.type === "text")?.text || "Sorry, couldn't process that.";
      const { text: parsed, places, weather } = parseAI(raw);
      setMessages(prev => [...prev, { role: "assistant", content: parsed, rawContent: raw, places, weather, time: now() }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Connection issue — please try again! 🔄", places: [], weather: null, time: now() }]);
    } finally { setLoading(false); }
  }

  return (
    <div className="chat-page">
      <div className="chat-header">
        <div className="chat-logo">✈️</div>
        <div>
          <div className="chat-title">Travel Smart AI</div>
          <div className="chat-sub">Your intelligent travel companion</div>
        </div>
        <div className="chat-status"><div className="pulse-dot" /> Online</div>
      </div>

      <div className="chat-chips">
        {QUICK_CHIPS.map(c => (
          <button key={c.label} className="chip" onClick={() => sendMessage(c.label)}>
            {c.icon} {c.label}
          </button>
        ))}
      </div>

      <div className="chat-messages">
        {messages.length === 0 && (
          <div className="chat-welcome">
            <div className="cw-icon">🌍</div>
            <div className="cw-title">Where to today?</div>
            <div className="cw-sub">Ask me anything — food spots, eco routes, hidden gems, weather advice or a full trip plan.</div>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`msg ${msg.role === "user" ? "user" : "ai"}`}>
            <div className="msg-avatar">{msg.role === "user" ? "👤" : "✈️"}</div>
            <div>
              <div className="msg-bubble">
                <span dangerouslySetInnerHTML={{ __html: renderBubble(msg.content) }} />
                {msg.weather && (
                  <div className="weather-inline">
                    <div className="wi-icon">{msg.weather.emoji}</div>
                    <div>
                      <div className="wi-temp">{msg.weather.temp}</div>
                      <div className="wi-desc">{msg.weather.condition} · {msg.weather.advice}</div>
                    </div>
                  </div>
                )}
                {msg.places?.length > 0 && (
                  <div className="place-cards">
                    {msg.places.map((p, j) => (
                      <div key={j} className="p-card">
                        <div className="p-icon">{p.emoji}</div>
                        <div>
                          <div className="p-name">{p.name}</div>
                          <div className="p-meta">{p.rating} · {p.desc}{p.distance ? ` · ${p.distance}` : ""}</div>
                        </div>
                        <span className={`badge ${p.status === "Open" ? "badge-green" : "badge-amber"}`} style={{ marginLeft: "auto" }}>{p.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="msg-time">{msg.time}</div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="msg ai">
            <div className="msg-avatar">✈️</div>
            <div className="msg-bubble"><div className="typing"><span /><span /><span /></div></div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="chat-input-area">
        <div className="chat-input-wrap">
          <span style={{ fontSize: 14, color: "var(--text3)" }}>🔍</span>
          <textarea
            ref={taRef}
            className="chat-input"
            rows={1}
            placeholder="Ask anything about your trip..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
          />
        </div>
        <button className="send-btn" onClick={() => sendMessage(input)} disabled={!input.trim() || loading}>➤</button>
      </div>
    </div>
  );
}

function ProfilePage({ prefs, setPrefs }) {
  const [toggles, setToggles] = useState({ eco: true, notifications: false, smart: true });

  const togglePref = (id) => {
    setPrefs(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  return (
    <div className="page">
      <div className="profile-header">
        <div className="avatar-circle">🧭</div>
        <div className="profile-name">Travel Explorer</div>
        <div className="profile-email">Ghaziabad, UP · India</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginTop: 4 }}>
          {prefs.map(p => {
            const found = TRAVELER_PREFS.find(tp => tp.id === p);
            return found ? <span key={p} className="badge badge-accent">{found.icon} {found.name}</span> : null;
          })}
        </div>
      </div>

      <div className="pref-section">
        <div className="pref-label">✨ Your Travel Style</div>
        <div className="pref-grid">
          {TRAVELER_PREFS.map(tp => (
            <div key={tp.id} className={`pref-item ${prefs.includes(tp.id) ? "selected" : ""}`}
              onClick={() => togglePref(tp.id)}>
              <div className="pref-icon">{tp.icon}</div>
              <div>
                <div className="pref-name">{tp.name}</div>
                <div className="pref-desc">{tp.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 8, textAlign: "center" }}>
          Preferences shape your AI suggestions & routes
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ padding: "4px 18px 8px", fontFamily: "var(--head)", fontSize: 14, fontWeight: 700 }}>⚙️ Settings</div>
        {[
          { key: "eco", label: "Eco-Friendly Routes", sub: "Prefer sustainable travel options" },
          { key: "smart", label: "Smart Suggestions", sub: "AI-powered recommendations" },
          { key: "notifications", label: "Travel Alerts", sub: "Weather & crowd updates" },
        ].map(s => (
          <div key={s.key} className="setting-row" onClick={() => setToggles(prev => ({ ...prev, [s.key]: !prev[s.key] }))}>
            <div>
              <div className="setting-label">{s.label}</div>
              <div className="setting-sub">{s.sub}</div>
            </div>
            <div className={`toggle ${toggles[s.key] ? "on" : ""}`} />
          </div>
        ))}
      </div>

      <div style={{ margin: "0 18px 24px" }}>
        <div style={{
          background: "linear-gradient(135deg, rgba(52,211,153,.1), rgba(56,189,248,.1))",
          border: "1px solid rgba(52,211,153,.25)", borderRadius: "var(--r)",
          padding: "14px 16px", display: "flex", alignItems: "center", gap: 12
        }}>
          <div style={{ fontSize: 28 }}>🌿</div>
          <div>
            <div style={{ fontFamily: "var(--head)", fontSize: 14, fontWeight: 700, color: "var(--green)" }}>Eco Impact</div>
            <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 2 }}>You've chosen eco routes 7 times this month — saving ~3.2 kg CO₂</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function SmartTravelApp() {
  const [page, setPage]         = useState("home");
  const [prefs, setPrefs]       = useState(() => {
    try { return JSON.parse(localStorage.getItem("travel_prefs") || "[]"); } catch { return []; }
  });
  const [chatMsg, setChatMsg]   = useState(null);
  const [mapDest, setMapDest]   = useState(null);

  // Persist prefs
  useEffect(() => {
    try { localStorage.setItem("travel_prefs", JSON.stringify(prefs)); } catch {}
  }, [prefs]);

  const navigateTo = useCallback((target, opts = {}) => {
    setPage(target);
    if (opts.chat) setChatMsg(opts.chat);
    if (opts.dest) setMapDest(opts.dest);
  }, []);

  const openChat = useCallback((msg) => {
    setChatMsg(msg);
    setPage("chat");
  }, []);

  const NAV = [
    { id: "home",    icon: "🏠", label: "Home" },
    { id: "explore", icon: "🔭", label: "Explore" },
    { id: "map",     icon: "🗺️", label: "Map" },
    { id: "chat",    icon: "🤖", label: "AI" },
    { id: "profile", icon: "👤", label: "Profile" },
  ];

  return (
    <>
      <style>{STYLES}</style>
      <div className="app-shell">
        {/* Page content */}
        <div style={{ flex: 1, overflow: "hidden", position: "relative", zIndex: 1, display: "flex", flexDirection: "column" }}>
          {page === "home"    && <HomePage    onChat={openChat} onNavigate={(p, o) => navigateTo(p, o)} />}
          {page === "explore" && <ExplorePage onChat={openChat} onNavigate={(p, o) => navigateTo(p, o)} />}
          {page === "map"     && <MapPage     onChat={openChat} destination={mapDest} />}
          {page === "chat"    && <ChatPage    prefs={prefs} initialMessage={chatMsg} key={chatMsg} />}
          {page === "profile" && <ProfilePage prefs={prefs} setPrefs={setPrefs} />}
        </div>

        {/* Floating AI button (visible on non-chat pages) */}
        {page !== "chat" && (
          <button className="ai-fab" onClick={() => openChat(null)} title="Ask AI">🤖</button>
        )}

        {/* Bottom Nav */}
        <nav className="bottom-nav">
          {NAV.map(n => (
            <button key={n.id} className={`nav-item ${page === n.id ? "active" : ""}`}
              onClick={() => { setPage(n.id); setChatMsg(null); setMapDest(null); }}>
              <span className="nav-icon">{n.icon}</span>
              <span>{n.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}
