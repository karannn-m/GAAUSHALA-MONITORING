import { useState, useEffect, useRef } from "react";

/**
 * AI-Driven Gaushala Governance & Grant Transparency Portal (SGMS)
 * Full React/JSX port of the static HTML prototype.
 * Single-file, no external UI libs — plain CSS via a <style> tag + inline styles.
 * Drop into any Vite/CRA/Next React project. Default export = <GaushalaPortal />.
 */

const COLORS = {
  navy: "#17294d",
  navy2: "#22396a",
  saf: "#e0711a",
  grn: "#1d6b3b",
  red: "#b3261e",
  amb: "#b7791f",
};

// ---------- Sample data ----------
const INITIAL_G = [
  { id: "RPR-01", n: "श्री कृष्ण गौशाला, आरंग", d: "रायपुर", reg: 210, ver: 204, x: 210, y: 150, s: "ok", feed: "ok" },
  { id: "RPR-02", n: "कामधेनु गौशाला, तिल्दा", d: "रायपुर", reg: 180, ver: 121, x: 230, y: 170, s: "bad", feed: "bad" },
  { id: "RPR-03", n: "नंदी सेवा सदन, अभनपुर", d: "रायपुर", reg: 96, ver: 94, x: 190, y: 185, s: "ok", feed: "ok" },
  { id: "DRG-01", n: "गोपाल गौशाला, दुर्ग", d: "दुर्ग", reg: 240, ver: 233, x: 130, y: 190, s: "ok", feed: "ok" },
  { id: "BLP-01", n: "सुरभि गौशाला, बिलासपुर", d: "बिलासपुर", reg: 150, ver: 118, x: 230, y: 80, s: "warn", feed: "ok" },
  { id: "BST-01", n: "गौ-धाम, जगदलपुर", d: "बस्तर", reg: 120, ver: 117, x: 200, y: 300, s: "ok", feed: "warn" },
];

const INITIAL_ALERTS = [
  { c: "", t: "चारा नहीं मिला – कामधेनु गौशाला, तिल्दा", s: "9:00 तक नांद खाली · 09:12 AM" },
  { c: "", t: "गिरी हुई गाय (Tag …4471) – बिलासपुर", s: "5 घंटे से स्थिर · 11:40 AM" },
  { c: "w", t: "गाय वापस नहीं लौटी – Missing Cow Alert (…2290)", s: "शाम 6 बजे के बाद · 06:05 PM" },
  { c: "w", t: "रात्रि घुसपैठ – आरंग गौशाला उत्तरी गेट", s: "अज्ञात व्यक्ति · 02:14 AM" },
  { c: "i", t: "औचक निरीक्षण अनुशंसित – तिल्दा", s: "गणना अंतर 33% · AI Audit" },
];

const NEW_ALERTS = [
  ["", "अनधिकृत वाहन – ANPR मिलान विफल", "गोपाल गौशाला, दुर्ग"],
  ["w", "चारा स्टॉक 30% से नीचे – बस्तर", "AI Ration Engine"],
  ["i", "नई गणना सत्यापित – 233/240", "दुर्ग · Auto Headcount"],
  ["", "बीमार गाय पहचानी गई – Tag …5512", "आरंग · Shed-C"],
];

const ROLES = {
  admin: {
    name: "राज्य नियंत्रक (Super Admin)",
    u: "सचिव, गो-सेवा आयोग",
    ic: "👑",
    nav: [
      ["dash", "🗺️", "राज्य डैशबोर्ड"],
      ["grants", "💰", "अनुदान स्वीकृति"],
      ["audit", "🔍", "AI ऑडिट रिपोर्ट"],
      ["sub", "👥", "उप-प्रशासक प्रबंधन"],
      ["policy", "📜", "नीति एवं मानक"],
      ["pub", "🙏", "जन-दृश्य / गौ-दान"],
    ],
  },
  sub: {
    name: "उप-प्रशासक (Zone/District)",
    u: "जिला नोडल अधिकारी, रायपुर ज़ोन",
    ic: "🧑‍💼",
    nav: [
      ["zone", "📡", "ज़ोन लाइव मॉनिटर"],
      ["alerts", "🚨", "अलर्ट एवं निरीक्षण"],
      ["verify", "✅", "रिपोर्ट सत्यापन"],
      ["zrep", "📊", "ज़ोन रिपोर्ट"],
    ],
  },
  mgr: {
    name: "गौशाला प्रबंधक",
    u: "श्री कृष्ण गौशाला, आरंग",
    ic: "🐄",
    nav: [
      ["mdash", "🏠", "मेरी गौशाला"],
      ["cctv", "📹", "CCTV · AI डिटेक्शन"],
      ["gate", "🏷️", "RFID गेट एवं ट्रैकिंग"],
      ["feed", "🌾", "चारा एवं स्टॉक"],
      ["health", "🩺", "स्वास्थ्य एवं पशु चिकित्सा"],
      ["perim", "🛡️", "सुरक्षा / घुसपैठ"],
    ],
  },
};

const pct = (a, b) => Math.round((a / b) * 100);

// ---------- Small reusable pieces ----------
function Kpi({ n, l, d, tone = "" }) {
  const borderColor =
    tone === "g" ? COLORS.grn : tone === "r" ? COLORS.red : tone === "s" ? COLORS.saf : COLORS.navy2;
  const [display, setDisplay] = useState(n);
  const ref = useRef(null);

  useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const m = String(n).match(/^(₹ )?([\d,.]+)(.*)$/);
    if (reduce || !m) {
      setDisplay(n);
      return;
    }
    const prefix = m[1] || "";
    const suffix = m[3] || "";
    const numStr = m[2];
    const big = numStr.includes(",");
    const dec = (numStr.split(".")[1] || "").length;
    const to = parseFloat(numStr.replace(/,/g, ""));
    const t0 = performance.now();
    let raf;
    function frame(t) {
      const p = Math.min(1, (t - t0) / 900);
      const v = to * (1 - Math.pow(1 - p, 3));
      const formatted = big ? Math.round(v).toLocaleString("en-IN") : v.toFixed(dec);
      setDisplay(prefix + formatted + suffix);
      if (p < 1) raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [n]);

  return (
    <div className="card kpi" style={{ borderTopColor: borderColor }} ref={ref}>
      <div className="n">{display}</div>
      <div className="l">{l}</div>
      {d ? <div className="d">{d}</div> : null}
    </div>
  );
}

function Badge({ s }) {
  const map = { ok: ["सत्यापित", "ok"], bad: ["गंभीर", "bad"], warn: ["चेतावनी", "warn"] };
  const [label, cls] = map[s] || ["—", ""];
  return <span className={`b ${cls}`}>{label}</span>;
}

function AlertList({ alerts }) {
  return (
    <>
      {alerts.map((a, i) => (
        <div className={`al ${a.c}`} key={i}>
          <b>{a.t}</b>
          <small>{a.s}</small>
        </div>
      ))}
    </>
  );
}

