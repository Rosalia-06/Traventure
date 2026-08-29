import { useState, useRef, useEffect, useCallback } from "react";
const API_BASE_URL = "https://traventure-backend-jx6j.onrender.com";

/* ════════════════════════════════════════════════════════════════════════
   TRAVENTURE — design tokens
   Palette: dusk-journal. A deep forest-night background instead of the
   generic SaaS navy, warm "passport stamp" gold as the hero accent, teal
   as the informational accent, sage for eco actions. Display type is a
   characterful serif (Fraunces) used sparingly for headings — like the
   cover of a travel journal — paired with a clean geometric sans for body
   and UI. The signature motif is a dashed "ticket perforation" divider and
   a circular stamp badge, echoing a passport / boarding pass.
   ════════════════════════════════════════════════════════════════════════ */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,500&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:        #0e1512;
    --surface:   #121b17;
    --card:      #182420;
    --card-hi:   #1f2e28;
    --border:    rgba(238,241,234,0.09);
    --border-hi: rgba(238,241,234,0.18);

    --gold:      #e2a54c;
    --gold-dim:  rgba(226,165,76,0.14);
    --teal:      #4fb6a8;
    --teal-dim:  rgba(79,182,168,0.14);
    --sage:      #8bc06b;
    --sage-dim:  rgba(139,192,107,0.14);
    --coral:     #e0785f;
    --coral-dim: rgba(224,120,95,0.14);
    --indigo:    #8d95d9;
    --indigo-dim:rgba(141,149,217,0.14);

    --ink:       #eef1ea;
    --ink2:      #aab5ac;
    --ink3:      #647065;

    --nav-w:     226px;
    --nav-h:     70px;
    --display:   'Fraunces', serif;
    --body:      'Plus Jakarta Sans', sans-serif;
    --r:         18px;
    --r-sm:      12px;
    --r-xs:      8px;
  }

  html, body, #root { height: 100%; }
  body { background: var(--bg); color: var(--ink); font-family: var(--body); -webkit-font-smoothing: antialiased; }

  button, input, textarea { font-family: inherit; }
  button { cursor: pointer; }
  ::selection { background: var(--gold-dim); color: var(--gold); }

  /* ── Shell ─────────────────────────────────────────────────────────── */
  .tv-shell {
    display: flex;
    flex-direction: column;
    height: 100dvh;
    width: 100%;
    max-width: 480px;
    margin: 0 auto;
    position: relative;
    overflow: hidden;
    background: var(--bg);
  }
  .tv-shell::before {
    content:''; position:absolute; inset:0; z-index:0; pointer-events:none;
    background-image: radial-gradient(circle at 20% 0%, rgba(226,165,76,0.06), transparent 45%),
      radial-gradient(circle at 90% 20%, rgba(79,182,168,0.05), transparent 40%);
  }
  .tv-main { flex:1; display:flex; flex-direction:column; overflow:hidden; position:relative; z-index:1; }

  @media (min-width: 900px) {
    .tv-shell { max-width: 1180px; flex-direction: row; height: 100vh; border-inline: 1px solid var(--border); }
    .tv-main { flex-direction: column; }
  }

  /* ── Ticket-perforation divider (signature motif) ── */
  .tv-perf { position:relative; height:1px; background: transparent; margin: 0 18px; }
  .tv-perf::before {
    content:''; position:absolute; inset:0;
    background-image: repeating-linear-gradient(90deg, var(--border) 0 6px, transparent 6px 12px);
  }

  /* ── Page scroll container ── */
  .page { flex:1; overflow-y:auto; -webkit-overflow-scrolling:touch; padding-bottom: calc(var(--nav-h) + 14px); scrollbar-width:thin; scrollbar-color: var(--border) transparent; }
  .page::-webkit-scrollbar { width:3px; }
  .page::-webkit-scrollbar-thumb { background: var(--border); border-radius:4px; }
  @media (min-width: 900px) { .page { padding-bottom: 24px; } }

  @keyframes fadeUp { from{opacity:0; transform:translateY(10px);} to{opacity:1; transform:translateY(0);} }
  @keyframes fadeIn { from{opacity:0;} to{opacity:1;} }
  @keyframes float  { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-7px);} }
  @keyframes pulseDot { 0%,100%{opacity:1; transform:scale(1);} 50%{opacity:.5; transform:scale(.85);} }
  @keyframes stampIn { from{opacity:0; transform:scale(1.3) rotate(-8deg);} to{opacity:1; transform:scale(1) rotate(-8deg);} }
  .fade-up { animation: fadeUp .4s ease both; }

  /* ══════════ AUTH (Login / Signup) ══════════ */
  .auth-screen {
    height:100%; width:100%; overflow-y:auto;
    display:flex; flex-direction:column; padding: 40px 26px 32px;
    position:relative; z-index:1;
  }
  .auth-mark { display:flex; align-items:center; gap:10px; margin-bottom: 36px; }
  .auth-stamp {
    width:44px; height:44px; border-radius:50%;
    border:2px dashed var(--gold); color:var(--gold);
    display:flex; align-items:center; justify-content:center;
    font-family: var(--display); font-weight:700; font-size:18px;
    transform: rotate(-8deg); animation: stampIn .5s ease both;
    flex-shrink:0;
  }
  .auth-brand { font-family: var(--display); font-size:20px; font-weight:700; letter-spacing:-0.3px; }
  .auth-brand-sub { font-size:11px; color:var(--ink2); letter-spacing:1.5px; text-transform:uppercase; }

  .auth-hero h1 {
    font-family: var(--display); font-size: 34px; line-height:1.15; font-weight:600;
    letter-spacing:-0.5px; margin-bottom:10px;
  }
  .auth-hero h1 em { color:var(--gold); font-style: italic; }
  .auth-hero p { color:var(--ink2); font-size:14px; line-height:1.6; max-width:340px; margin-bottom:28px; }

  .auth-tabs { display:flex; gap:4px; background:var(--card); border:1px solid var(--border); border-radius:99px; padding:4px; margin-bottom:22px; width:fit-content; }
  .auth-tab { padding:8px 18px; border:none; background:transparent; border-radius:99px; font-size:13px; font-weight:600; color:var(--ink2); transition:all .2s; }
  .auth-tab.active { background:var(--gold); color:#1a1206; }

  .auth-form { display:flex; flex-direction:column; gap:14px; max-width:360px; }
  .auth-field label { display:block; font-size:12px; color:var(--ink2); margin-bottom:6px; font-weight:500; }
  .auth-field input {
    width:100%; background:var(--card); border:1px solid var(--border); border-radius:var(--r-sm);
    padding:13px 15px; color:var(--ink); font-size:14px; outline:none; transition:border-color .2s;
  }
  .auth-field input:focus { border-color: var(--gold); }
  .auth-field input::placeholder { color: var(--ink3); }
  .auth-error { font-size:12px; color:var(--coral); margin-top:-4px; }

  .auth-submit {
    margin-top:6px; background:linear-gradient(135deg, var(--gold), #c9852f);
    border:none; border-radius:var(--r-sm); padding:14px; font-size:14px; font-weight:700;
    color:#1a1206; box-shadow: 0 8px 22px rgba(226,165,76,0.25); transition: transform .15s;
  }
  .auth-submit:hover { transform: translateY(-1px); }
  .auth-submit:active { transform: translateY(0); }

  .auth-guest { margin-top:16px; background:transparent; border:1px solid var(--border); color:var(--ink2); border-radius:var(--r-sm); padding:12px; font-size:13px; font-weight:600; }
  .auth-guest:hover { border-color: var(--border-hi); color:var(--ink); }

  .auth-switch { margin-top:18px; font-size:12.5px; color:var(--ink2); }
  .auth-switch button { background:none; border:none; color:var(--gold); font-weight:700; font-size:12.5px; }

  .auth-side {
    display:none;
  }
  @media (min-width: 900px) {
    .auth-screen { flex-direction:row; padding:0; }
    .auth-form-col { flex:1; display:flex; flex-direction:column; justify-content:center; padding: 48px 64px; max-width:560px; }
    .auth-side {
      display:flex; flex:1; position:relative; align-items:flex-end; padding:48px;
      background:
        radial-gradient(circle at 30% 20%, rgba(226,165,76,0.18), transparent 55%),
        radial-gradient(circle at 80% 70%, rgba(79,182,168,0.16), transparent 50%),
        linear-gradient(180deg, #14211c, #0e1512);
      border-left:1px solid var(--border);
    }
    .auth-side-quote { font-family: var(--display); font-size:26px; line-height:1.35; max-width:400px; font-style:italic; color:var(--ink); }
    .auth-side-quote span { display:block; margin-top:14px; font-family:var(--body); font-style:normal; font-size:13px; color:var(--ink2); }
  }

  /* ══════════ ONBOARDING (travel style picker) ══════════ */
  .onb-screen { height:100%; display:flex; flex-direction:column; padding: 36px 24px 24px; overflow-y:auto; position:relative; z-index:1; }
  .onb-step { font-size:11px; letter-spacing:1.5px; text-transform:uppercase; color:var(--teal); font-weight:700; margin-bottom:8px; }
  .onb-screen h1 { font-family:var(--display); font-size:26px; font-weight:600; margin-bottom:6px; letter-spacing:-0.3px; }
  .onb-screen p.sub { color:var(--ink2); font-size:13.5px; margin-bottom:22px; }
  .onb-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:24px; }
  .onb-card {
    background:var(--card); border:1px solid var(--border); border-radius:var(--r-sm);
    padding:16px 14px; cursor:pointer; transition: all .18s; text-align:left;
  }
  .onb-card:hover { border-color:var(--border-hi); }
  .onb-card.on { border-color:var(--gold); background:var(--gold-dim); }
  .onb-card .ic { font-size:24px; margin-bottom:8px; display:block; }
  .onb-card .nm { font-size:13.5px; font-weight:700; }
  .onb-card .ds { font-size:11px; color:var(--ink2); margin-top:2px; }
  .onb-actions { margin-top:auto; display:flex; gap:10px; }
  .onb-skip { flex:1; background:transparent; border:1px solid var(--border); color:var(--ink2); border-radius:var(--r-sm); padding:14px; font-weight:600; font-size:13.5px; }
  .onb-next { flex:2; background:linear-gradient(135deg, var(--gold), #c9852f); border:none; color:#1a1206; border-radius:var(--r-sm); padding:14px; font-weight:700; font-size:13.5px; }
  .onb-next:disabled { opacity:.5; }
  @media (min-width:900px){ .onb-screen{ max-width:640px; margin:0 auto; justify-content:center; } .onb-grid{ grid-template-columns:repeat(3,1fr);} }

  /* ══════════ NAV ══════════ */
  .tv-nav {
    height: var(--nav-h);
    background: rgba(14,21,18,0.92);
    backdrop-filter: blur(20px);
    border-top: 1px solid var(--border);
    display:flex; align-items:stretch;
    position:relative; z-index:100; flex-shrink:0;
  }
  .nav-item {
    flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px;
    border:none; background:transparent; color:var(--ink3); font-size:10px; font-weight:600;
    letter-spacing:.2px; padding-bottom:4px; position:relative; transition: color .2s;
  }
  .nav-item.active { color: var(--gold); }
  .nav-item .nav-icon { font-size:20px; transition: transform .2s; }
  .nav-item.active .nav-icon { transform: translateY(-2px); }
  .nav-item::after { content:''; position:absolute; bottom:0; left:50%; transform:translateX(-50%); width:0; height:2px; background:var(--gold); border-radius:1px; transition:width .25s; }
  .nav-item.active::after { width:22px; }

  @media (min-width: 900px) {
    .tv-nav {
      order:-1; flex-direction:column; width:var(--nav-w); height:100%; border-top:none; border-right:1px solid var(--border);
      padding: 24px 12px; gap:2px; align-items:stretch; background: var(--surface);
    }
    .nav-item { flex:none; flex-direction:row; justify-content:flex-start; gap:12px; padding:12px 14px; border-radius:var(--r-sm); font-size:13.5px; }
    .nav-item .nav-icon { font-size:18px; }
    .nav-item.active { background: var(--gold-dim); }
    .nav-item::after { display:none; }
    .nav-brand { display:flex; align-items:center; gap:10px; padding: 4px 14px 22px; }
  }
  .nav-brand { display:none; }
  @media (min-width:900px){ .nav-brand{ display:flex; } }
  .nav-stamp { width:34px;height:34px;border-radius:50%; border:2px dashed var(--gold); color:var(--gold); display:flex;align-items:center;justify-content:center; font-family:var(--display); font-weight:700; font-size:14px; transform:rotate(-8deg); flex-shrink:0; }
  .nav-brand-txt { font-family:var(--display); font-size:15px; font-weight:700; }

  /* ── AI FAB (mobile only) ── */
  .ai-fab {
    position:absolute; bottom: calc(var(--nav-h) + 18px); right:18px; width:54px; height:54px; border-radius:50%;
    background: linear-gradient(135deg, var(--teal), #2e8a7d); border:none;
    display:flex; align-items:center; justify-content:center; font-size:22px;
    box-shadow: 0 0 26px rgba(79,182,168,0.4); z-index:90; transition: all .25s;
  }
  .ai-fab:hover { transform: scale(1.08); }
  @media (min-width:900px){ .ai-fab { display:none; } }

  /* ── shared section header ── */
  .sec-hd { display:flex; align-items:center; justify-content:space-between; padding:0 20px 10px; }
  .sec-title { font-family:var(--display); font-size:18px; font-weight:600; letter-spacing:-.2px; }
  .sec-link { font-size:12px; color:var(--teal); font-weight:600; }

  .badge { font-size:10px; font-weight:700; padding:3px 9px; border-radius:99px; letter-spacing:.3px; }
  .badge-gold { background:var(--gold-dim); color:var(--gold); }
  .badge-sage { background:var(--sage-dim); color:var(--sage); }
  .badge-teal { background:var(--teal-dim); color:var(--teal); }
  .badge-coral{ background:var(--coral-dim); color:var(--coral); }
  .badge-indigo{ background:var(--indigo-dim); color:var(--indigo); }

  /* ══════════ HOME ══════════ */
  .home-hero { padding: 26px 20px 16px; position:relative; }
  .home-greeting { font-size:13px; color:var(--ink2); margin-bottom:4px; }
  .home-title { font-family:var(--display); font-size:28px; font-weight:600; letter-spacing:-.4px; line-height:1.15; }
  .home-title em { color:var(--gold); font-style:italic; }

  .weather-card {
    margin:0 20px; background: linear-gradient(135deg, rgba(79,182,168,0.14), rgba(226,165,76,0.08));
    border:1px solid var(--teal-dim); border-radius:var(--r); padding:18px 20px;
    display:flex; align-items:center; gap:16px; cursor:pointer; transition: all .2s;
  }
  .weather-card:hover { border-color: rgba(79,182,168,.4); transform:translateY(-1px); }
  .weather-icon { font-size:50px; animation: float 4s ease-in-out infinite; flex-shrink:0; }
  .weather-temp { font-family:var(--display); font-size:32px; font-weight:700; line-height:1; }
  .weather-meta { font-size:12px; color:var(--ink2); margin-top:4px; }
  .weather-advice { margin-left:auto; font-size:11px; color:var(--ink2); background:rgba(255,255,255,.04); border-radius:var(--r-sm); padding:7px 11px; max-width:120px; text-align:center; line-height:1.4; flex-shrink:0; }

  .section-wrap { margin-top:24px; }

  .quick-action-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; padding:0 20px; }
  .quick-btn { background:var(--card); border:1px solid var(--border); border-radius:var(--r-sm); padding:14px 4px 11px; display:flex; flex-direction:column; align-items:center; gap:6px; transition:all .2s; text-align:center; }
  .quick-btn:hover { border-color:var(--gold); transform:translateY(-2px); }
  .quick-btn .qb-icon { font-size:22px; }
  .quick-btn .qb-label { font-size:10.5px; color:var(--ink2); font-weight:600; }

  .place-scroll, .restaurant-card-row { display:flex; gap:12px; padding:0 20px; overflow-x:auto; scrollbar-width:none; }
  .place-scroll::-webkit-scrollbar, .restaurant-card-row::-webkit-scrollbar { display:none; }
  .place-mini { flex-shrink:0; width:152px; background:var(--card); border:1px solid var(--border); border-radius:var(--r); overflow:hidden; transition:all .2s; }
  .place-mini:hover { border-color:var(--border-hi); transform:translateY(-2px); }
  .place-mini-img { height:92px; display:flex; align-items:center; justify-content:center; font-size:36px; }
  .place-mini-body { padding:9px 11px; }
  .place-mini-name { font-size:13px; font-weight:700; }
  .place-mini-sub { font-size:11px; color:var(--ink2); margin-top:2px; }

  .rest-card { flex-shrink:0; width:204px; background:var(--card); border:1px solid var(--border); border-radius:var(--r); overflow:hidden; transition:all .2s; }
  .rest-card:hover { border-color:var(--border-hi); transform:translateY(-2px); }
  .rest-img { height:112px; display:flex; align-items:center; justify-content:center; font-size:42px; }
  .rest-body { padding:11px 13px; }
  .rest-name { font-size:13.5px; font-weight:700; }
  .rest-meta { font-size:11px; color:var(--ink2); margin-top:4px; display:flex; align-items:center; gap:6px; }

  .ai-cta { margin: 24px 20px 4px; background: linear-gradient(135deg, rgba(79,182,168,.14), rgba(141,149,217,.1)); border:1px solid var(--teal-dim); border-radius:var(--r); padding:18px; display:flex; align-items:center; gap:14px; }
  .ai-cta .icon { font-size:36px; }
  .ai-cta .t { font-family:var(--display); font-size:15.5px; font-weight:700; }
  .ai-cta .d { font-size:12px; color:var(--ink2); margin-top:2px; }
  .ai-cta .go { margin-left:auto; font-size:20px; color:var(--teal); }

  @media (min-width:900px){
    .home-hero{padding:32px 32px 18px;}
    .weather-card, .quick-action-grid, .place-scroll, .restaurant-card-row, .ai-cta { margin-left:32px; margin-right:32px; padding-left:0; padding-right:0; }
    .weather-card{margin-left:32px;margin-right:32px;}
    .sec-hd{padding:0 32px 12px;}
    .quick-action-grid{grid-template-columns:repeat(4,minmax(0,160px));}
  }

  /* ══════════ EXPLORE ══════════ */
  .explore-header { padding:26px 20px 14px; }
  .explore-header .sec-title { font-size:24px; margin-bottom:4px; }
  .explore-search { display:flex; align-items:center; gap:9px; background:var(--card); border:1px solid var(--border); border-radius:99px; padding:12px 17px; margin:0 20px 14px; transition:border-color .2s; }
  .explore-search:focus-within { border-color: var(--gold); }
  .explore-search input { flex:1; background:transparent; border:none; outline:none; color:var(--ink); font-size:14px; }
  .explore-search input::placeholder { color: var(--ink3); }

  .filter-row { display:flex; gap:8px; padding:0 20px 6px; overflow-x:auto; scrollbar-width:none; }
  .filter-row::-webkit-scrollbar { display:none; }
  .filter-chip { flex-shrink:0; padding:7px 15px; border-radius:99px; border:1px solid var(--border); background:var(--card); color:var(--ink2); font-size:12px; font-weight:600; transition:all .2s; white-space:nowrap; }
  .filter-chip.active, .filter-chip:hover { background:var(--gold); color:#1a1206; border-color:var(--gold); }

  .explore-grid { display:grid; grid-template-columns:1fr 1fr; gap:13px; padding:14px 20px; }
  .ex-card { background:var(--card); border:1px solid var(--border); border-radius:var(--r); overflow:hidden; transition:all .2s; }
  .ex-card:hover { border-color:var(--border-hi); transform:translateY(-2px); }
  .ex-card-img { height:104px; display:flex; align-items:center; justify-content:center; font-size:38px; background:linear-gradient(135deg, var(--card), var(--card-hi)); }
  .ex-card-body { padding:11px; }
  .ex-card-name { font-size:13.5px; font-weight:700; }
  .ex-card-meta { font-size:11px; color:var(--ink2); margin-top:3px; }
  .ex-card-footer { display:flex; align-items:center; justify-content:space-between; margin-top:8px; }
  @media (min-width:900px){ .explore-header,.explore-search,.filter-row,.explore-grid{padding-left:32px;padding-right:32px;} .explore-grid{grid-template-columns:repeat(4,1fr);} }

  /* ══════════ MAP ══════════ */
  .map-container { position:relative; height:100%; display:flex; flex-direction:column; }
  .map-view { flex:1; background:var(--card); position:relative; overflow:hidden; min-height:280px; }
  .map-grid { position:absolute; inset:0; background-image: linear-gradient(rgba(79,182,168,0.05) 1px,transparent 1px), linear-gradient(90deg,rgba(79,182,168,0.05) 1px,transparent 1px); background-size:32px 32px; }
  .map-pin { position:absolute; transform:translate(-50%,-50%); display:flex; flex-direction:column; align-items:center; transition:transform .2s; }
  .map-pin:hover { transform:translate(-50%,-50%) scale(1.15); }
  .pin-dot { width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:18px; border:2px solid rgba(255,255,255,.15); box-shadow:0 4px 16px rgba(0,0,0,.4); }
  .pin-label { margin-top:4px; font-size:10px; font-weight:700; background:var(--surface); border:1px solid var(--border); border-radius:var(--r-xs); padding:2px 7px; white-space:nowrap; }
  .user-pin { position:absolute; transform:translate(-50%,-50%); width:16px; height:16px; border-radius:50%; background:var(--teal); box-shadow:0 0 0 4px rgba(79,182,168,.25), 0 0 0 8px rgba(79,182,168,.1); animation:userPing 2s ease-in-out infinite; }
  @keyframes userPing{0%,100%{box-shadow:0 0 0 4px rgba(79,182,168,.25),0 0 0 8px rgba(79,182,168,.1);}50%{box-shadow:0 0 0 6px rgba(79,182,168,.35),0 0 0 12px rgba(79,182,168,.08);}}
  .map-search-bar { position:absolute; top:14px; left:14px; right:14px; z-index:10; background:rgba(18,27,23,.92); backdrop-filter:blur(12px); border:1px solid var(--border-hi); border-radius:var(--r-sm); display:flex; align-items:center; gap:8px; padding:11px 15px; }
  .map-search-bar input { flex:1; background:transparent; border:none; outline:none; color:var(--ink); font-size:13px; }
  .map-search-bar input::placeholder { color: var(--ink3); }
  .route-panel { background:var(--surface); border-top:1px solid var(--border); padding:16px 20px; flex-shrink:0; }
  .route-title { font-family:var(--display); font-size:15px; font-weight:700; margin-bottom:11px; }
  .route-options { display:flex; gap:8px; overflow-x:auto; scrollbar-width:none; margin-bottom:13px; }
  .route-options::-webkit-scrollbar { display:none; }
  .route-opt { flex-shrink:0; padding:9px 13px; border-radius:var(--r-sm); border:1px solid var(--border); background:var(--card); transition:all .2s; text-align:center; min-width:92px; }
  .route-opt.selected { border-color:var(--gold); background:var(--gold-dim); }
  .route-opt .r-icon { font-size:18px; margin-bottom:3px; }
  .route-opt .r-label { font-size:11px; font-weight:700; }
  .route-opt .r-sub { font-size:10px; color:var(--ink2); margin-top:1px; }
  .route-info { background:var(--card); border:1px solid var(--border); border-radius:var(--r-sm); padding:11px 15px; display:flex; align-items:center; gap:14px; }
  .route-stat { text-align:center; flex:1; }
  .route-stat .val { font-family:var(--display); font-size:18px; font-weight:700; color:var(--gold); }
  .route-stat .lbl { font-size:10px; color:var(--ink2); margin-top:1px; }
  .route-divider { width:1px; height:30px; background:var(--border); }
  @media (min-width:900px){ .map-container{ height: calc(100vh - 0px);} }

  /* ══════════ CHAT ══════════ */
  .chat-page { display:flex; flex-direction:column; height:100%; overflow:hidden; }
  .chat-header { padding:22px 20px 15px; border-bottom:1px solid var(--border); display:flex; align-items:center; gap:12px; flex-shrink:0; }
  .chat-logo { width:42px;height:42px;border-radius:12px; background:linear-gradient(135deg,var(--teal),#2e8a7d); display:flex;align-items:center;justify-content:center;font-size:19px; box-shadow:0 0 20px rgba(79,182,168,.3); flex-shrink:0; }
  .chat-title { font-family:var(--display); font-size:18px; font-weight:700; }
  .chat-sub { font-size:11px; color:var(--ink2); margin-top:1px; }
  .chat-status { margin-left:auto; display:flex; align-items:center; gap:5px; font-size:11px; color:var(--sage); font-weight:600; }
  .chat-chips { display:flex; gap:8px; padding:11px 18px 2px; overflow-x:auto; scrollbar-width:none; flex-shrink:0; }
  .chat-chips::-webkit-scrollbar { display:none; }
  .chip { flex-shrink:0; padding:7px 14px; border-radius:99px; border:1px solid var(--border); background:var(--card); color:var(--ink); font-size:12px; transition:all .2s; white-space:nowrap; display:flex; align-items:center; gap:5px; }
  .chip:hover, .chip.active { border-color:var(--gold); color:var(--gold); background:var(--gold-dim); }
  .chat-messages { flex:1; overflow-y:auto; padding:12px 16px 6px; display:flex; flex-direction:column; gap:11px; scrollbar-width:thin; scrollbar-color:var(--border) transparent; }
  .chat-messages::-webkit-scrollbar { width:3px; }
  .chat-messages::-webkit-scrollbar-thumb { background:var(--border); border-radius:3px; }
  .msg { display:flex; gap:9px; align-items:flex-end; animation:fadeUp .3s ease; }
  .msg.user { flex-direction:row-reverse; }
  .msg-avatar { width:29px;height:29px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0; background:linear-gradient(135deg,var(--teal),#2e8a7d); }
  .msg.user .msg-avatar { background:linear-gradient(135deg,var(--gold),#c9852f); }
  .msg-bubble { max-width:82%; padding:11px 15px; border-radius:var(--r); font-size:13.5px; line-height:1.6; }
  .msg.ai .msg-bubble { background:var(--card); border:1px solid var(--border); border-bottom-left-radius:4px; }
  .msg.user .msg-bubble { background: rgba(226,165,76,0.1); border:1px solid var(--gold-dim); border-bottom-right-radius:4px; }
  .msg-time { font-size:10px; color:var(--ink3); margin-top:3px; }
  .msg.ai .msg-time { text-align:left; }
  .msg.user .msg-time { text-align:right; }
  .typing { display:flex; gap:5px; padding:3px 2px; align-items:center; }
  .typing span { width:6px;height:6px;border-radius:50%;background:var(--teal);opacity:.5; animation:bounce 1.2s infinite; }
  .typing span:nth-child(2){animation-delay:.2s;} .typing span:nth-child(3){animation-delay:.4s;}
  @keyframes bounce{0%,80%,100%{transform:translateY(0);opacity:.5;}40%{transform:translateY(-5px);opacity:1;}}
  .place-cards { display:flex; flex-direction:column; gap:7px; margin-top:9px; }
  .p-card { background:rgba(255,255,255,.03); border:1px solid var(--border); border-radius:var(--r-sm); padding:9px 12px; display:flex; gap:9px; align-items:center; }
  .p-icon { width:34px;height:34px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0;background:var(--teal-dim); }
  .p-name { font-size:12.5px;font-weight:700; }
  .p-meta { font-size:11px;color:var(--ink2);margin-top:1px; }
  .weather-inline { background: linear-gradient(135deg, rgba(79,182,168,.12), rgba(226,165,76,.08)); border:1px solid var(--teal-dim); border-radius:var(--r-sm); padding:11px 13px; margin-top:9px; display:flex; align-items:center; gap:12px; }
  .wi-icon { font-size:32px; }
  .wi-temp { font-family:var(--display); font-size:23px; font-weight:700; }
  .wi-desc { font-size:11px;color:var(--ink2); }
  .chat-input-area { padding:11px 14px 18px; flex-shrink:0; display:flex; gap:8px; align-items:flex-end; border-top:1px solid transparent; }
  .chat-input-wrap { flex:1; background:var(--card); border:1px solid var(--border); border-radius:99px; display:flex; align-items:center; padding:10px 15px; gap:7px; transition:border-color .2s; }
  .chat-input-wrap:focus-within { border-color: var(--gold); }
  .chat-input { flex:1; background:transparent; border:none; outline:none; color:var(--ink); font-size:13.5px; resize:none; max-height:90px; line-height:1.5; }
  .chat-input::placeholder { color: var(--ink3); }
  .send-btn { width:41px;height:41px;border-radius:50%;flex-shrink:0; background:linear-gradient(135deg,var(--gold),#c9852f); border:none; display:flex;align-items:center;justify-content:center; font-size:15px; transition:all .2s; box-shadow:0 0 14px rgba(226,165,76,.3); color:#1a1206; }
  .send-btn:hover:not(:disabled){transform:scale(1.08);} .send-btn:disabled{opacity:.4;cursor:not-allowed;}
  .chat-welcome { flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center; padding:32px 24px;text-align:center;gap:8px; }
  .cw-icon { font-size:48px;margin-bottom:6px;animation:float 3s ease-in-out infinite; }
  .cw-title { font-family:var(--display);font-size:21px;font-weight:600; }
  .cw-sub { color:var(--ink2);font-size:13px;line-height:1.6;max-width:270px; }
  .bubble-bold { color:var(--gold);font-weight:700; }
  .bubble-em { color:var(--teal); }
  .bubble-tip { margin-top:7px;padding:8px 10px; background:var(--sage-dim);border-left:3px solid var(--sage); border-radius:0 6px 6px 0;font-size:12px;color:var(--sage); }

  /* ══════════ ACCOUNT ══════════ */
  .profile-header { padding:30px 20px 18px; display:flex;flex-direction:column;align-items:center;gap:10px; text-align:center; }
  .avatar-circle { width:74px;height:74px;border-radius:50%; background:linear-gradient(135deg,var(--gold),#c9852f); display:flex;align-items:center;justify-content:center; font-family:var(--display); font-size:26px; font-weight:700; color:#1a1206; box-shadow:0 0 24px rgba(226,165,76,.3); }
  .profile-name { font-family:var(--display);font-size:21px;font-weight:600; }
  .profile-email { font-size:12px;color:var(--ink2); }
  .pref-section { padding:0 20px;margin-bottom:22px; }
  .pref-label { font-family:var(--display);font-size:15px;font-weight:700;margin-bottom:11px; }
  .pref-grid { display:grid;grid-template-columns:1fr 1fr;gap:9px; }
  .pref-item { background:var(--card);border:1px solid var(--border);border-radius:var(--r-sm); padding:13px 15px;transition:all .2s;display:flex;align-items:center;gap:11px; }
  .pref-item.selected { border-color:var(--gold);background:var(--gold-dim); }
  .pref-item:hover { border-color:var(--border-hi); }
  .pref-icon { font-size:20px; }
  .pref-name { font-size:12.5px;font-weight:700; }
  .pref-desc { font-size:10.5px;color:var(--ink2);margin-top:1px; }
  .setting-row { display:flex;align-items:center;justify-content:space-between; padding:14px 20px;border-bottom:1px solid var(--border); transition:background .2s; }
  .setting-row:hover { background: rgba(255,255,255,.02); }
  .setting-label { font-size:14px;font-weight:600; }
  .setting-sub { font-size:11px;color:var(--ink2);margin-top:1px; }
  .toggle { width:42px;height:24px;border-radius:99px; background:var(--ink3);position:relative;transition:background .2s; flex-shrink:0; border:none; }
  .toggle.on { background:var(--gold); }
  .toggle::after { content:'';position:absolute;width:18px;height:18px;border-radius:50%; background:#fff;top:3px;left:3px;transition:transform .2s; }
  .toggle.on::after { transform:translateX(18px); }
  .logout-btn { margin: 6px 20px 26px; background:transparent; border:1px solid var(--coral-dim); color:var(--coral); border-radius:var(--r-sm); padding:13px; font-size:13.5px; font-weight:700; width:calc(100% - 40px); }
  .logout-btn:hover { background:var(--coral-dim); }
  @media (min-width:900px){ .pref-section, .profile-header{ max-width:640px; margin-left:auto; margin-right:auto; } .setting-row{max-width:640px;margin:0 auto; border-left:none;border-right:none;} .logout-btn{max-width:600px;margin:6px auto 26px;} }
`;

/* ── AI system prompt ─────────────────────────────────────────────────── */
const BASE_SYSTEM_PROMPT = `You are TravelBot, the AI brain of "Traventure" — a sustainable travel companion app.
Help users explore places, plan routes, find food, get weather advice, and travel sustainably.

PERSONALITY: Friendly local guide. Concise. Action-oriented. Use emojis naturally.

RESPONSE FORMAT:
1. Keep text to 2-5 sentences.
2. For places, append at response end:
[PLACES_JSON][{"name":"...", "type":"...", "emoji":"...", "rating":"4.2★", "status":"Open", "desc":"...", "distance":"1.2 km"}][/PLACES_JSON]
Include 2-4 places when relevant.
3. For weather, append:
[WEATHER_JSON]{"temp":"31°C", "condition":"Partly Cloudy", "emoji":"⛅", "advice":"Great for outdoor dining"}[/WEATHER_JSON]
4. Route suggestions should emphasize: less crowded roads, eco-friendly options, well-developed roads, user preference routes.
5. Rain → indoor (cafés, museums, malls). Heat → shaded/AC places. Nice weather → outdoor places.
6. End with a quick tip or follow-up question.

SUSTAINABLE TRAVEL TIPS: Suggest walking/cycling when < 2km, public transit, eco-certified hotels, plant-based food options.
Do NOT say you lack real-time data. Give confident local-knowledge recommendations.`;

/* ── Static data ──────────────────────────────────────────────────────── */
const NEARBY_PLACES = [
  { name: "Raj Mahal Palace", emoji: "🏰", type: "Heritage", rating: "4.7★", desc: "1.2 km", color: "var(--indigo-dim)" },
  { name: "Spice Garden", emoji: "🌿", type: "Park", rating: "4.5★", desc: "0.8 km", color: "var(--sage-dim)" },
  { name: "Old Market Lane", emoji: "🛒", type: "Market", rating: "4.3★", desc: "2.1 km", color: "var(--gold-dim)" },
  { name: "Sunrise Viewpoint", emoji: "🌅", type: "Viewpoint", rating: "4.9★", desc: "3.4 km", color: "var(--coral-dim)" },
  { name: "Lotus Lake Park", emoji: "🌸", type: "Nature", rating: "4.6★", desc: "1.8 km", color: "var(--sage-dim)" },
];

const RESTAURANTS = [
  { name: "Dhaba House", emoji: "🍛", cuisine: "North Indian", rating: "4.6★", dist: "0.5 km", price: "₹₹", bg: "linear-gradient(135deg, var(--gold-dim), var(--coral-dim))" },
  { name: "Green Leaf Café", emoji: "🥗", cuisine: "Vegan · Eco", rating: "4.8★", dist: "1.1 km", price: "₹₹₹", bg: "linear-gradient(135deg, var(--sage-dim), var(--teal-dim))" },
  { name: "Street Bites", emoji: "🌮", cuisine: "Street Food", rating: "4.4★", dist: "0.3 km", price: "₹", bg: "linear-gradient(135deg, var(--indigo-dim), var(--gold-dim))" },
  { name: "The Rooftop", emoji: "🌃", cuisine: "Pan-Asian", rating: "4.5★", dist: "2.0 km", price: "₹₹₹₹", bg: "linear-gradient(135deg, var(--teal-dim), var(--indigo-dim))" },
];

const EXPLORE_DATA = [
  { name: "Taj Mahal", emoji: "🕌", cat: "Heritage", rating: "5.0★", dist: "4 km", badge: "Iconic", badgeCls: "badge-gold", budget: "₹₹" },
  { name: "Amber Fort", emoji: "🏯", cat: "Heritage", rating: "4.8★", dist: "8 km", badge: "Popular", badgeCls: "badge-indigo", budget: "₹₹" },
  { name: "Local Biryani", emoji: "🍚", cat: "Food", rating: "4.7★", dist: "1 km", badge: "Open", badgeCls: "badge-sage", budget: "₹" },
  { name: "Rooftop Café", emoji: "☕", cat: "Café", rating: "4.6★", dist: "0.8 km", badge: "Trending", badgeCls: "badge-gold", budget: "₹₹" },
  { name: "Lotus Temple", emoji: "🌸", cat: "Temple", rating: "4.9★", dist: "3 km", badge: "Sacred", badgeCls: "badge-coral", budget: "Free" },
  { name: "Night Market", emoji: "🌙", cat: "Market", rating: "4.5★", dist: "2 km", badge: "Hidden Gem", badgeCls: "badge-indigo", budget: "₹" },
  { name: "Eco Trail", emoji: "🌿", cat: "Nature", rating: "4.4★", dist: "5 km", badge: "Eco", badgeCls: "badge-sage", budget: "Free" },
  { name: "Old Bazaar", emoji: "🛍️", cat: "Market", rating: "4.3★", dist: "1.5 km", badge: "Local Fav", badgeCls: "badge-gold", budget: "₹" },
];

const ROUTE_OPTIONS = [
  { id: "fastest", icon: "⚡", label: "Fastest", sub: "12 min", km: "3.2 km", desc: "Via main road" },
  { id: "uncrowded", icon: "🌿", label: "Less Crowded", sub: "18 min", km: "4.1 km", desc: "Quiet streets" },
  { id: "eco", icon: "♻️", label: "Eco-Friendly", sub: "22 min", km: "3.8 km", desc: "Cycle/walk path" },
  { id: "developed", icon: "🛣️", label: "Best Roads", sub: "15 min", km: "3.5 km", desc: "Highway route" },
];

const MAP_PINS = [
  { id: 1, x: "28%", y: "32%", emoji: "🏰", label: "Palace", bg: "var(--indigo-dim)" },
  { id: 2, x: "65%", y: "45%", emoji: "🍛", label: "Dhaba House", bg: "var(--gold-dim)" },
  { id: 3, x: "45%", y: "68%", emoji: "☕", label: "Green Café", bg: "var(--sage-dim)" },
  { id: 4, x: "72%", y: "25%", emoji: "🌅", label: "Viewpoint", bg: "var(--coral-dim)" },
];

const QUICK_CHIPS = [
  { label: "Things to do today", icon: "🗺️" },
  { label: "Best food nearby", icon: "🍜" },
  { label: "Rainy day plans", icon: "🌧️" },
  { label: "Plan 3-hour trip", icon: "⏱️" },
  { label: "Eco-friendly spots", icon: "🌿" },
  { label: "Local hidden gems", icon: "💎" },
];

const TRAVELER_PREFS = [
  { id: "budget", icon: "💰", name: "Budget Traveler", desc: "Best value picks" },
  { id: "foodie", icon: "🍽️", name: "Food Lover", desc: "Top local bites" },
  { id: "nature", icon: "🌿", name: "Nature Lover", desc: "Trails & outdoors" },
  { id: "culture", icon: "🏛️", name: "Cultural Explorer", desc: "Heritage & art" },
  { id: "eco", icon: "♻️", name: "Eco Traveler", desc: "Sustainable routes" },
  { id: "adventure", icon: "🎒", name: "Adventurer", desc: "Off the beaten path" },
];

const NAV = [
  { id: "home", icon: "🏠", label: "Home" },
  { id: "explore", icon: "🔭", label: "Explore" },
  { id: "map", icon: "🗺️", label: "Map" },
  { id: "chat", icon: "🤖", label: "Ask AI" },
  { id: "account", icon: "👤", label: "Account" },
];

/* ── Storage helpers ──────────────────────────────────────────────────── */
const LS = {
  user: "traventure_user",
  onboarded: "traventure_onboarded",
  prefs: "traventure_prefs",
  settings: "traventure_settings",
};
function readLS(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
}
function writeLS(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

/* ── Misc helpers ─────────────────────────────────────────────────────── */
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
  return text.split("\n").map(line => {
    const isTip = line.startsWith("💡") || line.toLowerCase().startsWith("tip:");
    const html = line
      .replace(/\*\*(.+?)\*\*/g, '<span class="bubble-bold">$1</span>')
      .replace(/\*(.+?)\*/g, '<span class="bubble-em">$1</span>');
    if (isTip) return `<div class="bubble-tip">${html}</div>`;
    return `<span>${html}</span>`;
  }).join("<br/>");
}

/* ════════════════════════════════════════════════════════════════════════
   AUTH PAGE
   ════════════════════════════════════════════════════════════════════════ */
function AuthPage({ onAuthed }) {
  const [mode, setMode] = useState("login"); // login | signup
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit(e) {
    e.preventDefault();
    if (mode === "signup" && !name.trim()) return setError("Tell us what to call you.");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Enter a valid email address.");
    if (password.length < 4) return setError("Password should be at least 4 characters.");
    setError("");
    const user = { name: mode === "signup" ? name.trim() : (readLS(LS.user, {}).name || email.split("@")[0]), email };
    onAuthed(user);
  }

  return (
    <div className="auth-screen">
      <div className="auth-form-col">
        <div className="auth-mark">
          <div className="auth-stamp">TV</div>
          <div>
            <div className="auth-brand">Traventure</div>
            <div className="auth-brand-sub">Travel, thoughtfully</div>
          </div>
        </div>

        <div className="auth-hero">
          <h1>Your next <em>journey</em>,<br/>planned with you in mind.</h1>
          <p>Sign in to pick up your saved preferences, or create an account so Traventure can start learning what kind of traveler you are.</p>
        </div>

        <div className="auth-tabs">
          <button type="button" className={`auth-tab ${mode === "login" ? "active" : ""}`} onClick={() => setMode("login")}>Log in</button>
          <button type="button" className={`auth-tab ${mode === "signup" ? "active" : ""}`} onClick={() => setMode("signup")}>Sign up</button>
        </div>

        <form className="auth-form" onSubmit={submit}>
          {mode === "signup" && (
            <div className="auth-field">
              <label>What should we call you?</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Asha" />
            </div>
          )}
          <div className="auth-field">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <div className="auth-field">
            <label>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          {error && <div className="auth-error">{error}</div>}
          <button type="submit" className="auth-submit">{mode === "login" ? "Log in" : "Create account"}</button>
        </form>

        <button className="auth-guest" onClick={() => onAuthed({ name: "Guest", email: "", guest: true })}>Continue as guest</button>

        <div className="auth-switch">
          {mode === "login" ? (
            <>New to Traventure? <button onClick={() => setMode("signup")}>Create an account</button></>
          ) : (
            <>Already have an account? <button onClick={() => setMode("login")}>Log in</button></>
          )}
        </div>
      </div>

      <div className="auth-side">
        <div className="auth-side-quote">
          "The best trips are the ones that feel like they were planned just for you."
          <span>— Every Traventure itinerary, hopefully</span>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   ONBOARDING — travel-style preferences
   ════════════════════════════════════════════════════════════════════════ */
function OnboardingPrefs({ onDone }) {
  const [selected, setSelected] = useState([]);
  const toggle = (id) => setSelected(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);

  return (
    <div className="onb-screen">
      <div className="onb-step">Step 1 of 1</div>
      <h1>What kind of traveler are you?</h1>
      <p className="sub">Pick as many as fit — this shapes the places, food and routes Traventure suggests. You can change this anytime from Account.</p>
      <div className="onb-grid">
        {TRAVELER_PREFS.map(tp => (
          <button key={tp.id} type="button" className={`onb-card ${selected.includes(tp.id) ? "on" : ""}`} onClick={() => toggle(tp.id)}>
            <span className="ic">{tp.icon}</span>
            <span className="nm">{tp.name}</span>
            <span className="ds">{tp.desc}</span>
          </button>
        ))}
      </div>
      <div className="onb-actions">
        <button className="onb-skip" onClick={() => onDone([])}>Skip for now</button>
        <button className="onb-next" onClick={() => onDone(selected)}>Continue</button>
      </div>
    </div>
  );
}

/* ── Weather card (home) ──────────────────────────────────────────────── */
function WeatherCard({ onChat }) {
  const weathers = [
    { emoji: "☀️", temp: "34°C", cond: "Sunny & Clear", advice: "Great for outdoor exploration!" },
    { emoji: "⛅", temp: "28°C", cond: "Partly Cloudy", advice: "Perfect for sightseeing" },
    { emoji: "🌧️", temp: "22°C", cond: "Light Rain", advice: "Try indoor cafés & museums" },
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

/* ── Home ──────────────────────────────────────────────────────────────── */
function HomePage({ user, onChat, onNavigate }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = (user?.name || "Explorer").split(" ")[0];

  return (
    <div className="page">
      <div className="home-hero fade-up">
        <div className="home-greeting">{greeting}, {firstName} 👋</div>
        <div className="home-title">Where to <em>today</em>?</div>
      </div>

      <WeatherCard onChat={onChat} />

      <div className="section-wrap" style={{ animationDelay: "0.05s" }}>
        <div className="sec-hd"><div className="sec-title">Quick actions</div></div>
        <div className="quick-action-grid">
          {[
            { icon: "🗺️", label: "Explore", action: () => onNavigate("explore") },
            { icon: "🧭", label: "Navigate", action: () => onNavigate("map") },
            { icon: "🤖", label: "Ask AI", action: () => onNavigate("chat") },
            { icon: "♻️", label: "Eco routes", action: () => onNavigate("map") },
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
          <div className="sec-title">Nearby places</div>
          <button className="sec-link" onClick={() => onNavigate("explore")}>See all</button>
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
          <div className="sec-title">🍽️ Food highlights</div>
          <button className="sec-link" onClick={() => onNavigate("explore")}>See all</button>
        </div>
        <div className="restaurant-card-row">
          {RESTAURANTS.map(r => (
            <div key={r.name} className="rest-card" onClick={() => onChat(`Tell me about ${r.name}`)}>
              <div className="rest-img" style={{ background: r.bg }}>{r.emoji}</div>
              <div className="rest-body">
                <div className="rest-name">{r.name}</div>
                <div className="rest-meta">
                  <span>{r.rating}</span><span>·</span><span>{r.dist}</span><span>·</span>
                  <span className="badge badge-gold">{r.price}</span>
                </div>
                <div style={{ fontSize: 11, color: "var(--ink2)", marginTop: 4 }}>{r.cuisine}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="ai-cta" onClick={() => onNavigate("chat")}>
        <div className="icon">🤖</div>
        <div>
          <div className="t">Ask your AI guide</div>
          <div className="d">Get personalised suggestions, route tips & more</div>
        </div>
        <div className="go">›</div>
      </div>
    </div>
  );
}

/* ── Explore ───────────────────────────────────────────────────────────── */
function ExplorePage({ onChat }) {
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
        <div className="sec-title">Explore</div>
        <div style={{ fontSize: 13, color: "var(--ink2)" }}>Discover places around you</div>
      </div>
      <div className="explore-search">
        <span style={{ fontSize: 15, color: "var(--ink3)" }}>🔍</span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search places, food, activities..." />
        {search && <span style={{ cursor: "pointer", color: "var(--ink2)" }} onClick={() => setSearch("")}>✕</span>}
      </div>
      <div className="filter-row">
        {filters.map(f => (
          <button key={f} className={`filter-chip ${activeFilter === f ? "active" : ""}`} onClick={() => setActiveFilter(f)}>{f}</button>
        ))}
      </div>
      <div className="explore-grid">
        {filtered.map((item, i) => (
          <div key={item.name} className="ex-card fade-up" style={{ animationDelay: `${i * 0.04}s` }}
            onClick={() => onChat(`Tell me more about ${item.name} and how to get there`)}>
            <div className="ex-card-img">{item.emoji}</div>
            <div className="ex-card-body">
              <div className="ex-card-name">{item.name}</div>
              <div className="ex-card-meta">{item.cat} · {item.dist}</div>
              <div className="ex-card-footer">
                <span className={`badge ${item.badgeCls}`}>{item.badge}</span>
                <span style={{ fontSize: 11, color: "var(--ink2)" }}>{item.rating}</span>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "32px", color: "var(--ink2)" }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🔍</div>
            <div>No results for "{search}"</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Map ───────────────────────────────────────────────────────────────── */
function MapPage({ onChat, destination }) {
  const [selectedRoute, setSelectedRoute] = useState("uncrowded");
  const [dest, setDest] = useState(destination || "");
  const [activePin, setActivePin] = useState(null);
  const route = ROUTE_OPTIONS.find(r => r.id === selectedRoute);

  return (
    <div className="page" style={{ paddingBottom: 0 }}>
      <div className="map-container">
        <div className="map-view">
          <div className="map-grid" />
          <svg viewBox="0 0 430 360" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: .35 }}>
            <line x1="0" y1="180" x2="430" y2="180" stroke="rgba(79,182,168,0.2)" strokeWidth="6"/>
            <line x1="215" y1="0" x2="215" y2="360" stroke="rgba(79,182,168,0.2)" strokeWidth="6"/>
            <line x1="0" y1="90" x2="430" y2="270" stroke="rgba(79,182,168,0.1)" strokeWidth="3"/>
            {selectedRoute === "eco" && <path d="M215 360 Q 150 280 120 200 Q 90 120 145 80" stroke="var(--sage)" strokeWidth="3" fill="none" strokeDasharray="8,4" opacity="0.8"/>}
            {selectedRoute === "fastest" && <path d="M215 360 L 215 180 L 280 90" stroke="var(--gold)" strokeWidth="3" fill="none" opacity="0.8"/>}
            {selectedRoute === "uncrowded" && <path d="M215 360 Q 180 300 160 230 Q 130 150 200 80" stroke="var(--sage)" strokeWidth="3" fill="none" strokeDasharray="5,3" opacity="0.8"/>}
            {selectedRoute === "developed" && <path d="M215 360 L 215 180 Q 220 130 285 90" stroke="var(--indigo)" strokeWidth="3" fill="none" opacity="0.8"/>}
          </svg>
          <div className="user-pin" style={{ left: "50%", top: "70%" }} />
          {MAP_PINS.map(pin => (
            <div key={pin.id} className="map-pin" style={{ left: pin.x, top: pin.y }}
              onClick={() => { setActivePin(pin); onChat(`Tell me about ${pin.label} and how to get there from my location`); }}>
              <div className="pin-dot" style={{ background: pin.bg }}>{pin.emoji}</div>
              {activePin?.id === pin.id && <div className="pin-label">{pin.label}</div>}
            </div>
          ))}
          <div className="map-search-bar">
            <span style={{ fontSize: 14, color: "var(--ink2)" }}>📍</span>
            <input value={dest} onChange={e => setDest(e.target.value)} placeholder="Search destination..."
              onKeyDown={e => e.key === "Enter" && onChat(`Navigate to ${dest} - suggest best route`)} />
            {dest && (
              <button style={{ background: "var(--gold)", border: "none", borderRadius: "var(--r-xs)", color: "#1a1206", padding: "5px 11px", fontSize: 11, fontWeight: 700 }}
                onClick={() => onChat(`Navigate to ${dest} - suggest best route`)}>GO</button>
            )}
          </div>
        </div>

        <div className="route-panel">
          <div className="route-title">Choose your route</div>
          <div className="route-options">
            {ROUTE_OPTIONS.map(r => (
              <button key={r.id} type="button" className={`route-opt ${selectedRoute === r.id ? "selected" : ""}`} onClick={() => setSelectedRoute(r.id)}>
                <div className="r-icon">{r.icon}</div>
                <div className="r-label">{r.label}</div>
                <div className="r-sub">{r.sub}</div>
              </button>
            ))}
          </div>
          <div className="route-info">
            <div className="route-stat"><div className="val">{route.sub}</div><div className="lbl">Duration</div></div>
            <div className="route-divider" />
            <div className="route-stat"><div className="val">{route.km}</div><div className="lbl">Distance</div></div>
            <div className="route-divider" />
            <div className="route-stat">
              <div className="val" style={{ fontSize: 13, color: route.id === "eco" ? "var(--sage)" : "var(--gold)" }}>
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

/* ── Chat ──────────────────────────────────────────────────────────────── */
function ChatPage({ prefs, initialMessage }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState(initialMessage || "");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);
  const taRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);
  useEffect(() => {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 90) + "px";
  }, [input]);
    const sentInitialRef = useRef(false);
  useEffect(() => {
    if (initialMessage && !sentInitialRef.current) {
      sentInitialRef.current = true;
      sendMessage(initialMessage);
    }
  }, []); // eslint-disable-line

  const buildSystemPrompt = () => {
    let base = BASE_SYSTEM_PROMPT;
    if (prefs.length > 0) base += `\n\nUSER PREFERENCES: ${prefs.join(", ")}. Tailor suggestions accordingly.`;
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
      const apiHistory = messages.map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.rawContent || m.content }));
      const res = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history: apiHistory, system: buildSystemPrompt() }),
      });
      const data = await res.json();
      const raw = data.reply || "Sorry, couldn't process that.";
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
          <div className="chat-title">Traventure AI</div>
          <div className="chat-sub">Your intelligent travel companion</div>
        </div>
        <div className="chat-status"><span style={{width:7,height:7,borderRadius:"50%",background:"var(--sage)",display:"inline-block",animation:"pulseDot 2s infinite"}} /> Online</div>
      </div>

      <div className="chat-chips">
        {QUICK_CHIPS.map(c => (
          <button key={c.label} className="chip" onClick={() => sendMessage(c.label)}>{c.icon} {c.label}</button>
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
                        <span className={`badge ${p.status === "Open" ? "badge-sage" : "badge-gold"}`} style={{ marginLeft: "auto" }}>{p.status}</span>
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
          <span style={{ fontSize: 14, color: "var(--ink3)" }}>🔍</span>
          <textarea ref={taRef} className="chat-input" rows={1} placeholder="Ask anything about your trip..."
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }} />
        </div>
        <button className="send-btn" onClick={() => sendMessage(input)} disabled={!input.trim() || loading}>➤</button>
      </div>
    </div>
  );
}

/* ── Account ───────────────────────────────────────────────────────────── */
function AccountPage({ user, prefs, setPrefs, settings, setSettings, onLogout }) {
  const togglePref = (id) => setPrefs(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  const toggleSetting = (key) => setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  const initials = (user?.name || "G").split(" ").map(s => s[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div className="page">
      <div className="profile-header">
        <div className="avatar-circle">{initials}</div>
        <div className="profile-name">{user?.name || "Guest"}</div>
        <div className="profile-email">{user?.email || "Not signed in with an email"}</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginTop: 4 }}>
          {prefs.map(p => {
            const found = TRAVELER_PREFS.find(tp => tp.id === p);
            return found ? <span key={p} className="badge badge-gold">{found.icon} {found.name}</span> : null;
          })}
        </div>
      </div>

      <div className="pref-section">
        <div className="pref-label">✨ Your travel style</div>
        <div className="pref-grid">
          {TRAVELER_PREFS.map(tp => (
            <button key={tp.id} type="button" className={`pref-item ${prefs.includes(tp.id) ? "selected" : ""}`} onClick={() => togglePref(tp.id)}>
              <div className="pref-icon">{tp.icon}</div>
              <div>
                <div className="pref-name">{tp.name}</div>
                <div className="pref-desc">{tp.desc}</div>
              </div>
            </button>
          ))}
        </div>
        <div style={{ fontSize: 11, color: "var(--ink2)", marginTop: 8, textAlign: "center" }}>
          Saved automatically — shapes your AI suggestions & routes
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <div style={{ padding: "4px 20px 8px", fontFamily: "var(--display)", fontSize: 15, fontWeight: 700 }}>⚙️ Settings</div>
        {[
          { key: "eco", label: "Eco-friendly routes", sub: "Prefer sustainable travel options" },
          { key: "smart", label: "Smart suggestions", sub: "AI-powered recommendations" },
          { key: "notifications", label: "Travel alerts", sub: "Weather & crowd updates" },
        ].map(s => (
          <div key={s.key} className="setting-row" onClick={() => toggleSetting(s.key)}>
            <div>
              <div className="setting-label">{s.label}</div>
              <div className="setting-sub">{s.sub}</div>
            </div>
            <button className={`toggle ${settings[s.key] ? "on" : ""}`} />
          </div>
        ))}
      </div>

      <div style={{ margin: "0 20px 24px" }}>
        <div style={{ background: "linear-gradient(135deg, var(--sage-dim), var(--teal-dim))", border: "1px solid var(--sage-dim)", borderRadius: "var(--r)", padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 28 }}>🌿</div>
          <div>
            <div style={{ fontFamily: "var(--display)", fontSize: 14, fontWeight: 700, color: "var(--sage)" }}>Eco impact</div>
            <div style={{ fontSize: 12, color: "var(--ink2)", marginTop: 2 }}>You've chosen eco routes 7 times this month — saving ~3.2 kg CO₂</div>
          </div>
        </div>
      </div>

      <button className="logout-btn" onClick={onLogout}>Log out</button>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   MAIN APP
   ════════════════════════════════════════════════════════════════════════ */
export default function SmartTravelApp() {
  const [user, setUser] = useState(() => readLS(LS.user, null));
  const [onboarded, setOnboarded] = useState(() => readLS(LS.onboarded, false));
  const [prefs, setPrefs] = useState(() => readLS(LS.prefs, []));
  const [settings, setSettings] = useState(() => readLS(LS.settings, { eco: true, notifications: false, smart: true }));

  const [page, setPage] = useState("home");
  const [chatMsg, setChatMsg] = useState(null);
  const [mapDest, setMapDest] = useState(null);

  useEffect(() => { if (user) writeLS(LS.user, user); }, [user]);
  useEffect(() => { writeLS(LS.onboarded, onboarded); }, [onboarded]);
  useEffect(() => { writeLS(LS.prefs, prefs); }, [prefs]);
  useEffect(() => { writeLS(LS.settings, settings); }, [settings]);

  const openChat = useCallback((msg) => { setChatMsg(msg); setPage("chat"); }, []);

  function handleAuthed(u) {
    setUser(u);
    if (!readLS(LS.onboarded, false)) setOnboarded(false);
  }
  function handleOnboardingDone(selected) {
    setPrefs(selected);
    setOnboarded(true);
  }
  function handleLogout() {
    try { localStorage.removeItem(LS.user); } catch {}
    setUser(null);
    setOnboarded(false);
    setPage("home");
  }

  if (!user) {
    return (<><style>{STYLES}</style><div className="tv-shell" style={{ display: "block", maxWidth: "100%" }}><AuthPage onAuthed={handleAuthed} /></div></>);
  }
  if (!onboarded && !user.guest) {
    return (<><style>{STYLES}</style><div className="tv-shell" style={{ display: "block", maxWidth: "100%" }}><OnboardingPrefs onDone={handleOnboardingDone} /></div></>);
  }

  return (
    <>
      <style>{STYLES}</style>
      <div className="tv-shell">
        <nav className="tv-nav">
          <div className="nav-brand">
            <div className="nav-stamp">TV</div>
            <div className="nav-brand-txt">Traventure</div>
          </div>
          {NAV.map(n => (
            <button key={n.id} className={`nav-item ${page === n.id ? "active" : ""}`}
              onClick={() => { setPage(n.id); setChatMsg(null); setMapDest(null); }}>
              <span className="nav-icon">{n.icon}</span>
              <span>{n.label}</span>
            </button>
          ))}
        </nav>

        <div className="tv-main">
          {page === "home" && <HomePage user={user} onChat={openChat} onNavigate={setPage} />}
          {page === "explore" && <ExplorePage onChat={openChat} />}
          {page === "map" && <MapPage onChat={openChat} destination={mapDest} />}
          {page === "chat" && <ChatPage prefs={prefs} initialMessage={chatMsg} key={chatMsg} />}
          {page === "account" && (
            <AccountPage user={user} prefs={prefs} setPrefs={setPrefs} settings={settings} setSettings={setSettings} onLogout={handleLogout} />
          )}

          {page !== "chat" && <button className="ai-fab" onClick={() => openChat(null)} title="Ask AI">🤖</button>}
        </div>
      </div>
    </>
  );
}
