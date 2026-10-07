import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const demoMessages = {
  scam: "URGENT! Your investment account is eligible for guaranteed 30% monthly returns. Click this link immediately and complete KYC.",
  misinformation: "Everyone should buy this stock tomorrow because it will definitely double next month.",
  safe: "Before making an investment, learn about the product, understand the risks and verify information using reliable sources."
};

const translations = {
  en: {
    app: "NiveshRaksha", tagline: "Check. Understand. Protect.",
    subtitle: "Your AI-powered investor safety assistant",
    check: "Check a Message", content: "Analyze Content", rights: "Know Your Rights", help: "Get Help",
    learn: "Learn", privacy: "Privacy", dashboard: "Dashboard",
    welcome: "Safer decisions start with better information.",
    intro: "Check suspicious messages, understand financial claims, learn your rights and get a safe next-step checklist — without sharing sensitive credentials.",
    checkNow: "Check Now", tryDemo: "Try Demo", high: "HIGH RISK", verify: "NEEDS VERIFICATION", low: "LOW RISK",
    why: "Why was this flagged?", next: "What should you do now?", avoid: "Avoid doing this",
    source: "How can you verify it?", delete: "Delete My Data", lowData: "Low Data Mode",
    language: "Language", voice: "Ask by Voice", demo: "Demo",
    noAdvice: "NiveshRaksha does not provide buy/sell/hold recommendations or investment predictions."
  },
  hi: {
    app: "निवेशरक्षा", tagline: "जाँचें। समझें। सुरक्षित रहें।",
    subtitle: "आपका निवेश सुरक्षा सहायक",
    check: "संदेश जाँचें", content: "कंटेंट जाँचें", rights: "अपने अधिकार जानें", help: "मदद लें",
    learn: "सीखें", privacy: "गोपनीयता", dashboard: "डैशबोर्ड",
    welcome: "सुरक्षित निर्णय बेहतर जानकारी से शुरू होते हैं।",
    intro: "संदिग्ध संदेश जाँचें, वित्तीय दावों को समझें, अपने अधिकार जानें और सुरक्षित अगले कदम पाएं।",
    checkNow: "अभी जाँचें", tryDemo: "डेमो देखें", high: "उच्च जोखिम", verify: "जाँच आवश्यक", low: "कम जोखिम",
    why: "इसे क्यों चिन्हित किया गया?", next: "अब क्या करें?", avoid: "यह न करें",
    source: "इसे कैसे सत्यापित करें?", delete: "मेरा डेटा हटाएँ", lowData: "कम डेटा मोड",
    language: "भाषा", voice: "आवाज़ से पूछें", demo: "डेमो",
    noAdvice: "निवेशरक्षा खरीद/बिक्री सलाह या निवेश परिणाम की भविष्यवाणी नहीं करता।"
  },
  ta: {
    app: "நிவேஷ்ரக்ஷா", tagline: "சரிபார். புரிந்துகொள். பாதுகாப்பாய் இரு.",
    subtitle: "உங்கள் முதலீட்டாளர் பாதுகாப்பு உதவியாளர்",
    check: "செய்தியை சரிபார்", content: "உள்ளடக்கத்தை பகுப்பாய்வு செய்", rights: "உங்கள் உரிமைகள்", help: "உதவி பெறுங்கள்",
    learn: "கற்றுக்கொள்ளுங்கள்", privacy: "தனியுரிமை", dashboard: "முகப்பு",
    welcome: "பாதுகாப்பான முடிவுகள் நல்ல தகவலிலிருந்து தொடங்குகின்றன.",
    intro: "சந்தேகமான செய்திகளை சரிபார்த்து, நிதிக் கூற்றுகளைப் புரிந்து கொண்டு, உங்கள் உரிமைகளை அறிந்து பாதுகாப்பான அடுத்த படிகளைப் பெறுங்கள்.",
    checkNow: "இப்போது சரிபார்", tryDemo: "டெமோ", high: "அதிக ஆபத்து", verify: "சரிபார்ப்பு தேவை", low: "குறைந்த ஆபத்து",
    why: "ஏன் குறிக்கப்பட்டது?", next: "இப்போது என்ன செய்ய வேண்டும்?", avoid: "இதைச் செய்ய வேண்டாம்",
    source: "எப்படி சரிபார்ப்பது?", delete: "என் தரவை நீக்கு", lowData: "குறைந்த தரவு முறை",
    language: "மொழி", voice: "குரலில் கேளுங்கள்", demo: "டெமோ",
    noAdvice: "நிவேஷ்ரக்ஷா வாங்க/விற்க/வைத்திருக்க பரிந்துரைகளையோ முதலீட்டு கணிப்புகளையோ வழங்காது."
  }
};