function Cam({ title, boxes, caption, ir }) {
  return (
    <div className={`cam ${ir ? "ir" : ""}`}>
      <span className="t">{title}</span>
      <span className="rec">REC</span>
      {boxes.map((b, i) => (
        <div
          key={i}
          className={`bx ${b.tone || ""}`}
          style={{ left: `${b.x}%`, top: `${b.y}%`, width: `${b.w}%`, height: `${b.h}%` }}
        >
          <span>{b.label}</span>
        </div>
      ))}
      <div className="cap">{caption}</div>
    </div>
  );
}

function Line({ vals, color }) {
  const w = 300,
    h = 110;
  const mx = Math.max(...vals),
    mn = Math.min(...vals);
  const pts = vals.map((v, i) => [
    (i * w) / (vals.length - 1),
    h - 10 - ((v - mn) / (mx - mn || 1)) * (h - 28),
  ]);
  const d = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(0)} ${p[1].toFixed(0)}`).join(" ");
  return (
    <svg viewBox={`0 0 300 ${h}`} width="100%">
      <path d={`${d} L300 ${h} L0 ${h}Z`} fill={color} opacity=".15" />
      <path d={d} fill="none" stroke={color} strokeWidth="2.5" />
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="3.5" fill={color} />
      ))}
    </svg>
  );
}

function Donut({ parts }) {
  const C = 2 * Math.PI * 40;
  let acc = 0;
  return (
    <svg viewBox="0 0 120 120" width="130">
      {parts.map(([val, col], i) => {
        const len = (C * val) / 100;
        const el = (
          <circle
            key={i}
            cx="60"
            cy="60"
            r="40"
            fill="none"
            stroke={col}
            strokeWidth="18"
            strokeDasharray={`${len} ${C - len}`}
            strokeDashoffset={-acc}
            transform="rotate(-90 60 60)"
          />
        );
        acc += len;
        return el;
      })}
      <text x="60" y="65" textAnchor="middle" fontSize="16" fontWeight="700" fill="currentColor">
        {parts[0][0]}%
      </text>
    </svg>
  );
}

function GTable({ list, renderActions }) {
  return (
    <div className="tw">
      <table>
        <thead>
          <tr>
            <th>कोड</th>
            <th>गौशाला</th>
            <th>पंजीकृत</th>
            <th>AI सत्यापित</th>
            <th>अंतर</th>
            <th>स्थिति</th>
            {renderActions ? <th>कार्य</th> : null}
          </tr>
        </thead>
        <tbody>
          {list.map((g) => (
            <tr key={g.id}>
              <td>{g.id}</td>
              <td>{g.n}</td>
              <td>{g.reg}</td>
              <td>{g.ver}</td>
              <td className={g.reg - g.ver > 20 ? "bad" : "ok"}>{pct(g.reg - g.ver, g.reg)}%</td>
              <td>
                <Badge s={g.s} />
              </td>
              {renderActions ? <td>{renderActions(g)}</td> : null}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GaushalaMap({ g, onSelect }) {
  const colorFor = { ok: COLORS.grn, bad: COLORS.red, warn: COLORS.saf };
  return (
    <>
      <svg className="map" viewBox="0 0 420 380" width="100%" role="img" aria-label="राज्य मानचित्र">
        <path
          d="M120 40 L290 30 L350 120 L300 210 L330 280 L250 350 L170 340 L110 260 L80 170 Z"
          fill="#dbe7d8"
          stroke={COLORS.grn}
          strokeWidth="2"
        />
        {g.map((item, i) => (
          <g key={item.id} className="dot" onClick={() => onSelect(i)}>
            <circle cx={item.x} cy={item.y} r="11" fill={colorFor[item.s]} opacity=".9" />
            <text x={item.x} y={item.y + 4} fontSize="10" fill="#fff" textAnchor="middle">
              {i + 1}
            </text>
          </g>
        ))}
      </svg>
      <div style={{ fontSize: 12, color: "var(--mut)" }}>
        🟢 सामान्य &nbsp; 🟠 चेतावनी &nbsp; 🔴 गंभीर — बिंदु पर क्लिक करें
      </div>
    </>
  );
}

function StockRows({ stock }) {
  const meta = { hara: ["हरा चारा", 8000], sukha: ["सूखा चारा", 3000], dana: ["दाना", 600] };
  return (
    <>
      {Object.keys(meta).map((k) => {
        const [label, cap] = meta[k];
        const val = stock[k];
        const low = val / cap < 0.3;
        return (
          <div className="row" key={k}>
            <span>{label}</span>
            <span style={{ flex: 1, margin: "0 10px" }}>
              <div className="bar">
                <i style={{ width: `${pct(val, cap)}%`, background: low ? "var(--red)" : "var(--grn)" }} />
              </div>
            </span>
            <b>{Math.round(val)} kg</b>
          </div>
        );
      })}
    </>
  );
}

// ---------- Main component ----------
export default function GaushalaPortal() {
  const [role, setRole] = useState("admin");
  const [view, setView] = useState("dash");
  const [theme, setTheme] = useState(null); // null = system, "light" | "dark"
  const [grants, setGrants] = useState(() => [
    { g: INITIAL_G[0], amt: "₹ 6.12 L", st: "लंबित" },
    { g: INITIAL_G[1], amt: "₹ 5.40 L", st: "लंबित" },
    { g: INITIAL_G[4], amt: "₹ 4.50 L", st: "लंबित" },
    { g: INITIAL_G[3], amt: "₹ 7.00 L", st: "स्वीकृत" },
  ]);
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);
  const [badgeCount, setBadgeCount] = useState(3);
  const [ddOpen, setDdOpen] = useState(false);
  const [stock, setStock] = useState({ hara: 4200, sukha: 1500, dana: 380 });
  const [fcCount, setFcCount] = useState(204);
  const [selected, setSelected] = useState(null);
  const [irMode, setIrMode] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [now, setNow] = useState(new Date());
  const toastTimer = useRef(null);
  const tickIndex = useRef(0);

  function toast(msg) {
    setToastMsg(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(""), 2600);
  }

  // live clock
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // simulated live alert ticker
  useEffect(() => {
    const t = setInterval(() => {
      const a = NEW_ALERTS[tickIndex.current++ % NEW_ALERTS.length];
      const stamp = new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
      setAlerts((prev) => [{ c: a[0], t: a[1], s: `${a[2]} · ${stamp}` }, ...prev].slice(0, 12));
      setBadgeCount((c) => c + 1);
      toast(`🔔 नया अलर्ट: ${a[1]}`);
    }, 12000);
    return () => clearInterval(t);
  }, []);

  function changeRole(r) {
    setRole(r);
    setView(ROLES[r].nav[0][0]);
    setSelected(null);
  }

  function openNotifications() {
    setDdOpen((o) => !o);
    setBadgeCount(0);
  }

  function approveGrant(i, status) {
    setGrants((prev) => prev.map((g, idx) => (idx === i ? { ...g, st: status } : g)));
    toast(status === "स्वीकृत" ? "अनुदान स्वीकृत – DBT हेतु भेजा गया" : "अनुदान रोका गया – निरीक्षण आवश्यक");
  }

  function deductStock() {
    const n = fcCount || 0;
    setStock((s) => ({
      hara: Math.max(0, s.hara - n * 15),
      sukha: Math.max(0, s.sukha - n * 5),
      dana: Math.max(0, s.dana - n * 1.5),
    }));
    toast(`${n} गायों के आधार पर स्टॉक घटाया गया`);
  }

  const r = ROLES[role];
  const effectiveTheme =
    theme || (window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light");

  return (
    <div data-theme={theme || undefined} className={`sgms-root ${effectiveTheme === "dark" ? "dark" : ""}`}>
      <Style />
      <div className="tri" />
      <header>
        <div className="emb">🏛️</div>
        <div>
          <h1>AI-Driven Gaushala Governance & Grant Transparency Portal</h1>
          <small>गौशाला शासन एवं अनुदान पारदर्शिता पोर्टल (SGMS) · पशुपालन एवं गो-सेवा विभाग</small>
        </div>
        <div className="roles">
          {[
            ["admin", "Admin"],
            ["sub", "Sub Admin"],
            ["mgr", "Gaushala Manager"],
          ].map(([key, label]) => (
            <button key={key} className={key === role ? "on" : ""} onClick={() => changeRole(key)}>
              {label}
            </button>
          ))}
        </div>
        <div className="hb">
          <div id="clk">
            {now.toLocaleDateString("en-IN")}
            <br />
            <b>{now.toLocaleTimeString("en-IN")}</b>
          </div>
          <button className="ib" onClick={openNotifications} aria-label="सूचनाएँ">
            🔔{badgeCount > 0 && <i>{badgeCount}</i>}
          </button>
          <button className="ib" onClick={() => setTheme(effectiveTheme === "dark" ? "light" : "dark")} aria-label="थीम बदलें">
            🌓
          </button>
        </div>
        {ddOpen && (
          <div id="dd">
            <b>सूचनाएँ (Notifications)</b>
            <br />
            <br />
            <AlertList alerts={alerts.slice(0, 6)} />
          </div>
        )}
      </header>

      <div className="wrap">
        <nav>
          <div className="u">
            <b>
              {r.ic} {r.name}
            </b>
            <span>{r.u}</span>
          </div>
          {r.nav.map(([key, icon, label]) => (
            <a key={key} className={key === view ? "on" : ""} onClick={() => setView(key)}>
              <span>{icon}</span>
              {label}
            </a>
          ))}
        </nav>

        <main>
          {role === "admin" && view === "dash" && (
            <AdminDash
              g={INITIAL_G}
              alerts={alerts}
              selected={selected}
              onSelect={setSelected}
            />
          )}
          {role === "admin" && view === "grants" && <AdminGrants grants={grants} onApprove={approveGrant} />}
          {role === "admin" && view === "audit" && <AdminAudit g={INITIAL_G} toast={toast} />}
          {role === "admin" && view === "sub" && <AdminSub toast={toast} />}
          {role === "admin" && view === "policy" && <AdminPolicy toast={toast} />}
          {role === "admin" && view === "pub" && <AdminPublic g={INITIAL_G} toast={toast} />}

          {role === "sub" && view === "zone" && <SubZone g={INITIAL_G} />}
          {role === "sub" && view === "alerts" && <SubAlerts alerts={alerts} toast={toast} />}
          {role === "sub" && view === "verify" && <SubVerify g={INITIAL_G} toast={toast} />}
          {role === "sub" && view === "zrep" && <SubZrep toast={toast} />}

          {role === "mgr" && view === "mdash" && (
            <MgrDash alerts={alerts} stock={stock} />
          )}
          {role === "mgr" && view === "cctv" && <MgrCctv ir={irMode} setIr={setIrMode} toast={toast} />}
          {role === "mgr" && view === "gate" && <MgrGate alerts={alerts} />}
          {role === "mgr" && view === "feed" && (
            <MgrFeed stock={stock} fcCount={fcCount} setFcCount={setFcCount} onDeduct={deductStock} toast={toast} />
          )}
          {role === "mgr" && view === "health" && <MgrHealth toast={toast} />}
          {role === "mgr" && view === "perim" && <MgrPerim alerts={alerts} toast={toast} />}
        </main>
      </div>

      <footer>डेमो पूर्वावलोकन · सभी आँकड़े काल्पनिक हैं · Prototype preview – all data is sample data</footer>

      {toastMsg && <div id="toast">{toastMsg}</div>}
    </div>
  );
}

// ---------- Views ----------
function AdminDash({ g, alerts, selected, onSelect }) {
  const sel = selected != null ? g[selected] : null;
  return (
    <>
      <h2>राज्य स्तरीय डैशबोर्ड</h2>
      <p className="sub">पूरे राज्य की गौशालाओं की लाइव स्थिति (GIS Map View)</p>

      <div className="hero">
        <div>
          <span className="live" style={{ color: "#9be7b4" }}>
            लाइव · 1,248 गौशालाएँ जुड़ी हैं
          </span>
          <br />
          <b>आज का राज्य अनुपालन: 94.1%</b>
          <br />
          <small>AI + RFID सत्यापन सक्रिय</small>
        </div>
        <div style={{ textAlign: "right" }}>
          <b>₹ 4.8 L</b>
          <br />
          <small>आज रोकी गई संदिग्ध बिलिंग</small>
        </div>
      </div>

      <div className="grid g4">
        <Kpi n="1,248" l="पंजीकृत गौशालाएँ" d="▲ 12 इस माह" />
        <Kpi n="1,86,420" l="AI सत्यापित गायें" d="DBT-आधारित" tone="g" />
        <Kpi n="₹ 1.9 Cr" l="फर्जी बिलिंग से बचत" d="इस तिमाही" tone="s" />
        <Kpi n="2.1%" l="मृत्यु दर" d="▼ 1.4% पिछली तिमाही से" tone="g" />
      </div>

      <div className="grid g2" style={{ marginTop: 12 }}>
        <div className="card">
          <h3>GIS मानचित्र</h3>
          <GaushalaMap g={g} onSelect={onSelect} />
          <div className="card sel" style={{ marginTop: 8 }}>
            {sel ? (
              <>
                <b>{sel.n}</b> <Badge s={sel.s} />
                <div className="row">
                  <span>AI सत्यापित / पंजीकृत</span>
                  <b>
                    {sel.ver}/{sel.reg}
                  </b>
                </div>
                <div className="row">
                  <span>चारा</span>
                  <b className={sel.feed === "ok" ? "ok" : "bad"}>{sel.feed === "ok" ? "समय पर" : "देरी / नहीं"}</b>
                </div>
                <div className="row">
                  <span>जोखिम स्कोर (AI)</span>
                  <b>{sel.s === "ok" ? 12 : sel.s === "warn" ? 54 : 87}/100</b>
                </div>
              </>
            ) : (
              "किसी गौशाला के बिंदु पर क्लिक करें"
            )}
          </div>
        </div>
        <div className="card">
          <h3>
            लाइव अलर्ट <span className="live">लाइव</span>
          </h3>
          <AlertList alerts={alerts.slice(0, 6)} />
        </div>
      </div>

      <div className="grid g2" style={{ marginTop: 12 }}>
        <div className="card">
          <h3>
            मृत्यु दर ट्रेंड (%) <span className="live">6 माह</span>
          </h3>
          <Line vals={[3.9, 3.6, 3.4, 3.0, 2.7, 2.4, 2.1]} color={COLORS.grn} />
          <small className="sub">▼ AI अर्ली-अलर्ट से मृत्यु दर में 46% कमी</small>
        </div>
        <div className="card">
          <h3>अनुदान सत्यापन वितरण</h3>
          <div style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
            <Donut
              parts={[
                [82, COLORS.grn],
                [11, COLORS.saf],
                [7, COLORS.red],
              ]}
            />
            <div style={{ flex: 1, minWidth: 140 }}>
              <div className="row">
                <span>🟢 पूर्ण सत्यापित</span>
                <b>82%</b>
              </div>
              <div className="row">
                <span>🟠 समीक्षाधीन</span>
                <b>11%</b>
              </div>
              <div className="row">
                <span>🔴 रोका गया</span>
                <b>7%</b>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <h3>गौशाला सूची · पंजीकृत बनाम AI-सत्यापित गणना</h3>
        <GTable list={g} />
      </div>
    </>
  );
}

function AdminGrants({ grants, onApprove }) {
  return (
    <>
      <h2>अनुदान स्वीकृति (Grant Approval)</h2>
      <p className="sub">केवल AI + RFID से सत्यापित गायों का ही अनुदान जारी होगा (DBT-style)</p>
      <div className="card">
        <div className="tw">
          <table>
            <thead>
              <tr>
                <th>गौशाला</th>
                <th>दावा</th>
                <th>सत्यापित गाय</th>
                <th>देय राशि</th>
                <th>स्थिति</th>
                <th>कार्य</th>
              </tr>
            </thead>
            <tbody>
              {grants.map((r, i) => (
                <tr key={i}>
                  <td>{r.g.n}</td>
                  <td>{r.g.reg}</td>
                  <td className={r.g.reg - r.g.ver > 20 ? "bad" : "ok"}>{r.g.ver}</td>
                  <td>{r.amt}</td>
                  <td>
                    <span className={`b ${r.st === "स्वीकृत" ? "ok" : r.st === "रोका गया" ? "bad" : "warn"}`}>
                      {r.st}
                    </span>
                  </td>
                  <td>
                    {r.st === "लंबित" ? (
                      <>
                        <button className="btn g" onClick={() => onApprove(i, "स्वीकृत")}>
                          स्वीकृत करें
                        </button>{" "}
                        <button className="btn r" onClick={() => onApprove(i, "रोका गया")}>
                          रोकें
                        </button>
                      </>
                    ) : (
                      "—"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="sub" style={{ marginTop: 10 }}>
          दर: ₹40 प्रति गाय प्रति दिन × सत्यापित गायें × दिन
        </p>
      </div>
    </>
  );
}

function AdminAudit({ g, toast }) {
  return (
    <>
      <h2>AI ऑडिट रिपोर्ट</h2>
      <p className="sub">Ghost Cattle, चारा खपत और तौल-पर्ची का स्वचालित मिलान</p>
      <div className="grid g2">
        {g.slice(0, 4).map((item) => (
          <div className="card" key={item.id}>
            <h3>
              {item.n} <Badge s={item.s} />
            </h3>
            <div className="row">
              <span>Headcount मिलान</span>
              <b className={item.reg - item.ver > 20 ? "bad" : "ok"}>
                {item.ver}/{item.reg}
              </b>
            </div>
            <div className="bar">
              <i
                style={{
                  width: `${pct(item.ver, item.reg)}%`,
                  background: item.s === "bad" ? "var(--red)" : "var(--grn)",
                }}
              />
            </div>
            <div className="row">
              <span>चारा बिल बनाम तौल-पर्ची</span>
              <b className={item.s === "bad" ? "bad" : "ok"}>{item.s === "bad" ? "18% अंतर" : "मिलान ✓"}</b>
            </div>
            <div className="row">
              <span>ANPR वाहन मिलान</span>
              <b className="ok">✓</b>
            </div>
            <button className="btn o" style={{ marginTop: 8 }} onClick={() => toast(`PDF रिपोर्ट तैयार: ${item.id}`)}>
              रिपोर्ट डाउनलोड करें
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

function AdminSub({ toast }) {
  const [name, setName] = useState("");
  const zones = [
    ["रायपुर ज़ोन", "3 गौशाला"],
    ["दुर्ग ज़ोन", "1 गौशाला"],
    ["बिलासपुर ज़ोन", "1 गौशाला"],
    ["बस्तर ज़ोन", "1 गौशाला"],
  ];
  return (
    <>
      <h2>उप-प्रशासक प्रबंधन</h2>
      <p className="sub">ज़ोन/जिला असाइन करें और अधिकार नियंत्रित करें</p>
      <div className="grid g2">
        <div className="card">
          <h3>नया उप-प्रशासक जोड़ें</h3>
          <label>नाम</label>
          <input placeholder="जैसे: श्री आर. के. वर्मा" value={name} onChange={(e) => setName(e.target.value)} />
          <label>ज़ोन / जिला</label>
          <select>
            <option>रायपुर ज़ोन</option>
            <option>दुर्ग ज़ोन</option>
            <option>बिलासपुर ज़ोन</option>
            <option>बस्तर ज़ोन</option>
          </select>
          <br />
          <button className="btn s" onClick={() => toast(`उप-प्रशासक (${name || "नया उपयोगकर्ता"}) असाइन किया गया`)}>
            असाइन करें
          </button>
        </div>
        <div className="card">
          <h3>सक्रिय उप-प्रशासक</h3>
          {zones.map(([z, c]) => (
            <div className="row" key={z}>
              <span>🧑‍💼 {z}</span>
              <span className="b in">{c}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function AdminPolicy({ toast }) {
  return (
    <>
      <h2>नीति एवं मानक</h2>
      <p className="sub">राज्य-व्यापी राशन एवं अनुदान नियम</p>
      <div className="grid g2">
        <div className="card">
          <h3>प्रति गाय दैनिक राशन मानक</h3>
          <label>हरा चारा (kg)</label>
          <input defaultValue="15" />
          <label>सूखा चारा (kg)</label>
          <input defaultValue="5" />
          <label>दाना (kg)</label>
          <input defaultValue="1.5" />
          <br />
          <button className="btn" onClick={() => toast("मानक सहेजे गए")}>
            मानक सहेजें
          </button>
        </div>
        <div className="card">
          <h3>अनुदान एवं अलर्ट नियम</h3>
          <label>प्रति गाय प्रति दिन अनुदान (₹)</label>
          <input defaultValue="40" />
          <label>चारा डालने की अंतिम समय-सीमा</label>
          <input defaultValue="09:00" />
          <label>अस्थिर गाय अलर्ट (घंटे)</label>
          <input defaultValue="4" />
          <label>Missing Cow अलर्ट समय</label>
          <input defaultValue="18:00" />
          <br />
          <button className="btn" onClick={() => toast("नीति लागू की गई")}>
            नीति लागू करें
          </button>
        </div>
      </div>
    </>
  );
}

function AdminPublic({ g, toast }) {
  return (
    <>
      <h2>जन-दृश्य एवं गौ-दान</h2>
      <p className="sub">नागरिक पारदर्शिता — Adopt a Cow</p>
      <div className="grid g4">
        {g.slice(0, 3).map((item) => (
          <div className="card" key={item.id}>
            <h3>{item.n}</h3>
            <div className="row">
              <span>सत्यापित गायें</span>
              <b>{item.ver}</b>
            </div>
            <div className="row">
              <span>आज चारा</span>
              <b className={item.feed === "bad" ? "bad" : "ok"}>{item.feed === "bad" ? "नहीं मिला" : "दिया गया ✓"}</b>
            </div>
            <div className="row">
              <span>स्वास्थ्य</span>
              <b className="ok">98% स्वस्थ</b>
            </div>
            <br />
            <button className="btn s" onClick={() => toast("धन्यवाद! गौ-दान पेज खुल रहा है (डेमो)")}>
              🙏 एक गाय गोद लें · ₹1,500/माह
            </button>
          </div>
        ))}
      </div>
    </>
  );
}

function SubZone({ g }) {
  return (
    <>
      <h2>ज़ोन लाइव मॉनिटर – रायपुर</h2>
      <p className="sub">आपके ज़ोन की सभी गौशालाएँ</p>
      <div className="grid g4">
        <Kpi n="3" l="गौशालाएँ" />
        <Kpi n="419/486" l="आज सत्यापित गायें" d="86%" tone="g" />
        <Kpi n="1" l="चारा अलर्ट" d="तिल्दा" tone="r" />
        <Kpi n="2" l="लंबित निरीक्षण" tone="s" />
      </div>
      <div className="grid g2" style={{ marginTop: 12 }}>
        {g.slice(0, 3).map((item) => (
          <div className="card" key={item.id}>
            <h3>
              {item.n} <Badge s={item.s} />
            </h3>
            <Cam
              title="Gate-1 · Shed-A"
              boxes={[
                { x: 15, y: 45, w: 18, h: 30, label: "गाय 96%" },
                { x: 48, y: 52, w: 16, h: 28, label: "गाय 94%" },
                {
                  x: 72,
                  y: 40,
                  w: 15,
                  h: 32,
                  tone: item.s === "bad" ? "r" : "",
                  label: item.s === "bad" ? "गिरी हुई 88%" : "गाय 92%",
                },
              ]}
              caption={`AI गणना: ${item.ver}`}
            />
            <div className="row">
              <span>चारा नांद</span>
              <b className={item.feed === "bad" ? "bad" : "ok"}>{item.feed === "bad" ? "खाली (9 बजे)" : "भरी हुई"}</b>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function SubAlerts({ alerts, toast }) {
  return (
    <>
      <h2>अलर्ट एवं औचक निरीक्षण</h2>
      <p className="sub">अलर्ट देखें, निरीक्षक असाइन करें</p>
      <div className="card">
        {alerts.slice(0, 5).map((a, i) => (
          <div className={`al ${a.c}`} key={i}>
            <b>{a.t}</b>
            <small>{a.s}</small>
            <div style={{ marginTop: 6 }}>
              <button className="btn s" onClick={() => toast("निरीक्षण टीम को असाइन किया गया")}>
                निरीक्षण असाइन करें
              </button>{" "}
              <button className="btn o" onClick={() => toast("अलर्ट स्वीकार किया गया")}>
                स्वीकार करें
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function SubVerify({ g, toast }) {
  return (
    <>
      <h2>रिपोर्ट सत्यापन</h2>
      <p className="sub">गौशालाओं की दैनिक AI रिपोर्ट (फोटो-प्रमाण सहित)</p>
      <div className="card">
        <GTable
          list={g.slice(0, 3)}
          renderActions={(item) => (
            <>
              <button className="btn g" onClick={() => toast(`${item.id} रिपोर्ट सत्यापित, राज्य को भेजी गई`)}>
                सत्यापित करें
              </button>{" "}
              <button className="btn o" onClick={() => toast("फोटो-प्रमाण खोला जा रहा है")}>
                📷 प्रमाण
              </button>
            </>
          )}
        />
      </div>
    </>
  );
}

function SubZrep({ toast }) {
  const days = ["सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि", "रवि"];
  const vals = [82, 85, 84, 88, 86, 90, 87];
  return (
    <>
      <h2>ज़ोन रिपोर्ट</h2>
      <p className="sub">साप्ताहिक प्रदर्शन</p>
      <div className="card">
        <h3>सत्यापित गणना – 7 दिन</h3>
        {days.map((d, i) => (
          <div className="row" key={d}>
            <span style={{ width: 44 }}>{d}</span>
            <div className="bar" style={{ flex: 1 }}>
              <i style={{ width: `${vals[i]}%` }} />
            </div>
            <b>{vals[i]}%</b>
          </div>
        ))}
        <br />
        <button className="btn" onClick={() => toast("साप्ताहिक रिपोर्ट राज्य कार्यालय को भेजी गई")}>
          राज्य को भेजें
        </button>
      </div>
    </>
  );
}

function MgrDash({ alerts, stock }) {
  return (
    <>
      <h2>श्री कृष्ण गौशाला, आरंग</h2>
      <p className="sub">आज की स्थिति · {new Date().toLocaleDateString("hi-IN")}</p>
      <div className="grid g4">
        <Kpi n="204 / 210" l="आज की सत्यापित गणना" d="सुबह ✓ · शाम ✓" tone="g" />
        <Kpi n="9" l="बीमार / निगरानी में" d="2 उपचाराधीन" tone="r" />
        <Kpi n="1 / 1" l="चारा समय पर दिया गया" d="8:20 AM" tone="g" />
        <Kpi n="2" l="खुली अलर्ट" tone="s" />
      </div>
      <div className="grid g2" style={{ marginTop: 12 }}>
        <div className="card">
          <h3>मेरे अलर्ट</h3>
          <AlertList alerts={alerts.slice(2, 4)} />
        </div>
        <div className="card">
          <h3>स्टॉक स्थिति</h3>
          <StockRows stock={stock} />
        </div>
      </div>
    </>
  );
}

function MgrCctv({ ir, setIr, toast }) {
  return (
    <>
      <h2>CCTV · AI डिटेक्शन</h2>
      <p className="sub">Edge-AI (YOLO/OpenCV) — कम लागत, मौजूदा कैमरे</p>
      <div className="grid g4" style={{ marginBottom: 12 }}>
        <Kpi n="24 FPS" l="Edge-AI इन्फरेंस" />
        <Kpi n="38 ms" l="डिटेक्शन लेटेंसी" />
        <Kpi n="97.3%" l="गणना सटीकता" tone="g" />
        <Kpi n="80%" l="प्रति गाय लागत में बचत" tone="s" />
      </div>
      <div className="tabs">
        <button className="btn o" onClick={() => setIr((v) => !v)}>
          🌙 नाइट-विज़न (IR) टॉगल
        </button>
      </div>
      <div className="grid g2">
        <div className="card">
          <h3>
            1. स्वचालित गणना <span className="b ok">204 सत्यापित</span>
          </h3>
          <Cam
            ir={ir}
            title="Gate-1"
            boxes={[
              { x: 10, y: 50, w: 14, h: 30, label: "गाय 97%" },
              { x: 30, y: 55, w: 14, h: 28, label: "गाय 95%" },
              { x: 52, y: 48, w: 15, h: 32, label: "गाय 93%" },
              { x: 74, y: 52, w: 14, h: 30, label: "गाय 96%" },
            ]}
            caption="दिन में 2 बार गणना + फोटो-प्रमाण"
          />
        </div>
        <div className="card">
          <h3>
            2. नांद निगरानी <span className="b ok">भरी हुई</span>
          </h3>
          <Cam
            ir={ir}
            title="Feed Trough-B"
            boxes={[{ x: 8, y: 60, w: 84, h: 22, tone: "y", label: "नांद: भरी 80%" }]}
            caption="9:00 AM तक चारा न दिखे तो नोडल अधिकारी को अलर्ट"
          />
        </div>
        <div className="card">
          <h3>
            3. बीमार / गिरी गाय <span className="b bad">1 अलर्ट</span>
          </h3>
          <Cam
            ir={ir}
            title="Shed-C"
            boxes={[
              { x: 40, y: 50, w: 22, h: 32, tone: "r", label: "गिरी हुई · 4h 20m" },
              { x: 10, y: 45, w: 14, h: 30, label: "गाय 94%" },
            ]}
            caption="Posture + Immobility Detection"
          />
          <button className="btn r" style={{ marginTop: 8 }} onClick={() => toast("अलर्ट डॉक्टर (Tier-4) और प्रबंधक को भेजा गया")}>
            डॉक्टर को अलर्ट भेजें
          </button>
        </div>
        <div className="card">
          <h3>
            4. परिधि / घुसपैठ <span className="b warn">1 घटना</span>
          </h3>
          <Cam
            ir={ir}
            title="North Boundary · Night"
            boxes={[{ x: 55, y: 35, w: 12, h: 45, tone: "r", label: "व्यक्ति 91%" }]}
            caption="सायरन + कंट्रोल रूम अलर्ट"
          />
          <button className="btn s" style={{ marginTop: 8 }} onClick={() => toast("सायरन सक्रिय · कंट्रोल रूम सूचित")}>
            🔔 सायरन बजाएँ
          </button>
        </div>
      </div>
    </>
  );
}

function MgrGate() {
  const logs = [
    ["06:42", "…4471", "बाहर"],
    ["06:43", "…2290", "बाहर"],
    ["06:43", "…1187", "बाहर"],
    ["17:48", "…4471", "अंदर"],
    ["17:51", "…1187", "अंदर"],
  ];
  return (
    <>
      <h2>RFID गेट एवं ट्रैकिंग</h2>
      <p className="sub">Passive UHF RFID (₹30–50/टैग) + Long-range Reader + CCTV</p>
      <div className="grid g2">
        <div className="card">
          <h3>गेट लॉग (लाइव)</h3>
          <div className="tw">
            <table>
              <thead>
                <tr>
                  <th>समय</th>
                  <th>टैग ID</th>
                  <th>दिशा</th>
                  <th>फोटो</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((row, i) => (
                  <tr key={i}>
                    <td>{row[0]}</td>
                    <td>{row[1]}</td>
                    <td>
                      <span className={`b ${row[2] === "बाहर" ? "warn" : "ok"}`}>{row[2]}</span>
                    </td>
                    <td>📷</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card">
          <h3>Missing Cow अलर्ट</h3>
          <div className="al w">
            <b>गाय वापस नहीं लौटी – Missing Cow Alert (…2290)</b>
            <small>शाम 6 बजे के बाद · 06:05 PM</small>
          </div>
          <div className="row">
            <span>अभी बाहर (चराई)</span>
            <b>14 गायें</b>
          </div>
          <div className="row">
            <span>LoRaWAN झुंड-ट्रैकर (Alpha Cow)</span>
            <b className="ok">सक्रिय · बैटरी 82%</b>
          </div>
          <svg viewBox="0 0 300 120" width="100%" className="map" style={{ marginTop: 8 }}>
            <path d="M10 100 Q80 20 150 70 T290 30" fill="none" stroke={COLORS.saf} strokeWidth="3" strokeDasharray="6 5" />
            <circle cx="290" cy="30" r="7" fill={COLORS.red} />
            <text x="12" y="116" fontSize="11" fill="#5d6a80">
              GPS लाइव लोकेशन – चरवाहा/लीडर गाय
            </text>
          </svg>
        </div>
      </div>
    </>
  );
}

function MgrFeed({ stock, fcCount, setFcCount, onDeduct, toast }) {
  return (
    <>
      <h2>चारा एवं स्टॉक</h2>
      <p className="sub">AI गणना से जुड़ी राशन प्रणाली + धर्मकाँटा/ANPR</p>
      <div className="grid g2">
        <div className="card">
          <h3>राशन कैलकुलेटर</h3>
          <label>आज की सत्यापित गायें</label>
          <input type="number" value={fcCount} onChange={(e) => setFcCount(+e.target.value || 0)} />
          <div style={{ margin: "10px 0" }}>
            आज की आवश्यकता: <b>{fcCount * 15} kg</b> हरा · <b>{fcCount * 5} kg</b> सूखा · <b>{(fcCount * 1.5).toFixed(1)} kg</b> दाना
          </div>
          <button className="btn g" onClick={onDeduct}>
            स्टॉक से स्वतः कटौती करें
          </button>
        </div>
        <div className="card">
          <h3>गोदाम का डिजिटल स्टॉक</h3>
          <StockRows stock={stock} />
        </div>
        <div className="card">
          <h3>धर्मकाँटा + ANPR – चारा गाड़ी प्रवेश</h3>
          <div className="row">
            <span>वाहन नंबर (ANPR)</span>
            <b>CG 04 AB 2381</b>
          </div>
          <div className="row">
            <span>तौल पर्ची</span>
            <b>3,240 kg हरा चारा</b>
          </div>
          <div className="row">
            <span>बिल की मात्रा</span>
            <b className="ok">3,240 kg ✓ मिलान</b>
          </div>
          <br />
          <button className="btn" onClick={() => toast("चारा प्रवेश दर्ज: +3,240 kg")}>
            स्टॉक में जोड़ें
          </button>
        </div>
      </div>
    </>
  );
}

function MgrHealth({ toast }) {
  const treating = [
    ["…4471", "लंगड़ापन", "डॉ. मिश्रा", "चल रहा"],
    ["…3320", "बुखार", "डॉ. मिश्रा", "निगरानी"],
  ];
  return (
    <>
      <h2>स्वास्थ्य एवं पशु चिकित्सा</h2>
      <p className="sub">उपचार, टीकाकरण और आपातकालीन अलर्ट</p>
      <div className="grid g2">
        <div className="card">
          <h3>उपचाराधीन गायें</h3>
          {treating.map((row, i) => (
            <div className="row" key={i}>
              <span>
                <b>{row[0]}</b> · {row[1]}
                <br />
                <small>{row[2]}</small>
              </span>
              <span className="b warn">{row[3]}</span>
            </div>
          ))}
        </div>
        <div className="card">
          <h3>उपचार / टीकाकरण दर्ज करें</h3>
          <label>टैग ID</label>
          <input placeholder="…4471" />
          <label>प्रकार</label>
          <select>
            <option>उपचार अपडेट</option>
            <option>FMD टीकाकरण</option>
            <option>HS-BQ टीकाकरण</option>
          </select>
          <br />
          <button className="btn s" onClick={() => toast("रिकॉर्ड सहेजा गया")}>
            रिकॉर्ड जोड़ें
          </button>
        </div>
      </div>
    </>
  );
}

function MgrPerim({ toast }) {
  return (
    <>
      <h2>सुरक्षा / घुसपैठ</h2>
      <p className="sub">रात्रि निगरानी, सायरन और कंट्रोल रूम</p>
      <div className="card">
        <div className="al w">
          <b>रात्रि घुसपैठ – आरंग गौशाला उत्तरी गेट</b>
          <small>अज्ञात व्यक्ति · 02:14 AM</small>
        </div>
        <div className="al w">
          <b>जंगली जानवर – पश्चिमी बाउंड्री</b>
          <small>11:30 PM · सायरन बजा</small>
        </div>
        <button className="btn r" onClick={() => toast("कंट्रोल रूम को कॉल लगाई जा रही है")}>
          कंट्रोल रूम को कॉल करें
        </button>
      </div>
    </>
  );
}

// ---------- Styles ----------
function Style() {
  return (
    <style>{`
