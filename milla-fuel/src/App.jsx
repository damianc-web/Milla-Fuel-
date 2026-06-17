import { useState, useEffect, useRef } from "react";

// ─── Palette ────────────────────────────────────────────────────────────────
const C = {
  bg:       "#080C14",
  surface:  "#0F1520",
  card:     "#141C2B",
  border:   "#1C2840",
  accent:   "#00E5A0",
  accentLo: "rgba(0,229,160,0.12)",
  blue:     "#3D9BFF",
  blueLo:   "rgba(61,155,255,0.12)",
  amber:    "#FFB340",
  amberLo:  "rgba(255,179,64,0.12)",
  red:      "#FF4D6A",
  redLo:    "rgba(255,77,106,0.12)",
  text:     "#EDF2FF",
  muted:    "#6B7FA3",
  dim:      "#374460",
};

const FOODS = [
  { name:"Weet-Bix x2 + milk", cal:250, carbs:44, protein:10, fat:4, fluid:200, cat:"Breakfast" },
  { name:"Oats (1 cup) + milk", cal:310, carbs:52, protein:12, fat:6, fluid:200, cat:"Breakfast" },
  { name:"Toast x2 + peanut butter", cal:320, carbs:40, protein:10, fat:14, fluid:0, cat:"Breakfast" },
  { name:"Scrambled eggs x3 + toast", cal:360, carbs:30, protein:24, fat:16, fluid:0, cat:"Breakfast" },
  { name:"Pancakes x3 + banana", cal:400, carbs:72, protein:10, fat:8, fluid:0, cat:"Breakfast" },
  { name:"Yoghurt + muesli + fruit", cal:380, carbs:58, protein:14, fat:8, fluid:100, cat:"Breakfast" },
  { name:"Banana", cal:90, carbs:23, protein:1, fat:0, fluid:0, cat:"Snack" },
  { name:"Apple", cal:75, carbs:19, protein:0, fat:0, fluid:0, cat:"Snack" },
  { name:"Muesli bar", cal:180, carbs:26, protein:3, fat:7, fluid:0, cat:"Snack" },
  { name:"Yoghurt pouch (100g)", cal:90, carbs:12, protein:5, fat:2, fluid:100, cat:"Snack" },
  { name:"Cheese + crackers", cal:200, carbs:18, protein:8, fat:10, fluid:0, cat:"Snack" },
  { name:"Rice cakes x4", cal:120, carbs:26, protein:2, fat:1, fluid:0, cat:"Snack" },
  { name:"Trail mix (handful)", cal:180, carbs:16, protein:5, fat:11, fluid:0, cat:"Snack" },
  { name:"Vegemite toast x2", cal:180, carbs:32, protein:6, fat:2, fluid:0, cat:"Snack" },
  { name:"Chocolate milk (250ml)", cal:180, carbs:26, protein:8, fat:5, fluid:250, cat:"Recovery" },
  { name:"Sports drink (500ml)", cal:140, carbs:35, protein:0, fat:0, fluid:500, cat:"Hydration" },
  { name:"Water (500ml)", cal:0, carbs:0, protein:0, fat:0, fluid:500, cat:"Hydration" },
  { name:"Chicken + rice + veg", cal:520, carbs:65, protein:38, fat:8, fluid:0, cat:"Meal" },
  { name:"Pasta bolognese", cal:580, carbs:72, protein:32, fat:14, fluid:0, cat:"Meal" },
  { name:"Chicken sandwich (2 slices)", cal:420, carbs:46, protein:28, fat:12, fluid:0, cat:"Meal" },
  { name:"Fried rice + egg + chicken", cal:540, carbs:68, protein:28, fat:12, fluid:0, cat:"Meal" },
  { name:"Salmon + sweet potato", cal:480, carbs:42, protein:36, fat:14, fluid:0, cat:"Meal" },
  { name:"Stir fry chicken + rice", cal:500, carbs:62, protein:34, fat:10, fluid:0, cat:"Meal" },
  { name:"Roast chicken + potato", cal:560, carbs:50, protein:40, fat:16, fluid:0, cat:"Meal" },
  { name:"Chicken wrap", cal:420, carbs:44, protein:28, fat:14, fluid:0, cat:"Meal" },
  { name:"Spaghetti + beef mince", cal:600, carbs:70, protein:34, fat:16, fluid:0, cat:"Meal" },
  { name:"Chicken tenders x4", cal:220, carbs:10, protein:20, fat:10, fluid:0, cat:"Meal" },
  { name:"Glass of milk (250ml)", cal:130, carbs:12, protein:8, fat:5, fluid:250, cat:"Dairy" },
  { name:"Greek yoghurt (150g)", cal:130, carbs:8, protein:15, fat:4, fluid:100, cat:"Dairy" },
  { name:"Cheese slice", cal:80, carbs:0, protein:5, fat:6, fluid:0, cat:"Dairy" },
  { name:"Orange slices", cal:60, carbs:15, protein:1, fat:0, fluid:100, cat:"Snack" },
  { name:"Protein smoothie", cal:380, carbs:48, protein:18, fat:8, fluid:400, cat:"Recovery" },
  { name:"Cereal + milk (bowl)", cal:280, carbs:50, protein:10, fat:4, fluid:200, cat:"Breakfast" },
];