function analyze(text) {
  const s = text.toLowerCase();
  const rules = [
    ["guaranteed return", 25, "Guaranteed-return language"],
    ["guaranteed", 22, "Guaranteed outcome claim"],
    ["30%", 18, "Specific high-return promise"],
    ["double", 20, "Unrealistic return language"],
    ["risk free", 25, "Risk-free claim"],
    ["risk-free", 25, "Risk-free claim"],
    ["urgent", 15, "Urgency / pressure"],
    ["immediately", 12, "Pressure to act immediately"],
    ["click", 10, "External-link/click pressure"],
    ["kyc", 10, "KYC/account pressure"],
    ["otp", 30, "Credential request"],
    ["password", 30, "Credential request"],
    ["pin", 30, "Credential request"],
    ["send money", 25, "Payment pressure"],
    ["buy this stock", 20, "Direct speculative instruction"],
    ["definitely", 15, "Certainty about future outcome"],
    ["double next month", 25, "Future-return prediction"]
  ];
  const hits = [];
  let score = 0;
  for (const [needle, points, label] of rules) {
    if (s.includes(needle) && !hits.some(h => h.label === label)) {
      score += points;
      hits.push({label, points});
    }
  }
  score = Math.min(100, score);
  let level = score >= 60 ? "high" : score >= 25 ? "verify" : "low";
  if (!text.trim()) { score = 0; level = "low"; }
  return {score, level, hits};
}

