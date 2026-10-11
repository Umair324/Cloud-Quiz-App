import { useMemo, useState } from "react";
import JSZip from "jszip"; // npm install jszip

/*
  Cloud Computing Exam Prep (React)
  Usage: put this file in src/, then in main.jsx:  import App from "./CloudExamPrep"
  Upload tab: Claude mode needs your own Anthropic API key (npm i jszip); Offline mode needs nothing.
*/

// Data: MCQ "lec|question|A|B|C|D|correctIndex"; QA "lec|question|answer"
export const MC=[
"L1|Cloud refers to:|A local hard drive|A network or the internet|A printer|A CPU|1",
"L1|Which is NOT a NIST essential characteristic?|On-demand self-service|Resource pooling|Manual provisioning|Measured service|2",
"L1|Multi-tenant model with location independence describes:|Rapid elasticity|Resource pooling|Measured service|Broad network access|1",
"L1|Scaling resources up and down quickly with demand is:|Elasticity|Virtualization|SLA|Federation|0",
"L1|Usage is monitored and reported for transparency in:|Resource pooling|Broad network access|Measured service|Self-service|2",
"L1|Cluster computing nodes are usually:|Heterogeneous|Homogeneous|Over WAN only|Decentralized|1",
"L1|SETI@home is an example of:|Cluster computing|Grid computing|Private cloud|PBX|1",
"L1|Grid computing is:|Tightly coupled|Centrally controlled|Loosely coupled|Always on a LAN|2",
"L1|Which network lets different clouds interoperate?|Intranet|Internet|Intercloud|LAN|2",
"L1|One physical server acting as many virtual servers is:|Virtualization|Federation|Metering|Caching|0",
"L1|A document defining the relationship between provider and customer is:|API|SLA|PBX|QoS|1",
"L1|Greatest customer security responsibility is in:|SaaS|PaaS|IaaS|CaaS|2",
"L1|Thin clients mainly use:|Web browsers|Heavy local software|Mainframes|None|0",
"L1|Cloud services are typically charged:|One-time fixed fee|Pay-as-you-go|Free always|Per employee only|1",
"L1|The number of NIST essential characteristics is:|3|4|5|6|2",
"L2|Time-sharing is called the grandfather of:|Internet|Cloud|PC|Grid|1",
"L2|Who said computing may be organized as a public utility (1961)?|Bill Gates|John McCarthy|Jeff Bezos|Tim Berners-Lee|1",
"L2|First business app delivered fully through a website (1999):|Gmail|Salesforce|Slack|Zoom|1",
"L2|AWS EC2 launched in:|1999|2002|2006|2010|2",
"L2|AWS originated from Amazon's:|Spare server capacity|Phone service|Search engine|Mail server|0",
"L2|The magic sauce of cloud is:|Virtualization|Mainframe|PBX|Bluetooth|0",
"L2|Google App Engine and Azure launched in:|1960s|1980s|2008-2010|2020|2",
"L2|Dumb terminals had:|Full processing power|No processing power|GPUs|Hypervisors|1",
"L3|SaaS software is accessed via:|CD installation|Web browser|Local server only|USB|1",
"L3|SaaS pricing is mostly:|Perpetual licence|Subscription|Free forever|Hardware lease|1",
"L3|Which is a SaaS example?|AWS EC2|Google App Engine|Salesforce|Hypervisor|2",
"L3|A single software instance serving many customers is:|Multi-tenancy|Virtualization|Clustering|Federation|0",
"L3|Which is a SaaS challenge?|Vendor lock-in|Automatic updates|Pay-as-you-go|No installation|0",
"L3|Which is NOT a SaaS benefit?|Lower upfront cost|Full control of infrastructure|Remote access|Automatic updates|1",
"L3|Traditional on-premises software requires:|Manual updates|Subscription|No installation|Device independence|0",
"L3|NetSuite (1998) provided:|Web conferencing|Accounting and ERP|Email|Storage|1",
"L3|In SaaS, who manages the application and infrastructure?|Customer|Provider|Both equally|Nobody|1",
"L4|PaaS is mainly used by:|End users|Developers|Network engineers|Accountants|1",
"L4|PaaS sits between:|SaaS and CaaS|IaaS and SaaS|Public and Private|Cluster and Grid|1",
"L4|Adding more application instances is:|Vertical scaling|Horizontal scaling|Federation|Caching|1",
"L4|Boosting CPU or RAM of an existing instance is:|Horizontal scaling|Vertical scaling|Bursting|Replication|1",
"L4|CI/CD pipelines are used for:|Automated deployment|Billing|Cabling|Voice calls|0",
"L4|Which is a PaaS example?|Gmail|Google App Engine|Zoom|Slack|1",
"L4|Which is a PaaS disadvantage?|Pay-per-use|Limited control|Easy scalability|Team collaboration|1",
"L4|Amazon RDS is an example of:|DbPaaS|MPaaS|CPaaS|SaaS|0",
"L4|Pre-installed runtimes mainly solve:|Billing issues|Configuration and compatibility issues|Hardware cost|Internet speed|1",
"L4|Which PaaS type adds real-time communication to apps?|MPaaS|CPaaS|DbPaaS|Open PaaS|1",
"L5|IaaS provides:|Ready software|Virtualized computing resources|Only APIs|Only voice calls|1",
"L5|Which model gives the most flexibility?|SaaS|PaaS|IaaS|CaaS|2",
"L5|IaaS example:|Gmail|AWS EC2|Salesforce|Zoom|1",
"L5|In IaaS, who manages physical servers?|Customer|Provider|Both|Nobody|1",
"L5|In IaaS the customer manages:|Data centre cooling|OS and applications|Hypervisor|Cables|1",
"L5|EC2 stands for:|Elastic Compute Cloud|Easy Cloud Compute|Extended Cloud Center|Elastic Code Cloud|0",
"L5|Google Compute Engine is:|SaaS|PaaS|IaaS|Community cloud|2",
"L6|CaaS stands for:|Cloud as a Service|Communication as a Service|Computing as a Service|Content as a Service|1",
"L6|Which is a CaaS platform?|Twilio|EC2|App Engine|Oracle DB|0",
"L6|PBX stands for:|Private Branch Exchange|Public Broadband Exchange|Private Bandwidth Extension|Packet Branch Exchange|0",
"L6|VoIP means:|Video over IP|Voice over Internet Protocol|Voice over Intranet Port|Virtual over IP|1",
"L6|Delay between sender and receiver is:|Jitter|Bandwidth|Latency|Packet loss|2",
"L6|Variation in packet delay is:|Jitter|Latency|Bandwidth|QoS|0",
"L6|OTP delivery is an example of:|Messaging service|Video service|Storage|Virtualization|0",
"L6|Which is a CaaS challenge?|Internet dependency|Scalability|Faster deployment|Remote access|0",
"L6|Cloud PBX is managed mainly by:|The organization|The provider|The ISP only|The user device|1",
"L6|Presence information shows:|Bandwidth|Available/busy/away/offline|Packet count|Billing|1",
"L7|A deployment model answers:|What cloud provides|How cloud is organized|Which software to buy|Only pricing|1",
"L7|Which is a deployment model?|IaaS|SaaS|Hybrid|PaaS|2",
"L7|Cloud dedicated to one organization:|Public|Private|Community|Hybrid|1",
"L7|Cloud shared by organizations with common concerns:|Community|Public|Private|None|0",
"L7|Combining private and public cloud gives:|Community cloud|Hybrid cloud|Grid|Cluster|1",
"L7|Cloud bursting takes extra capacity from:|Mainframe|Public cloud|Local PC|PBX|1",
"L7|Which has the highest scalability?|Public|Private|Community|On-premises|0",
"L7|Elasticity means:|Only adding resources|Adding and removing resources with demand|Only security|Only billing|1",
"L7|Service model = ___, deployment model = ___:|HOW / WHAT|WHAT / HOW|WHO / WHERE|WHEN / WHY|1",
"L7|CaaS differs from SaaS because CaaS:|Delivers communication capabilities, often via APIs|Needs no internet|Is a deployment model|Needs no provider|0",
"L7|A bank's dedicated internal cloud is:|Public|Private|Community|Hybrid|1",
"L7|Governance is most complex in:|Public|Community|Private|None|1",
"L7|The apartment-building analogy refers to:|Multi-tenancy|Virtualization|PBX|SLA|0"
];