const CATS = ["All","Breakfast","Snack","Meal","Recovery","Dairy","Hydration"];

const TRAINING = [
  { value:"game", label:"Game Day", emoji:"🏆", cal:2800, carbs:370, protein:110, fat:80, fluid:3200 },
  { value:"heavy", label:"Heavy Training", emoji:"⚡", cal:2700, carbs:350, protein:110, fat:78, fluid:3000 },
  { value:"moderate", label:"Moderate Session", emoji:"🏀", cal:2500, carbs:320, protein:100, fat:75, fluid:2700 },
  { value:"light", label:"Light / Skill", emoji:"🎯", cal:2300, carbs:280, protein:95, fat:70, fluid:2400 },
  { value:"rest", label:"Rest Day", emoji:"💤", cal:2000, carbs:240, protein:90, fat:65, fluid:2200 },
];

const TIMING = [
  { value:"breakfast", label:"Breakfast" },
  { value:"pre3h", label:"Pre-training (3hr)" },
  { value:"pre1h", label:"Pre-training (1hr)" },
  { value:"during", label:"During training" },
  { value:"post", label:"Post-training" },
  { value:"lunch", label:"Lunch" },
  { value:"dinner", label:"Dinner" },
  { value:"snack", label:"Snack" },
  { value:"bedtime", label:"Bedtime" },
];

function pct(val, max) { return Math.min(100, Math.round((val / max) * 100)); }

function fuelStatus(p) {
  if (p < 40) return { label:"Very under-fuelled", color: C.red };
  if (p < 70) return { label:"Under-fuelled", color: C.amber };
  if (p < 90) return { label:"Getting there", color: C.amber };
  if (p <= 108) return { label:"On track ✓", color: C.accent };
  return { label:"Over target", color: C.amber };
}

function GaugeArc({ pct: p, size = 140 }) {
  const r = 48, cx = 70, cy = 76;
  const clamp = Math.min(p, 110);
  const arc = (deg) => {
    const rad = ((deg - 90) * Math.PI) / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  };
  const [x1, y1] = arc(-140);
  const [x2, y2] = arc(-140 + (clamp / 110) * 280);
  const large = (clamp / 110) * 280 > 180 ? 1 : 0;
  const col = p < 70 ? C.red : p < 90 ? C.amber : C.accent;
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 140 105" style={{ overflow:"visible" }}>
      <path d={`M ${arc(-140)[0]} ${arc(-140)[1]} A ${r} ${r} 0 1 1 ${arc(140)[0]} ${arc(140)[1]}`}
        fill="none" stroke={C.border} strokeWidth={10} strokeLinecap="round" />
      {p > 0 && (
        <path d={`M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`}
          fill="none" stroke={col} strokeWidth={10} strokeLinecap="round"
          style={{ filter:`drop-shadow(0 0 8px ${col})` }} />
      )}
      <text x={70} y={72} textAnchor="middle" fill={col} fontSize={22} fontWeight="800" fontFamily="system-ui">{p}%</text>
      <text x={70} y={88} textAnchor="middle" fill={C.muted} fontSize={9} fontFamily="system-ui">daily fuel</text>
    </svg>
  );
}