function App() {
  const [page, setPage] = useState("dashboard");
  const [lang, setLang] = useState(localStorage.getItem("nr-lang") || "en");
  const [lowData, setLowData] = useState(false);
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem("nr-history") || "[]"));
  const t = translations[lang];

  useEffect(() => localStorage.setItem("nr-lang", lang), [lang]);

  const nav = [
    ["dashboard", "⌂", t.dashboard],
    ["scam", "🛡", t.check],
    ["truth", "🔎", t.content],
    ["rights", "⚖", t.rights],
    ["help", "✓", t.help]
  ];

  function runAnalysis(text = input, mode = "scam") {
    const r = analyze(text);
    const item = {text, mode, ...r, time: new Date().toLocaleString()};
    setInput(text);
    setResult(item);
    const next = [item, ...history].slice(0, 10);
    setHistory(next);
    localStorage.setItem("nr-history", JSON.stringify(next));
    setPage(mode === "truth" ? "truth" : "scam");
  }

  function clearData() {
    localStorage.removeItem("nr-history");
    setHistory([]);
    setResult(null);
    alert("Demo history deleted from this browser.");
  }

  const status = useMemo(() => result ? ({
    high: {title: t.high, cls: "risk-high", icon: "⚠"},
    verify: {title: t.verify, cls: "risk-medium", icon: "◉"},
    low: {title: t.low, cls: "risk-low", icon: "✓"}
  }[result.level]) : null, [result, t]);

  return (
    <div className={lowData ? "app low-data" : "app"}>
      <header className="topbar">
        <div className="brand" onClick={() => setPage("dashboard")}>
          <div className="brand-mark">N</div>
          <div><strong>{t.app}</strong><span>{t.tagline}</span></div>
        </div>
        <div className="top-actions">
          <select value={lang} onChange={e => setLang(e.target.value)} aria-label={t.language}>
            <option value="en">English</option><option value="hi">हिन्दी</option><option value="ta">தமிழ்</option>
          </select>
          <label className="toggle"><input type="checkbox" checked={lowData} onChange={e => setLowData(e.target.checked)}/><span></span>{t.lowData}</label>
        </div>
      </header>

      <main className="shell">
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">PUBLIC-GOOD • PRIVACY-FIRST • INDIA-FIRST</div>
            <h1>{t.welcome}</h1>
            <p>{t.intro}</p>
            <div className="hero-buttons">
              <button className="primary" onClick={() => setPage("scam")}>🛡 {t.checkNow}</button>
              <button className="secondary" onClick={() => runAnalysis(demoMessages.scam)}>▶ {t.tryDemo}</button>
            </div>
            <div className="guardrail">{t.noAdvice}</div>
          </div>
          <div className="hero-card">
            <div className="shield">🛡</div>
            <h3>Safety first</h3>
            <p>Never share OTPs, passwords, PINs or complete card/bank details here.</p>
            <div className="mini-stat"><b>4</b><span>protection layers</span></div>
          </div>
        </section>

        {page === "dashboard" && <Dashboard setPage={setPage} t={t} history={history} />}
        {page === "scam" && <Analyzer title="ScamCheck" subtitle="Paste a suspicious message, SMS, WhatsApp text or URL." input={input} setInput={setInput} result={result} status={status} run={() => runAnalysis(input, "scam")} demos={demoMessages} t={t} />}
        {page === "truth" && <Analyzer title="TruthLens" subtitle="Analyze financial claims for misleading patterns and verification needs." input={input} setInput={setInput} result={result} status={status} run={() => runAnalysis(input, "truth")} demos={demoMessages} t={t} truth />}
        {page === "rights" && <Rights t={t} setPage={setPage} />}
        {page === "help" && <Grievance t={t} />}
        {page === "learn" && <Learn />}
        {page === "privacy" && <Privacy t={t} clearData={clearData} historyCount={history.length} />}
      </main>

      <nav className="bottom-nav">
        {nav.map(([id, icon, label]) => <button key={id} className={page === id ? "active" : ""} onClick={() => setPage(id)}><span>{icon}</span>{label}</button>)}
      </nav>
      <footer>
        <span>© 2026 NiveshRaksha • Prototype</span>
        <button onClick={() => setPage("privacy")}>{t.privacy}</button>
        <button onClick={() => setPage("learn")}>{t.learn}</button>
      </footer>
    </div>
  );
}

function Dashboard({setPage, t, history}) {
  const cards = [
    ["scam","🛡",t.check,"Is this message, link or request suspicious?"],
    ["truth","🔎",t.content,"Understand claims shared through social media and messages."],
    ["rights","⚖",t.rights,"Learn investor protection and complaint basics."],
    ["help","✓",t.help,"Build a safe next-step and evidence checklist."]
  ];
  return <section>
    <div className="section-heading"><div><span className="eyebrow">YOUR SAFETY HUB</span><h2>What do you want to check?</h2></div><span className="pill">Demo • Rule engine active</span></div>
    <div className="feature-grid">
      {cards.map(([id,icon,title,desc]) => <button className="feature-card" key={id} onClick={() => setPage(id)}>
        <div className="feature-icon">{icon}</div><h3>{title}</h3><p>{desc}</p><span className="arrow">→</span>
      </button>)}
    </div>
    <div className="dashboard-grid">
      <div className="panel">
        <div className="panel-title"><span>Recent checks</span><span className="muted">Prototype data</span></div>
        {history.length ? history.slice(0,4).map((x,i)=><div className="history-row" key={i}><span className={`dot ${x.level}`}></span><div><b>{x.mode === "truth" ? "Content analysis" : "Scam check"}</b><small>{x.text.slice(0,65)}{x.text.length>65?"…":""}</small></div><strong>{x.score}/100</strong></div>) : <div className="empty">No checks yet. Try the demo to see the complete flow.</div>}
      </div>
      <div className="panel safety-panel">
        <div className="panel-title">Three safety rules</div>
        <div className="rule"><b>01</b><span>Pause before clicking links or transferring money.</span></div>
        <div className="rule"><b>02</b><span>Verify organizations independently using trusted sources.</span></div>
        <div className="rule"><b>03</b><span>Never share OTPs, passwords or PINs.</span></div>
      </div>
    </div>
  </section>;
}