export const QA=[
"L1|What is cloud? Why do we use it?|Cloud means a network or the internet: remote servers store, manage and access data instead of local drives. Used because own IT infrastructure (server room, engineers, networking) is costly; cloud reduces cost and gives pay-per-use, scalability and access from anywhere.",
"L1|Define cloud computing (NIST).|A model for on-demand network access to a shared pool of configurable computing resources (networks, servers, storage, applications, services) that can be rapidly provisioned and released with minimal management effort.",
"L1|Five essential characteristics of cloud.|On-demand self-service, broad network access, resource pooling (multi-tenant), rapid elasticity, measured service (pay per use).",
"L1|Service models and deployment models.|IaaS = infrastructure (e.g. AWS EC2); PaaS = platform for building apps (e.g. Google App Engine); SaaS = ready software via browser (e.g. Gmail). Deployment models: Public, Private, Community, Hybrid.",
"L1|Cloud architecture.|Front end (thin/fat clients) + back end (servers and storage) + delivery network (Internet, Intranet, Intercloud). Layers: applications, middleware, virtual machines, OS/hypervisor, hardware, with security and management across all.",
"L1|Cluster vs grid computing.|Cluster: identical nodes, LAN, central control, tightly coupled. Grid: different nodes, Internet, distributed control, loosely coupled (e.g. SETI@home).",
"L2|Explain the history of cloud.|Mainframes and time-sharing (1950s-60s) > McCarthy's utility computing idea (1961) > client-server and distributed computing (1980s-90s) > Salesforce SaaS (1999) > AWS (2002), EC2 (2006) > Google App Engine and Azure (2008-10).",
"L2|Which technologies made cloud possible?|Virtualization (one server acts as many), grid computing (many servers as one pool) and high-speed internet.",
"L3|What is SaaS?|Cloud-hosted software accessed through a browser on subscription or pay-per-use, with no installation. Examples: Gmail, Salesforce, Slack.",
"L3|Features of SaaS.|Web access, on-demand availability, usage-based payment, minimal IT effort, multi-tenancy, scalability, easy integration through APIs.",
"L3|SaaS vs PaaS vs IaaS.|SaaS gives a finished app to end users; PaaS gives a development platform to developers; IaaS gives virtual infrastructure with most control to IT admins.",
"L3|SaaS vs on-premises software.|On-premises: buy licence, install locally, manual updates, high upfront cost. SaaS: subscription, no installation, automatic updates, pay as you use.",
"L3|Challenges of SaaS.|Internet dependency, data privacy concerns, limited customization, vendor lock-in. Convenience increases, control decreases.",
"L3|What is multi-tenancy?|A single software instance serves many customers (tenants) while their data stays separate, like an apartment building with private flats.",
"L4|What is PaaS?|A ready environment for developers to build, test and deploy apps without managing servers, storage, networking or OS. It sits between IaaS and SaaS.",
"L4|How does PaaS work?|Provider handles infrastructure; offers OS, runtimes, middleware and dev tools; automates testing and deployment (CI/CD); scales automatically; provides database/API integration, security, monitoring and pay-as-you-go pricing.",
"L4|Advantages of PaaS.|Fast development, lower cost, easy scaling, team collaboration, focus on coding instead of infrastructure.",
"L4|Disadvantages of PaaS.|Limited customization and control, performance limits, vendor lock-in, learning curve, security and compliance concerns.",
"L4|PaaS services and examples.|Dev tools, testing and deployment, database and web service integration, scalability, monitoring. Examples: Google App Engine, Azure, AWS SageMaker, Amazon RDS.",
"L5|What is IaaS?|Provider delivers servers, storage, networking and virtualization over the internet; user controls OS, applications and data. Maximum flexibility, e.g. AWS EC2. (Only partly from slides; check your notes.)",
"L5|Responsibilities in IaaS.|Provider: physical servers, storage, network, virtualization. Customer: OS, applications, data, security settings.",
"L5|Six core components of IaaS (textbook).|Compute, storage, networking, virtualization, data centres/hardware, management and security tools. Verify with your notes.",
"L6|What is CaaS?|Cloud delivery of communication services (voice, video, messaging, conferencing), paid by usage. Examples: Twilio, Zoom, Teams.",
"L6|Evolution and how CaaS works.|Physical phones and PBX hardware (costly, hard to scale) became cloud-hosted communication with Cloud PBX and APIs. Device sends voice/video/text over the internet, the cloud platform processes and routes it, the recipient receives it.",
"L6|What is VoIP?|Voice is converted to digital packets, sent over an IP network and rebuilt at the receiver. Quality depends on latency, jitter and packet loss.",
"L6|Advantages and challenges of CaaS.|Advantages: low cost, scalable, remote access, fast deployment. Challenges: internet dependency, latency, jitter, packet loss, security and privacy.",
"L7|CaaS vs SaaS.|SaaS delivers a complete application; CaaS delivers communication capabilities (voice, video, messaging) usable as an app or embedded through APIs.",
"L7|What is a CaaS API?|An interface that lets applications use communication functions (SMS, calls, OTP) without building the infrastructure, e.g. a bank app sending an OTP.",
"L7|Deployment model vs service model.|Deployment model = how cloud is organized and owned (Public, Private, Community, Hybrid). Service model = what cloud provides (IaaS, PaaS, SaaS).",
"L7|Explain the four deployment models.|Public: provider-owned, many customers, low cost, high scalability, less control. Private: one organization, high control, costly. Community: shared by organizations with common needs, shared cost, complex governance. Hybrid: private + public combined; cloud bursting adds public capacity at peak.",
"L7|Comparison of deployment models.|Users: Public many, Private one organization, Community a group, Hybrid mixed. Control: lower / high / shared / varies. Initial cost: lower / higher / shared / varies. Scalability: very high / limited by capacity / depends / high."
];