function Bar({ label, cur, max, color }) {
  const p = pct(cur, max);
  const over = cur > max;
  return (
    <div style={{ marginBottom:8 }}>
      <div style={{ display:"flex", justifyContent:"space-between", marginBottom:3 }}>
        <span style={{ fontSize:11, color:C.muted }}>{label}</span>
        <span style={{ fontSize:11, color: over ? C.amber : C.text, fontWeight:600 }}>{cur}g <span style={{ color:C.dim }}>/ {max}g</span></span>
      </div>
      <div style={{ background:C.border, borderRadius:4, height:5 }}>
        <div style={{ width:`${p}%`, height:"100%", background:color, borderRadius:4,
          boxShadow:`0 0 6px ${color}70`, transition:"width 0.4s ease" }} />
      </div>
    </div>
  );
}

// localStorage helpers
const TODAY = new Date().toISOString().slice(0, 10);

function loadState(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch { return fallback; }
}

function saveState(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

export default function MillaFuel() {
  const [tab, setTab] = useState("log");

  const [meals, setMeals] = useState(() => {
    const saved = loadState("milla_log", null);
    if (saved && saved.date === TODAY) return saved.meals;
    return [];
  });

  const [training, setTraining] = useState(() => loadState("milla_training", "moderate"));
  const [trainTime, setTrainTime] = useState(() => loadState("milla_trainTime", "16:00"));
  const [catFilter, setCatFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [customOpen, setCustomOpen] = useState(false);
  const [custom, setCustom] = useState({ name:"", cal:"", carbs:"", protein:"", fat:"", fluid:"", timing:"snack" });
  const [selectedTiming, setSelectedTiming] = useState("snack");

  useEffect(() => { saveState("milla_log", { date: TODAY, meals }); }, [meals]);
  useEffect(() => { saveState("milla_training", training); }, [training]);
  useEffect(() => { saveState("milla_trainTime", trainTime); }, [trainTime]);

  const tgt = TRAINING.find(t => t.value === training);
  const totals = meals.reduce((a, m) => ({
    cal: a.cal + m.cal, carbs: a.carbs + m.carbs,
    protein: a.protein + m.protein, fat: a.fat + m.fat, fluid: a.fluid + m.fluid
  }), { cal:0, carbs:0, protein:0, fat:0, fluid:0 });

  const fuelPct = pct(totals.cal, tgt.cal);
  const status = fuelStatus(fuelPct);
  const filtered = FOODS.filter(f =>
    (catFilter === "All" || f.cat === catFilter) &&
    f.name.toLowerCase().includes(search.toLowerCase())
  );

  function addFood(food) {
    setMeals(prev => [...prev, { ...food, id: Date.now(), timing: selectedTiming }]);
  }

  function removeFood(id) {
    setMeals(prev => prev.filter(m => m.id !== id));
  }

  function addCustom() {
    if (!custom.name || !custom.cal) return;
    addFood({ name: custom.name, cal: +custom.cal || 0, carbs: +custom.carbs || 0,
      protein: +custom.protein || 0, fat: +custom.fat || 0, fluid: +custom.fluid || 0,
      cat: "Custom", timing: custom.timing });
    setCustom({ name:"", cal:"", carbs:"", protein:"", fat:"", fluid:"", timing:"snack" });
    setCustomOpen(false);
  }

  const today = new Date().toLocaleDateString("en-AU", { weekday:"long", day:"numeric", month:"long" });

  const S = {
    app: { background:C.bg, minHeight:"100vh", fontFamily:"system-ui,-apple-system,sans-serif",
      color:C.text, maxWidth:430, margin:"0 auto", paddingBottom:90, userSelect:"none" },
    header: { background:C.surface, borderBottom:`1px solid ${C.border}`, padding:"14px 16px 12px" },
    logoRow: { display:"flex", alignItems:"center", justifyContent:"space-between" },
    logo: { fontSize:20, fontWeight:900, letterSpacing:"-0.5px" },
    dot: { color:C.accent },
    pill: { background:C.accentLo, border:`1px solid ${C.accent}40`, color:C.accent,
      fontSize:10, fontWeight:700, padding:"3px 9px", borderRadius:20, letterSpacing:"0.5px" },
    dateLine: { fontSize:11, color:C.muted, marginTop:3 },
    nav: { position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
      width:"100%", maxWidth:430, background:C.surface,
      borderTop:`1px solid ${C.border}`, display:"flex", zIndex:20 },
    navBtn: (a) => ({ flex:1, padding:"10px 0 8px", background:"none", border:"none",
      color: a ? C.accent : C.muted, fontSize:10, fontWeight: a ? 700 : 500,
      cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", gap:3,
      borderTop: a ? `2px solid ${C.accent}` : "2px solid transparent" }),
    navIcon: { fontSize:18 },
    card: { background:C.card, border:`1px solid ${C.border}`, borderRadius:14, padding:14, marginBottom:10 },
    label: { fontSize:10, fontWeight:700, color:C.muted, letterSpacing:"0.8px", textTransform:"uppercase", marginBottom:8 },
    gaugeRow: { display:"flex", alignItems:"center", gap:12 },
    macroCol: { flex:1 },
    statsRow: { display:"flex", gap:6, marginTop:10 },
    stat: { flex:1, background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:"8px 6px", textAlign:"center" },
    statVal: { fontSize:16, fontWeight:800 },
    statLbl: { fontSize:9, color:C.muted, marginTop:1 },
    banner: (col) => ({ background:`${col}15`, border:`1px solid ${col}40`,
      borderRadius:10, padding:"8px 12px", marginTop:10, display:"flex", alignItems:"center", gap:8 }),
    bannerText: { fontSize:12, fontWeight:700 },
    searchInput: { flex:1, background:C.surface, border:`1px solid ${C.border}`,
      borderRadius:10, padding:"9px 12px", color:C.text, fontSize:13, outline:"none", fontFamily:"inherit" },
    catRow: { display:"flex", gap:6, overflowX:"auto", paddingBottom:8, marginBottom:10, scrollbarWidth:"none" },
    catBtn: (a) => ({ flexShrink:0, background: a ? C.accentLo : C.surface,
      border:`1px solid ${a ? C.accent : C.border}`, color: a ? C.accent : C.muted,
      borderRadius:20, padding:"5px 12px", fontSize:11, fontWeight: a ? 700 : 500,
      cursor:"pointer", whiteSpace:"nowrap" }),
    foodItem: { display:"flex", alignItems:"center", justifyContent:"space-between", padding:"9px 0", borderBottom:`1px solid ${C.border}` },
    foodName: { fontSize:13, color:C.text, fontWeight:500 },
    foodMacro: { fontSize:10, color:C.muted, marginTop:2 },
    addBtn: { background:C.accent, border:"none", color:"#000", width:28, height:28,
      borderRadius:"50%", fontSize:18, fontWeight:700, cursor:"pointer", flexShrink:0,
      display:"flex", alignItems:"center", justifyContent:"center", lineHeight:1 },
    timingRow: { display:"flex", gap:6, overflowX:"auto", paddingBottom:4, scrollbarWidth:"none", marginBottom:10 },
    timingBtn: (a) => ({ flexShrink:0, background: a ? C.blueLo : C.surface,
      border:`1px solid ${a ? C.blue : C.border}`, color: a ? C.blue : C.muted,
      borderRadius:20, padding:"5px 12px", fontSize:11, fontWeight: a ? 700 : 500,
      cursor:"pointer", whiteSpace:"nowrap" }),
    logItem: { display:"flex", alignItems:"flex-start", gap:10, padding:"9px 0", borderBottom:`1px solid ${C.border}` },
    logName: { fontSize:13, color:C.text, flex:1 },
    logMeta: { fontSize:10, color:C.muted, marginTop:2 },
    removeBtn: { background:"none", border:"none", color:C.dim, fontSize:18, cursor:"pointer", padding:"0 2px", lineHeight:1, flexShrink:0 },
    inputField: { width:"100%", background:C.surface, border:`1px solid ${C.border}`,
      borderRadius:10, padding:"10px 12px", color:C.text, fontSize:13, outline:"none",
      fontFamily:"inherit", boxSizing:"border-box", marginBottom:8 },
    row2: { display:"flex", gap:8 },
    halfInput: { flex:1, background:C.surface, border:`1px solid ${C.border}`,
      borderRadius:10, padding:"10px 12px", color:C.text, fontSize:13, outline:"none",
      fontFamily:"inherit", boxSizing:"border-box", marginBottom:8 },
    primaryBtn: { width:"100%", background:C.accent, border:"none", borderRadius:10,
      color:"#000", fontWeight:800, fontSize:14, padding:"13px", cursor:"pointer",
      fontFamily:"inherit", boxShadow:`0 0 24px ${C.accentLo}`, marginTop:4 },
    ghostBtn: { width:"100%", background:"transparent", border:`1px solid ${C.border}`,
      borderRadius:10, color:C.muted, fontWeight:600, fontSize:13, padding:"11px",
      cursor:"pointer", fontFamily:"inherit", marginTop:6 },
    trainOpt: (a) => ({ background: a ? C.accentLo : C.surface,
      border:`1px solid ${a ? C.accent : C.border}`, borderRadius:12,
      padding:"11px 14px", marginBottom:8, cursor:"pointer", display:"flex", alignItems:"center", gap:12 }),
    trainLabel: (a) => ({ fontSize:14, fontWeight: a ? 700 : 500, color: a ? C.accent : C.text }),
    trainSub: { fontSize:11, color:C.muted, marginTop:2 },
    refItem: { display:"flex", gap:10, marginBottom:10, alignItems:"flex-start" },
  };

  return (
    <div style={S.app}>
      <div style={S.header}>
        <div style={S.logoRow}>
          <div style={S.logo}>Milla<span style={S.dot}>.</span></div>
          <div style={S.pill}>🏀 FUEL TRACKER</div>
        </div>
        <div style={S.dateLine}>{today} · {tgt.emoji} {tgt.label}</div>
      </div>

      {tab === "log" && (
        <div style={{ padding:"12px 14px 0" }}>
          <div style={S.card}>
            <div style={S.gaugeRow}>
              <GaugeArc pct={fuelPct} size={130} />
              <div style={S.macroCol}>
                <Bar label="Carbs" cur={totals.carbs} max={tgt.carbs} color={C.blue} />
                <Bar label="Protein" cur={totals.protein} max={tgt.protein} color={C.accent} />
                <Bar label="Fat" cur={totals.fat} max={tgt.fat} color={C.amber} />
              </div>
            </div>
            <div style={S.statsRow}>
              <div style={S.stat}><div style={{ ...S.statVal, color:C.accent }}>{totals.cal}</div><div style={S.statLbl}>eaten</div></div>
              <div style={S.stat}><div style={S.statVal}>{tgt.cal}</div><div style={S.statLbl}>target</div></div>
              <div style={S.stat}>
                <div style={{ ...S.statVal, color: totals.fluid >= tgt.fluid*0.8 ? C.accent : C.amber }}>{totals.fluid}</div>
                <div style={S.statLbl}>ml fluid</div>
              </div>
              <div style={S.stat}><div style={S.statVal}>{tgt.fluid}</div><div style={S.statLbl}>ml target</div></div>
            </div>
            <div style={S.banner(status.color)}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:status.color, flexShrink:0 }} />
              <div style={{ ...S.bannerText, color:status.color }}>{status.label}</div>
              <div style={{ fontSize:11, color:C.muted, marginLeft:"auto" }}>{tgt.cal - totals.cal > 0 ? `${tgt.cal - totals.cal} kcal to go` : "Target hit"}</div>
            </div>
          </div>

          <div style={S.card}>
            <div style={S.label}>Meal timing</div>
            <div style={S.timingRow}>
              {TIMING.map(t => (
                <button key={t.value} style={S.timingBtn(selectedTiming === t.value)}
                  onClick={() => setSelectedTiming(t.value)}>{t.label}</button>
              ))}
            </div>
            <input style={S.searchInput} placeholder="Search foods..."
              value={search} onChange={e => setSearch(e.target.value)} />
            <div style={S.catRow}>
              {CATS.map(c => (
                <button key={c} style={S.catBtn(catFilter === c)}
                  onClick={() => setCatFilter(c)}>{c}</button>
              ))}
            </div>
            <div style={{ maxHeight:260, overflowY:"auto", scrollbarWidth:"none" }}>
              {filtered.map((f, i) => (
                <div key={i} style={S.foodItem}>
                  <div>
                    <div style={S.foodName}>{f.name}</div>
                    <div style={S.foodMacro}>{f.cal}kcal · {f.carbs}g C · {f.protein}g P · {f.fat}g F{f.fluid > 0 ? ` · ${f.fluid}ml` : ""}</div>
                  </div>
                  <button style={S.addBtn} onClick={() => addFood(f)}>+</button>
                </div>
              ))}
              {filtered.length === 0 && (
                <div style={{ padding:"16px 0", textAlign:"center", color:C.muted, fontSize:13 }}>No foods match — add it manually below</div>
              )}
            </div>
            <button style={S.ghostBtn} onClick={() => setCustomOpen(o => !o)}>
              {customOpen ? "Cancel" : "+ Add custom food"}
            </button>
            {customOpen && (
              <div style={{ marginTop:10 }}>
                <input style={S.inputField} placeholder="Food name" value={custom.name}
                  onChange={e => setCustom(p => ({ ...p, name:e.target.value }))} />
                <div style={S.row2}>
                  <input style={S.halfInput} placeholder="kcal" type="number" value={custom.cal}
                    onChange={e => setCustom(p => ({ ...p, cal:e.target.value }))} />
                  <input style={S.halfInput} placeholder="Carbs g" type="number" value={custom.carbs}
                    onChange={e => setCustom(p => ({ ...p, carbs:e.target.value }))} />
                </div>
                <div style={S.row2}>
                  <input style={S.halfInput} placeholder="Protein g" type="number" value={custom.protein}
                    onChange={e => setCustom(p => ({ ...p, protein:e.target.value }))} />
                  <input style={S.halfInput} placeholder="Fat g" type="number" value={custom.fat}
                    onChange={e => setCustom(p => ({ ...p, fat:e.target.value }))} />
                </div>
                <input style={S.inputField} placeholder="Fluid ml (optional)" type="number" value={custom.fluid}
                  onChange={e => setCustom(p => ({ ...p, fluid:e.target.value }))} />
                <button style={S.primaryBtn} onClick={addCustom}>Add to log</button>
              </div>
            )}
          </div>

          {meals.length > 0 && (
            <div style={S.card}>
              <div style={S.label}>Today's log ({meals.length} items)</div>
              {meals.map(m => (
                <div key={m.id} style={S.logItem}>
                  <div style={{ flex:1 }}>
                    <div style={S.logName}>{m.name}</div>
                    <div style={S.logMeta}>{TIMING.find(t => t.value === m.timing)?.label || m.timing} · {m.cal}kcal · {m.carbs}g C · {m.protein}g P · {m.fat}g F</div>
                  </div>
                  <button style={S.removeBtn} onClick={() => removeFood(m.id)}>×</button>
                </div>
              ))}
              <button style={{ ...S.ghostBtn, marginTop:10, color:C.red, borderColor:`${C.red}40` }}
                onClick={() => { if(window.confirm("Clear today's log?")) setMeals([]); }}>Clear all</button>
            </div>
          )}
          {meals.length === 0 && (
            <div style={{ textAlign:"center", padding:"24px 0", color:C.muted, fontSize:13 }}>
              Tap <strong style={{ color:C.accent }}>+</strong> next to any food to log it
            </div>
          )}
        </div>
      )}

      {tab === "training" && (
        <div style={{ padding:"12px 14px 0" }}>
          <div style={S.card}>
            <div style={S.label}>Today's session type</div>
            {TRAINING.map(t => (
              <div key={t.value} style={S.trainOpt(training === t.value)} onClick={() => setTraining(t.value)}>
                <span style={{ fontSize:22 }}>{t.emoji}</span>
                <div>
                  <div style={S.trainLabel(training === t.value)}>{t.label}</div>
                  <div style={S.trainSub}>{t.cal.toLocaleString()} kcal · {t.carbs}g carbs · {t.protein}g protein</div>
                </div>
              </div>
            ))}
          </div>
          <div style={S.card}>
            <div style={S.label}>Session time</div>
            <input type="time" value={trainTime} onChange={e => setTrainTime(e.target.value)}
              style={{ ...S.inputField, marginBottom:0 }} />
          </div>
          <div style={S.card}>
            <div style={S.label}>Timing guide</div>
            {[
              { t:"3 hrs before", tip:"Main meal — carbs + protein + low fat. Rice, chicken, veg." },
              { t:"60–90 min before", tip:"Light snack — banana, rice cakes. Keep it small." },
              { t:"During (if >60 min)", tip:"30–60g carbs/hr — sports drink, fruit, orange slices." },
              { t:"Within 30 min after", tip:"Chocolate milk + banana — 3:1 carb to protein." },
              { t:"60–90 min after", tip:"Full meal — rice or pasta + protein + veg." },
              { t:"Bedtime", tip:"Milk + something — protein before sleep = overnight repair." },
            ].map((item, i) => (
              <div key={i} style={{ display:"flex", gap:10, marginBottom:10 }}>
                <div style={{ width:6, height:6, borderRadius:"50%", background:C.accent, marginTop:6, flexShrink:0 }} />
                <div>
                  <div style={{ fontSize:12, fontWeight:700 }}>{item.t}</div>
                  <div style={{ fontSize:11, color:C.muted, marginTop:2, lineHeight:1.4 }}>{item.tip}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "dashboard" && (
        <div style={{ padding:"12px 14px 0" }}>
          <div style={S.card}>
            <div style={S.label}>Today at a glance</div>
            <div style={{ display:"flex", justifyContent:"center", marginBottom:8 }}>
              <GaugeArc pct={fuelPct} size={160} />
            </div>
            <Bar label="Calories" cur={totals.cal} max={tgt.cal} color={C.accent} />
            <Bar label="Carbs" cur={totals.carbs} max={tgt.carbs} color={C.blue} />
            <Bar label="Protein" cur={totals.protein} max={tgt.protein} color={C.accent} />
            <Bar label="Fat" cur={totals.fat} max={tgt.fat} color={C.amber} />
            <div style={{ marginTop:6 }}><Bar label="Fluid" cur={totals.fluid} max={tgt.fluid} color={C.blue} /></div>
          </div>
          <div style={S.card}>
            <div style={S.label}>Non-negotiables</div>
            {[
              { e:"🦴", t:"3–4 dairy serves daily", d:"1,300mg calcium. Bone density is built now." },
              { e:"🩸", t:"Iron source every day", d:"Red meat 2–3×/wk, or eggs + fortified cereal." },
              { e:"⚡", t:"Never train on empty", d:"Even 20 min before — banana at minimum." },
              { e:"💧", t:"Pale yellow urine", d:"Dark = dehydrated. Drink before you're thirsty." },
              { e:"😴", t:"Bedtime snack every night", d:"Milk + something. Growth happens in sleep." },
            ].map((item, i) => (
              <div key={i} style={S.refItem}>
                <span style={{ fontSize:18 }}>{item.e}</span>
                <div>
                  <div style={{ fontSize:12, fontWeight:700 }}>{item.t}</div>
                  <div style={{ fontSize:11, color:C.muted, lineHeight:1.4 }}>{item.d}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={S.card}>
            <div style={S.label}>Weekly targets</div>
            {[
              ["Monday", "5km run", "2,400"],
              ["Tuesday", "1.5hr basketball", "2,700"],
              ["Wednesday", "Gym + shooting", "2,500"],
              ["Thursday", "3 sessions ⚠️", "2,900"],
              ["Friday", "Gym + game", "2,800"],
              ["Saturday", "Shooting + gym", "2,400"],
              ["Sunday", "2.5hr hard ball", "3,000"],
            ].map(([day, session, cal]) => (
              <div key={day} style={{ display:"flex", justifyContent:"space-between",
                alignItems:"center", padding:"7px 0", borderBottom:`1px solid ${C.border}` }}>
                <div>
                  <div style={{ fontSize:12, fontWeight:700 }}>{day}</div>
                  <div style={{ fontSize:10, color:C.muted }}>{session}</div>
                </div>
                <div style={{ fontSize:13, fontWeight:800, color:C.accent }}>{cal} kcal</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <nav style={S.nav}>
        {[
          { id:"log", icon:"📋", label:"Log" },
          { id:"training", icon:"⚡", label:"Training" },
          { id:"dashboard", icon:"📊", label:"Dashboard" },
        ].map(n => (
          <button key={n.id} style={S.navBtn(tab === n.id)} onClick={() => setTab(n.id)}>
            <span style={S.navIcon}>{n.icon}</span>
            {n.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