function Analyzer({title, subtitle, input, setInput, result, status, run, demos, t, truth}) {
  return <section>
    <div className="section-heading"><div><span className="eyebrow">{truth ? "TRACK E • CONTENT LITERACY" : "TRACK A • FRAUD RESILIENCE"}</span><h2>{title}</h2><p>{subtitle}</p></div></div>
    <div className="analyzer">
      <div className="input-panel">
        <label>Paste text or a claim</label>
        <textarea value={input} onChange={e=>setInput(e.target.value)} placeholder={truth ? "Example: Everyone should buy this stock tomorrow because it will definitely double next month." : "Paste a suspicious message here…"} />
        <div className="input-tools"><button className="ghost" onClick={()=>alert("Voice input demo: browser speech recognition can be connected here.")}>🎙 {t.voice}</button><span>Do not enter OTPs, passwords or PINs.</span></div>
        <button className="primary full" onClick={run}>Analyze safely →</button>
        <div className="demo-row"><span>Try a demo:</span><button onClick={()=>setInput(demos.scam)}>Scam</button><button onClick={()=>setInput(demos.misinformation)}>Misinformation</button><button onClick={()=>setInput(demos.safe)}>Educational</button></div>
      </div>
      <div className="result-panel">
        {!result ? <div className="result-empty"><div>🔎</div><h3>Your explanation will appear here</h3><p>We look for risk signals and explain them instead of making an unsupported yes/no claim.</p></div> :
        <div className="result">
          <div className={`risk-banner ${status.cls}`}><span className="risk-icon">{status.icon}</span><div><b>{status.title}</b><small>Educational risk indicator • not a definitive fraud determination</small></div><strong>{result.score}<small>/100</small></strong></div>
          <h3>{t.why}</h3>
          <div className="signal-list">{result.hits.length ? result.hits.map((h,i)=><div className="signal" key={i}><span>!</span><div><b>{h.label}</b><small>Detected signal contributing {h.points} points.</small></div></div>) : <div className="signal safe-signal"><span>✓</span><div><b>No obvious high-risk patterns detected</b><small>This does not prove that the content is safe. Verify independently.</small></div></div>}</div>
          <div className="result-box"><h4>{t.next}</h4><ul><li>Pause before clicking links or transferring money.</li><li>Verify the organization independently through an official source.</li><li>Preserve relevant messages/screenshots if you need to report the issue.</li></ul></div>
          <div className="result-box warning"><h4>{t.avoid}</h4><p>Never share OTPs, passwords, PINs or complete banking/card credentials.</p></div>
          <div className="result-box"><h4>{t.source}</h4><p>Check the claim against official public sources and record the source/date used for verification.</p></div>
        </div>}
      </div>
    </div>
  </section>
}

function Rights({t,setPage}) {
  return <section>
    <div className="section-heading"><div><span className="eyebrow">TRACK B • AWARENESS & GRIEVANCE</span><h2>{t.rights}</h2><p>Simple, non-legal guidance for understanding your options.</p></div></div>
    <div className="rights-grid">
      {[
        ["🧾","Know what happened","Write down what was promised, where you saw it and what communication you received."],
        ["📸","Preserve evidence","Keep screenshots, URLs, emails, transaction records and communication history."],
        ["🔍","Verify independently","Find the organization's official contact details yourself rather than trusting a message."],
        ["📣","Raise a grievance","Use the appropriate official complaint/reporting channel and retain the reference number."]
      ].map(x=><div className="right-card"><span>{x[0]}</span><h3>{x[1]}</h3><p>{x[2]}</p></div>)}
    </div>
    <div className="cta-panel"><div><h3>Not sure what to do next?</h3><p>Use the guided wizard to create a personalized safety and evidence checklist.</p></div><button className="primary" onClick={()=>setPage("help")}>Open Grievance Wizard →</button></div>
  </section>
}