const LN = {
  L1: "Lecture 1 - Intro to Cloud", L2: "Lecture 2 - History", L3: "Lecture 3 - SaaS",
  L4: "Lecture 4 - PaaS", L5: "Lecture 5 - IaaS", L6: "Lecture 6 - CaaS",
  L7: "Lecture 7 - Deployment Models",
};

const parseMC = (s) => { const p = s.split("|"); return { l: p[0], q: p[1], o: p.slice(2, 6), a: +p[6] }; };
const parseQA = (s) => { const p = s.split("|"); return { l: p[0], q: p[1], a: p.slice(2).join("|") }; };
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };

const MODEL = "claude-sonnet-5-5";

// Returns an array of slides; each slide is an array of text lines (one per paragraph).
async function extractSlides(file) {
  const z = await JSZip.loadAsync(file);
  const num = (n) => parseInt(n.match(/\d+/)[0], 10);
  const dec = (t) => t.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'");
  const names = Object.keys(z.files).filter((n) => /^ppt\/slides\/slide\d+\.xml$/.test(n)).sort((a, b) => num(a) - num(b));
  const slides = [];
  for (const n of names) {
    const xml = await z.file(n).async("string");
    const lines = xml.split("</a:p>")
      .map((para) => [...para.matchAll(/<a:t>([^<]*)<\/a:t>/g)].map((m) => dec(m[1])).join("").trim())
      .filter(Boolean);
    if (lines.length) slides.push(lines);
  }
  return slides;
}