.sgms-root{--navy:#17294d;--navy2:#22396a;--saf:#e0711a;--grn:#1d6b3b;--bg:#eef2f7;--card:#fff;--ink:#1c2433;--mut:#5d6a80;--line:#d6dde8;--red:#b3261e;--amb:#b7791f;--soft:#f6f8fb;
  box-sizing:border-box;font-family:'Noto Sans Devanagari','Segoe UI',Arial,sans-serif;background:var(--bg);color:var(--ink);font-size:14px;line-height:1.5;position:relative}
.sgms-root.dark{--bg:#0f1624;--card:#18223a;--ink:#e8edf7;--mut:#9aa8c2;--line:#2b3955;--soft:#1d2a47;--navy:#0c1a38}
.sgms-root *{box-sizing:border-box}
.sgms-root .tri{height:5px;background:linear-gradient(90deg,var(--saf) 33%,#fff 33% 66%,var(--grn) 66%)}
.sgms-root header{background:var(--navy);color:#fff;display:flex;align-items:center;gap:14px;padding:10px 18px;flex-wrap:wrap;position:relative}
.sgms-root .emb{width:44px;height:44px;border-radius:50%;border:2px solid #fff;display:grid;place-items:center;font-size:22px;background:var(--navy2)}
.sgms-root h1{font:700 17px/1.2 'Noto Serif Devanagari',Georgia,serif;margin:0}
.sgms-root header small{opacity:.8;font-size:12px}
.sgms-root .roles{margin-left:auto;display:flex;gap:6px;flex-wrap:wrap}
.sgms-root .roles button{background:transparent;color:#fff;border:1px solid #ffffff55;padding:7px 12px;border-radius:4px;cursor:pointer;font:inherit;font-size:13px}
.sgms-root .roles button.on{background:var(--saf);border-color:var(--saf);font-weight:700}
.sgms-root .hb{display:flex;gap:8px;align-items:center}
.sgms-root .ib{background:transparent;border:1px solid #ffffff55;color:#fff;border-radius:4px;padding:6px 9px;cursor:pointer;position:relative;font:inherit}
.sgms-root .ib i{position:absolute;top:-7px;right:-7px;background:var(--red);font-style:normal;font-size:10px;border-radius:9px;padding:0 5px}
.sgms-root #clk{font-size:12px;text-align:right;line-height:1.25;min-width:84px}
.sgms-root #dd{position:absolute;right:18px;top:64px;width:330px;max-width:calc(100vw - 24px);background:var(--card);color:var(--ink);border:1px solid var(--line);border-top:3px solid var(--saf);border-radius:4px;padding:10px;z-index:8;max-height:70vh;overflow:auto;box-shadow:0 8px 24px #0005}
.sgms-root .live{display:inline-flex;gap:6px;align-items:center;font-size:12px;color:var(--grn);font-weight:700}
.sgms-root .live:before{content:"";width:8px;height:8px;border-radius:50%;background:currentColor;animation:bl 1.2s infinite}
.sgms-root .hero{background:linear-gradient(110deg,var(--navy),var(--navy2));color:#fff;border-radius:4px;padding:14px 16px;margin-bottom:12px;display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;border-bottom:4px solid var(--saf)}
.sgms-root .hero b{font:700 21px 'Noto Serif Devanagari',Georgia,serif}
.sgms-root .wrap{display:flex;min-height:calc(100vh - 100px)}
.sgms-root nav{width:218px;background:var(--card);border-right:1px solid var(--line);padding:12px 8px;flex:none}
.sgms-root nav .u{padding:8px 10px 12px;border-bottom:1px solid var(--line);margin-bottom:8px}
.sgms-root nav .u b{display:block}
.sgms-root nav .u span{color:var(--mut);font-size:12px}
.sgms-root nav a{display:flex;gap:9px;align-items:center;padding:9px 10px;border-radius:4px;color:var(--ink);cursor:pointer;border-left:3px solid transparent}
.sgms-root nav a:hover{background:var(--soft)}
.sgms-root nav a.on{background:var(--soft);border-left-color:var(--saf);font-weight:700;color:var(--navy2)}
.sgms-root.dark nav a.on{color:#fff}
.sgms-root main{flex:1;padding:18px;min-width:0}
.sgms-root h2{font:700 20px 'Noto Serif Devanagari',Georgia,serif;margin:0 0 2px;color:var(--navy2)}
.sgms-root.dark h2{color:#fff}
.sgms-root .sub{color:var(--mut);margin:0 0 14px}
.sgms-root .grid{display:grid;gap:12px}
.sgms-root .g4{grid-template-columns:repeat(auto-fit,minmax(170px,1fr))}
.sgms-root .g2{grid-template-columns:repeat(auto-fit,minmax(310px,1fr))}
.sgms-root .card{background:var(--card);border:1px solid var(--line);border-radius:4px;padding:14px}
.sgms-root .card h3{margin:0 0 10px;font-size:14px;display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid var(--saf);padding-bottom:6px}
.sgms-root .kpi{border-top:3px solid var(--navy2)}
.sgms-root .kpi .n{font:700 26px 'Noto Serif Devanagari',Georgia,serif}
.sgms-root .kpi .l{color:var(--mut);font-size:12.5px}
.sgms-root .kpi .d{font-size:12px;margin-top:2px}
.sgms-root .ok{color:var(--grn)}
.sgms-root .bad{color:var(--red)}
.sgms-root .warn{color:var(--amb)}
.sgms-root table{width:100%;border-collapse:collapse;font-size:13px}
.sgms-root th{background:var(--navy2);color:#fff;text-align:left;padding:8px;font-weight:600}
.sgms-root td{padding:8px;border-bottom:1px solid var(--line)}
.sgms-root .tw{overflow-x:auto}
.sgms-root .b{display:inline-block;padding:2px 8px;border-radius:10px;font-size:11.5px;font-weight:700}
.sgms-root .b.ok{background:#1d6b3b22}
.sgms-root .b.bad{background:#b3261e22}
.sgms-root .b.warn{background:#b7791f26}
.sgms-root .b.in{background:#22396a22;color:var(--navy2)}
.sgms-root.dark .b.in{color:#cdd9f5}
.sgms-root .btn{background:var(--navy2);color:#fff;border:0;padding:6px 11px;border-radius:3px;cursor:pointer;font:inherit;font-size:12.5px}
.sgms-root .btn.g{background:var(--grn)}
.sgms-root .btn.r{background:var(--red)}
.sgms-root .btn.s{background:var(--saf)}
.sgms-root .btn.o{background:transparent;color:var(--navy2);border:1px solid var(--navy2)}
.sgms-root.dark .btn.o{color:#fff;border-color:#fff}
.sgms-root .bar{height:9px;background:var(--line);border-radius:5px;overflow:hidden}
.sgms-root .bar i{display:block;height:100%;background:var(--grn)}
.sgms-root .row{display:flex;justify-content:space-between;gap:8px;align-items:center;padding:7px 0;border-bottom:1px dashed var(--line)}
.sgms-root .al{border-left:4px solid var(--red);background:var(--soft);padding:8px 10px;margin-bottom:8px;border-radius:3px}
.sgms-root .al.w{border-color:var(--amb)}
.sgms-root .al.i{border-color:var(--navy2)}
.sgms-root .al b{display:block}
.sgms-root .al small{color:var(--mut)}
.sgms-root .cam{position:relative;aspect-ratio:16/10;border-radius:4px;overflow:hidden;background:linear-gradient(180deg,#5b6b52 0 38%,#7d6a4b 38% 100%);color:#fff;font-size:11px}
.sgms-root .cam.ir{filter:grayscale(1) contrast(1.25) brightness(1.15) sepia(.4) hue-rotate(60deg)}
.sgms-root .cam .t{position:absolute;left:6px;top:5px;background:#000a;padding:1px 6px;border-radius:2px}
.sgms-root .cam .rec{position:absolute;right:7px;top:6px;display:flex;gap:4px;align-items:center}
.sgms-root .cam .rec:before{content:"";width:8px;height:8px;border-radius:50%;background:#e33;animation:bl 1.2s infinite}
.sgms-root .bx{position:absolute;border:2px solid #4ade80;border-radius:2px;animation:dr 4s ease-in-out infinite}
.sgms-root .bx:nth-child(odd){animation-duration:5.3s;animation-direction:reverse}
.sgms-root .bx span{position:absolute;top:-15px;left:-2px;background:#16a34a;padding:0 4px;font-size:10px;white-space:nowrap}
.sgms-root .bx.r{border-color:#f87171}
.sgms-root .bx.r span{background:#dc2626}
.sgms-root .bx.y{border-color:#fbbf24}
.sgms-root .bx.y span{background:#b45309}
.sgms-root .cam .cap{position:absolute;bottom:0;left:0;right:0;background:#000b;padding:3px 7px}
.sgms-root label{display:block;font-size:12px;color:var(--mut);margin:8px 0 3px}
.sgms-root input,.sgms-root select{width:100%;padding:7px;border:1px solid var(--line);border-radius:3px;background:var(--card);color:var(--ink);font:inherit}
.sgms-root .map{background:var(--soft);border-radius:4px}
.sgms-root .dot{cursor:pointer}
.sgms-root .tabs{display:flex;gap:6px;margin-bottom:10px;flex-wrap:wrap}
.sgms-root .sel{border-left:4px solid var(--saf)}
.sgms-root #toast{position:fixed;right:16px;bottom:16px;background:var(--navy2);color:#fff;padding:10px 14px;border-radius:4px;z-index:9;border-left:4px solid var(--saf)}
.sgms-root footer{text-align:center;color:var(--mut);font-size:12px;padding:12px}
@keyframes bl{50%{opacity:.2}}
@keyframes dr{0%,100%{transform:translate(0,0)}50%{transform:translate(7px,-3px)}}
@media(prefers-reduced-motion:reduce){.sgms-root .bx,.sgms-root .live:before,.sgms-root .cam .rec:before{animation:none}}
@media(max-width:760px){
  .sgms-root .wrap{flex-direction:column}
  .sgms-root nav{width:100%;display:flex;overflow-x:auto;gap:4px;padding:6px}
  .sgms-root nav .u{display:none}
  .sgms-root nav a{white-space:nowrap;border-left:0;border-bottom:3px solid transparent}
  .sgms-root nav a.on{border-bottom-color:var(--saf)}
  .sgms-root .roles{margin-left:0}
  .sgms-root main{padding:12px}
}
`}</style>
  );
}