function Grievance({t}) {
  const [step,setStep] = useState(0);
  const questions = [
    ["What happened?",["Suspicious investment message","Money was transferred after suspected fraud","Fake investment scheme","Misleading financial content","Account/service issue"]],
    ["Where did it happen?",["WhatsApp","SMS","Telegram","Social media","Website","App","Phone call"]],
    ["What evidence do you have?",["Screenshot","URL","Transaction record","Email","Phone number","Chat history"]]
  ];
  if (step >= questions.length) return <section><div className="success-card"><div className="success-icon">✓</div><h2>Your safety checklist is ready</h2><p>This is general educational guidance, not legal advice.</p><div className="checklist"><div>✓ Stop further communication with the suspicious party.</div><div>✓ Preserve relevant evidence.</div><div>✓ Do not share additional credentials.</div><div>✓ Verify the concerned entity independently.</div><div>✓ Follow the appropriate official reporting/grievance process.</div><div>✓ Keep your complaint/reference number for follow-up.</div></div><button className="primary" onClick={()=>setStep(0)}>Start Again</button></div></section>;
  return <section><div className="section-heading"><div><span className="eyebrow">GUIDED SAFETY FLOW</span><h2>{t.help}</h2><p>Step {step+1} of {questions.length}</p></div></div><div className="wizard"><div className="progress"><span style={{width:`${((step+1)/questions.length)*100}%`}}></span></div><h2>{questions[step][0]}</h2><div className="option-grid">{questions[step][1].map(o=><button onClick={()=>setStep(step+1)}>{o}<span>→</span></button>)}</div></div></section>
}

function Learn() {
  return <section><div className="section-heading"><div><span className="eyebrow">BUILD RESILIENCE</span><h2>Learn</h2><p>Short lessons for safer digital and financial behavior.</p></div></div><div className="lesson-grid">
    {[
      ["🛡","Spot pressure tactics","Urgency, secrecy and guaranteed returns are common warning signals."],
      ["🔗","Check links safely","Don't rely on links or phone numbers received in unexpected messages."],
      ["🧠","Read claims critically","Separate facts, opinions, predictions and promotional claims."],
      ["📁","Preserve evidence","Screenshots and communication records can help you explain what happened."]
    ].map(x=><article className="lesson"><span>{x[0]}</span><h3>{x[1]}</h3><p>{x[2]}</p><button className="ghost">Read lesson →</button></article>)}
  </div></section>
}

function Privacy({t,clearData,historyCount}) {
  return <section><div className="section-heading"><div><span className="eyebrow">TRUST CENTER</span><h2>{t.privacy}</h2><p>Privacy-by-design for an investor safety tool.</p></div></div><div className="privacy-grid">
    <div className="privacy-card"><span>🔐</span><h3>No credential collection</h3><p>Never enter OTPs, passwords, PINs or complete bank/card credentials into NiveshRaksha.</p></div>
    <div className="privacy-card"><span>🧹</span><h3>Delete analysis history</h3><p>Your prototype history is stored only in this browser. Current saved checks: <b>{historyCount}</b>.</p><button className="danger" onClick={clearData}>{t.delete}</button></div>
    <div className="privacy-card"><span>🤖</span><h3>Explainable AI</h3><p>Results show the patterns detected and communicate uncertainty rather than pretending to be certain.</p></div>
    <div className="privacy-card"><span>🚫</span><h3>No investment promotion</h3><p>The product does not recommend securities, brokers, products or speculative strategies.</p></div>
  </div></section>
}

createRoot(document.getElementById("root")).render(<App />);