const slidesToText = (slides) => slides.map((l, i) => `Slide ${i + 1}: ${l.join(" | ")}`).join("\n");
const short = (t, n) => (t.length > n ? t.slice(0, n - 1).trimEnd() + "..." : t);

// Mode 1: Claude API. The key is typed by the user and kept only in memory. Personal use only:
// a key placed in browser code can be read by anyone using the page.
async function generateWithClaude(text, key) {
  const prompt =
    "You are creating exam prep from lecture slides. Slide text:\n" + text.slice(0, 14000) +
    '\n\nReturn ONLY valid JSON: {"mcqs":[{"q":string,"o":[4 short strings],"a":index 0-3}],"qa":[{"q":string,"a":string}]}. ' +
    "Write as many good MCQs as the content supports (up to 40) with plausible wrong options, and up to 15 short conceptual answers (2-4 lines). Use only facts from the slides.";
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({ model: MODEL, max_tokens: 8000, messages: [{ role: "user", content: prompt }] }),
  });
  if (!r.ok) throw new Error("Claude API error " + r.status + " (check your API key)");
  const d = await r.json();
  const out = d.content.map((c) => c.text || "").join("").replace(/```json|```/g, "").trim();
  return JSON.parse(out);
}

// Mode 2: offline, no key. Finds "Term: definition" and "Term is ..." lines and builds simple questions.
function generateOffline(slides) {
  const pairs = [];
  const seen = new Set();
  for (const lines of slides) {
    for (const raw of lines) {
      const line = raw.replace(/^[\d.\-\s)]+/, "").trim();
      let m = line.match(/^([^:]{3,45}):\s*(.{25,})$/);
      if (!m) m = line.match(/^((?:[A-Z][\w\/&'-]*\s?){1,5}?)\s+(?:is|are|refers to|means)\s+(.{25,})$/);
      if (!m) continue;
      const t = m[1].trim(), d = m[2].trim();
      if (t.split(/\s+/).length > 6 || seen.has(t.toLowerCase())) continue;
      seen.add(t.toLowerCase());
      pairs.push({ t, d });
    }
  }
  const qa = pairs.slice(0, 40).map((p) => ({ q: `Explain: ${p.t}`, a: short(p.d, 400) }));
  const mcqs = [];
  if (pairs.length >= 4) {
    pairs.forEach((p, i) => {
      const others = shuffle(pairs.filter((_, j) => j !== i));
      const o1 = shuffle([p.t, ...others.slice(0, 3).map((x) => x.t)]);
      mcqs.push({ q: `Which term matches this description? "${short(p.d, 140)}"`, o: o1, a: o1.indexOf(p.t) });
      const right = short(p.d, 90);
      const o2 = shuffle([right, ...others.slice(0, 3).map((x) => short(x.d, 90))]);
      mcqs.push({ q: `Which statement best describes "${p.t}"?`, o: o2, a: o2.indexOf(right) });
    });
  }
  return { mcqs, qa };
}

function Home({ go, nQA, nMC }) {
  return (
    <>
      <h1>Cloud Computing Exam Prep</h1>
      <p className="mu">Practice for your midterm, built from your lecture slides.</p>
      <div className="grid">
        <button className="card big" onClick={() => go("written")}>Written<small>Conceptual answers ({nQA})</small></button>
        <button className="card big" onClick={() => go("setup")}>MCQ Practice<small>{nMC} questions with instant feedback and score</small></button>
        <button className="card big" onClick={() => go("upload")}>Upload slides<small>Generate new MCQs and answers from a .pptx</small></button>
      </div>
    </>
  );
}

function Written({ qa, keys, lab }) {
  const [f, setF] = useState("*");
  return (
    <>
      <h1>Written answers</h1>
      <div className="row">
        <select value={f} onChange={(e) => setF(e.target.value)}>
          <option value="*">All lectures</option>
          {keys.map((k) => <option key={k} value={k}>{lab(k)}</option>)}
        </select>
      </div>
      {keys.filter((k) => f === "*" || k === f).map((k) => (
        <div key={k}>
          <h2>{lab(k)}</h2>
          {qa.filter((x) => x.l === k).map((x, i) => (
            <details key={i}><summary>{x.q}</summary><p>{x.a}</p></details>
          ))}
        </div>
      ))}
    </>
  );
}

function Setup({ keys, onStart, lab }) {
  const [f, setF] = useState("*");
  return (
    <>
      <h1>MCQ Practice</h1>
      <p className="mu">Pick a lecture, then tap an option. Green = correct, red = wrong.</p>
      <div className="row">
        <select value={f} onChange={(e) => setF(e.target.value)}>
          <option value="*">All lectures</option>
          {keys.map((k) => <option key={k} value={k}>{lab(k)}</option>)}
        </select>
        <button className="btn" onClick={() => onStart(f)}>Start</button>
      </div>
    </>
  );
}

function Quiz({ pool, onRetry, onChange }) {
  const [qs] = useState(() => shuffle(pool));
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState([]);
  const [picked, setPicked] = useState(null);
  const [done, setDone] = useState(false);
  const n = qs.length;

  if (done) {
    const p = Math.round((score / n) * 100);
    return (
      <>
        <h1>Result</h1>
        <div className="score">{score} / {n}</div>
        <p className="mu" style={{ textAlign: "center" }}>{p}% - {p >= 80 ? "Excellent!" : p >= 60 ? "Good, keep practising." : "Revise the weak lectures and retry."}</p>
        <div className="row" style={{ justifyContent: "center" }}>
          <button className="btn" onClick={() => onRetry(qs)}>Retry all</button>
          {wrong.length > 0 && <button className="btn ghost" onClick={() => onRetry(wrong)}>Retry wrong ({wrong.length})</button>}
          <button className="btn ghost" onClick={onChange}>Change lecture</button>
        </div>
      </>
    );
  }

  const q = qs[i];
  const answered = picked !== null;
  const choose = (k) => {
    if (answered) return;
    setPicked(k);
    if (k === q.a) setScore((s) => s + 1); else setWrong((w) => [...w, q]);
  };
  const next = () => { if (i === n - 1) setDone(true); else { setI(i + 1); setPicked(null); } };

  return (
    <>
      <div className="top"><span>Question {i + 1} / {n}</span><span>Score: {score}</span></div>
      <div className="bar"><i style={{ width: `${(i / n) * 100}%` }} /></div>
      <h2>{q.q}</h2>
      {q.o.map((o, k) => {
        let cls = "opt";
        if (answered && k === q.a) cls += " ok";
        else if (answered && k === picked) cls += " no";
        return <button key={k} className={cls} disabled={answered} onClick={() => choose(k)}>{o}</button>;
      })}
      {answered && (
        <div>
          <p><b style={{ color: `var(--${picked === q.a ? "ok" : "no"})` }}>{picked === q.a ? "Correct!" : "Wrong - the correct answer is shown in green."}</b></p>
          <button className="btn" onClick={next}>{i === n - 1 ? "See result" : "Next"}</button>
        </div>
      )}
    </>
  );
}

function Upload({ onAdd }) {
  const [file, setFile] = useState(null);
  const [mode, setMode] = useState("claude");
  const [key, setKey] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  const run = async () => {
    if (!file) return setStatus("Please choose a .pptx file first.");
    if (!/\.pptx$/i.test(file.name)) return setStatus("Only .pptx files are supported (save older .ppt files as .pptx).");
    if (mode === "claude" && !key.trim()) return setStatus("Paste your Anthropic API key, or switch to Offline mode.");
    setBusy(true); setStatus("Reading slides...");
    try {
      const slides = await extractSlides(file);
      if (slides.flat().join(" ").length < 80) throw new Error("Not enough text found in these slides (they may be images).");
      let r;
      if (mode === "claude") { setStatus("Asking Claude to write questions (30-60 seconds)..."); r = await generateWithClaude(slidesToText(slides), key.trim()); }
      else r = generateOffline(slides);
      const mcqs = (r.mcqs || []).filter((x) => x && x.q && Array.isArray(x.o) && x.o.length === 4 && x.a >= 0 && x.a < 4)
        .map((x) => ({ l: "U", q: String(x.q), o: x.o.map(String), a: +x.a }));
      const qas = (r.qa || []).filter((x) => x && x.q && x.a).map((x) => ({ l: "U", q: String(x.q), a: String(x.a) }));
      if (!mcqs.length && !qas.length) throw new Error("No questions could be made from this file. Try Claude mode.");
      onAdd(mcqs, qas, file.name);
      setStatus(`Added ${mcqs.length} MCQs and ${qas.length} written answers as its own option "${file.name}". Go Home to practise it.`);
    } catch (e) {
      setStatus("Could not generate: " + (e.message || "unknown error"));
    }
    setBusy(false);
  };

  return (
    <>
      <h1>Upload slides</h1>
      <p className="mu">Choose a .pptx file. Text is read in your browser.</p>
      <div className="row">
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="claude">Claude (best quality, needs API key)</option>
          <option value="offline">Offline (basic, no key)</option>
        </select>
      </div>
      {mode === "claude" && (
        <div className="row">
          <input type="password" placeholder="Anthropic API key (kept only in this tab)" value={key} onChange={(e) => setKey(e.target.value)} style={{ width: "100%", padding: 9 }} />
        </div>
      )}
      <div className="row">
        <input type="file" accept=".pptx" onChange={(e) => setFile(e.target.files[0] || null)} />
        <button className="btn" disabled={busy} onClick={run}>Generate</button>
      </div>
      <p className="mu">{status}</p>
      <p className="mu" style={{ fontSize: ".85rem" }}>Offline mode only finds "Term: definition" style lines, so it makes fewer, simpler questions. Use your own key on your own computer only.</p>
    </>
  );
}

export default function CloudExamPrep() {
  const [mcq, setMcq] = useState(() => MC.map(parseMC));
  const [qa, setQa] = useState(() => QA.map(parseQA));
  const [uploads, setUploads] = useState({}); // id -> file name
  const [view, setView] = useState("home");
  const [pool, setPool] = useState([]);
  const [runId, setRunId] = useState(0);

  const lab = (k) => LN[k] || uploads[k] || k;

  const keys = useMemo(
    () => [...Object.keys(LN), ...Object.keys(uploads)].filter((k) => mcq.some((x) => x.l === k) || qa.some((x) => x.l === k)),
    [mcq, qa, uploads]
  );

  // Each uploaded file becomes its own set. Uploading the same file name again replaces that set.
  const addUpload = (m, q, name) => {
    const id = Object.keys(uploads).find((k) => uploads[k] === name) || "U" + Date.now();
    setUploads((u) => ({ ...u, [id]: name }));
    setMcq((a) => [...a.filter((x) => x.l !== id), ...m.map((x) => ({ ...x, l: id }))]);
    setQa((a) => [...a.filter((x) => x.l !== id), ...q.map((x) => ({ ...x, l: id }))]);
  };

  const startQuiz = (p) => {
    if (!p.length) return alert("No questions here yet.");
    setPool(p); setRunId((r) => r + 1); setView("quiz");
  };

  return (
    <div className="app">
      <style>{CSS}</style>
      {view !== "home" && <a className="back" onClick={() => setView("home")}>&larr; Home</a>}
      {view === "home" && <Home go={setView} nQA={qa.length} nMC={mcq.length} />}
      {view === "written" && <Written qa={qa} keys={keys} lab={lab} />}
      {view === "setup" && <Setup keys={keys} lab={lab} onStart={(f) => startQuiz(mcq.filter((x) => f === "*" || x.l === f))} />}
      {view === "quiz" && <Quiz key={runId} pool={pool} onRetry={startQuiz} onChange={() => setView("setup")} />}
      {view === "upload" && <Upload onAdd={addUpload} />}
    </div>
  );
}

const CSS = `
:root{--bg:#f4f6fb;--card:#fff;--tx:#1b1f2a;--mu:#5d6577;--bd:#d9deea;--ac:#3b5bdb;--ok:#2b8a3e;--okb:#d3f9d8;--no:#c92a2a;--nob:#ffe0e0;box-sizing:border-box;padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#13161d;--card:#1d212b;--tx:#eef0f6;--mu:#9aa3b5;--bd:#323848;--ac:#7c9bff;--ok:#69db7c;--okb:#17381f;--no:#ff8787;--nob:#432024}}
:root[data-theme="dark"]{--bg:#13161d;--card:#1d212b;--tx:#eef0f6;--mu:#9aa3b5;--bd:#323848;--ac:#7c9bff;--ok:#69db7c;--okb:#17381f;--no:#ff8787;--nob:#432024}
html{scroll-padding-top:env(safe-area-inset-top,0px)}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--tx);font:16px/1.5 system-ui,-apple-system,Segoe UI,Roboto,sans-serif}
.app{max-width:720px;margin:0 auto;padding:18px 14px 40px}
h1{font-size:1.5rem;margin:.2em 0}h2{font-size:1.15rem;margin:1.2em 0 .4em}
.mu{color:var(--mu)}
button,select{font:inherit;color:var(--tx)}
.grid{display:grid;gap:12px;margin-top:18px}
.card{background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:14px;text-align:left;width:100%}
.big{font-size:1.1rem;font-weight:600;cursor:pointer}
.big small{display:block;font-weight:400;color:var(--mu);margin-top:2px}
.btn{background:var(--ac);color:#fff;border:0;border-radius:10px;padding:10px 16px;cursor:pointer;font-weight:600}
.btn.ghost{background:transparent;color:var(--ac);border:1px solid var(--bd)}
.btn:disabled{opacity:.5}
.row{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin:12px 0}
select{background:var(--card);border:1px solid var(--bd);border-radius:10px;padding:9px;max-width:100%}
.opt{display:block;width:100%;text-align:left;background:var(--card);border:2px solid var(--bd);border-radius:12px;padding:12px;margin:8px 0;cursor:pointer}
.opt:hover:not(:disabled){border-color:var(--ac)}
.opt.ok{background:var(--okb);border-color:var(--ok)}
.opt.no{background:var(--nob);border-color:var(--no)}
.bar{height:8px;background:var(--bd);border-radius:6px;overflow:hidden}
.bar i{display:block;height:100%;background:var(--ac)}
.top{display:flex;justify-content:space-between;margin:10px 0 6px;font-weight:600}
details{background:var(--card);border:1px solid var(--bd);border-radius:12px;padding:10px 12px;margin:8px 0}
summary{cursor:pointer;font-weight:600}
details p{margin:.6em 0 .2em;color:var(--tx)}
.score{font-size:2.4rem;font-weight:800;text-align:center;margin:10px 0}
a.back{color:var(--ac);cursor:pointer;font-size:.95rem}
`;