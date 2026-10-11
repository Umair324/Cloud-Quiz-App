import { useMemo, useState } from "react";
import JSZip from "jszip"; // npm install jszip

/*
  Cloud Computing Exam Prep (React)
  Question types: MCQ, True/False, Fill in the blanks (mixed in one quiz).
  Upload tab: Claude mode needs your own Anthropic API key; Offline mode needs nothing.
*/

// MCQ "lec|question|A|B|C|D|correctIndex"; TF "lec|statement|T or F"; FIB "lec|sentence with ____|answer (/ for alternatives)"; QA "lec|question|answer"
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

export const TF=[
"L1|Cloud computing requires the provider to manually set up every request.|F",
"L1|Grid computing is loosely coupled and can span the Internet.|T",
"L2|AWS EC2 was launched in 2006.|T",
"L2|Salesforce delivered the first business app through a website in 1999.|T",
"L3|In SaaS the customer manages the infrastructure.|F",
"L3|Multi-tenancy means a single software instance serves many customers.|T",
"L4|PaaS is mainly used by end users rather than developers.|F",
"L4|Adding more application instances is called horizontal scaling.|T",
"L5|In IaaS the provider manages the customer's OS and applications.|F",
"L5|IaaS gives the most flexibility among the three service models.|T",
"L6|Jitter is the variation in packet delay.|T",
"L6|CaaS stands for Cloud as a Service.|F",
"L7|A private cloud is dedicated to one organization.|T",
"L7|Public cloud has the lowest scalability of all deployment models.|F"
];

export const FIB=[
"L1|The NIST definition lists ____ essential characteristics.|five/5",
"L1|One physical server acting as many virtual servers is called ____.|virtualization",
"L2|Time-sharing is called the grandfather of ____ computing.|cloud",
"L2|AWS originated from Amazon's ____ server capacity.|spare",
"L3|SaaS software is usually paid for by ____.|subscription",
"L3|Gmail and Salesforce are examples of ____.|SaaS",
"L4|PaaS is mainly used by ____.|developers",
"L4|Boosting the CPU or RAM of an existing instance is ____ scaling.|vertical",
"L5|EC2 stands for Elastic ____ Cloud.|compute",
"L5|In IaaS the ____ manages the physical servers.|provider",
"L6|PBX stands for Private Branch ____.|exchange",
"L6|The delay between sender and receiver is called ____.|latency",
"L7|Combining private and public cloud gives a ____ cloud.|hybrid",
"L7|Cloud ____ takes extra capacity from the public cloud at peak times.|bursting"
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

const TYPE_LABEL = { mcq: "MCQ", tf: "True / False", fib: "Fill in the blank" };
const TF_OPTIONS = ["True", "False"];

// Every question: { t: "mcq"|"tf"|"fib", l, q, o?, a }
const parseMC = (s) => { const p = s.split("|"); return { t: "mcq", l: p[0], q: p[1], o: p.slice(2, 6), a: +p[6] }; };
const parseTF = (s) => { const p = s.split("|"); return { t: "tf", l: p[0], q: p[1], o: TF_OPTIONS, a: p[2] === "T" ? 0 : 1 }; };
const parseFIB = (s) => { const p = s.split("|"); return { t: "fib", l: p[0], q: p[1], a: p[2] }; };
const parseQA = (s) => { const p = s.split("|"); return { l: p[0], q: p[1], a: p.slice(2).join("|") }; };
const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };
const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, "");
const fibCorrect = (typed, answer) => answer.split("/").some((x) => norm(x) === norm(typed));

const MODEL = "claude-sonnet-5-5";

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

// Mode 1: Claude API (personal use only: a key in browser code can be read by anyone using the page).
async function generateWithClaude(text, key) {
  const prompt =
    "You are creating exam prep from lecture slides. Slide text:\n" + text.slice(0, 14000) +
    '\n\nReturn ONLY valid JSON in exactly this shape: {"mcqs":[{"q":string,"o":[4 short strings],"a":index 0-3}],' +
    '"tf":[{"q":string,"a":true or false}],"fib":[{"q":string containing one ____ blank,"a":string}],"qa":[{"q":string,"a":string}]}. ' +
    "Write a MIX of question types: about 20 MCQs with plausible wrong options, about 12 true/false statements (roughly half false, " +
    "make false ones by changing one key fact), about 12 fill-in-the-blank sentences (the blank must be ONE key term or number, " +
    "answer is 1-3 words; if two spellings are acceptable separate them with /), and up to 10 short conceptual answers (2-4 lines). " +
    "Use only facts from the slides.";
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

// Mode 2: offline, no key. Builds MCQ, True/False and Fill-in-the-blank from "Term: definition" lines.
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
  const mcqs = [], tf = [], fib = [];
  pairs.forEach((p) => { fib.push({ q: `____ : ${short(p.d, 160)}`, a: p.t }); });
  if (pairs.length >= 4) {
    pairs.forEach((p, i) => {
      const others = shuffle(pairs.filter((_, j) => j !== i));
      const o1 = shuffle([p.t, ...others.slice(0, 3).map((x) => x.t)]);
      mcqs.push({ q: `Which term matches this description? "${short(p.d, 140)}"`, o: o1, a: o1.indexOf(p.t) });
      const right = short(p.d, 90);
      const o2 = shuffle([right, ...others.slice(0, 3).map((x) => short(x.d, 90))]);
      mcqs.push({ q: `Which statement best describes "${p.t}"?`, o: o2, a: o2.indexOf(right) });
      if (i % 2 === 0) tf.push({ q: `${p.t}: ${short(p.d, 140)}`, a: true });
      else tf.push({ q: `${p.t}: ${short(others[0].d, 140)}`, a: false });
    });
  }
  return { mcqs, tf, fib, qa };
}

function Home({ go, nQA, nQ }) {
  return (
    <>
      <h1>Cloud Computing Exam Prep</h1>
      <p className="mu">Practice for your midterm, built from your lecture slides.</p>
      <div className="grid">
        <button className="card big" onClick={() => go("written")}>Written<small>Conceptual answers ({nQA})</small></button>
        <button className="card big" onClick={() => go("setup")}>Quiz Practice<small>{nQ} questions: MCQ, True/False, Fill in the blanks</small></button>
        <button className="card big" onClick={() => go("upload")}>Upload slides<small>Generate a mixed quiz from a .pptx</small></button>
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
  const [type, setType] = useState("*");
  return (
    <>
      <h1>Quiz Practice</h1>
      <p className="mu">Pick a lecture and a question type. Green = correct, red = wrong.</p>
      <div className="row">
        <select value={f} onChange={(e) => setF(e.target.value)}>
          <option value="*">All lectures</option>
          {keys.map((k) => <option key={k} value={k}>{lab(k)}</option>)}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="*">Mixed (all types)</option>
          <option value="mcq">MCQ only</option>
          <option value="tf">True / False only</option>
          <option value="fib">Fill in the blanks only</option>
        </select>
        <button className="btn" onClick={() => onStart(f, type)}>Start</button>
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
  const [typed, setTyped] = useState("");
  const [fibOk, setFibOk] = useState(null);
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
  const isFib = q.t === "fib";
  const answered = isFib ? fibOk !== null : picked !== null;
  const correct = isFib ? fibOk === true : picked === q.a;

  const record = (ok) => { if (ok) setScore((s) => s + 1); else setWrong((w) => [...w, q]); };
  const choose = (k) => { if (answered) return; setPicked(k); record(k === q.a); };
  const check = () => {
    if (answered || !typed.trim()) return;
    const ok = fibCorrect(typed, q.a);
    setFibOk(ok); record(ok);
  };
  const next = () => {
    if (i === n - 1) setDone(true);
    else { setI(i + 1); setPicked(null); setTyped(""); setFibOk(null); }
  };

  return (
    <>
      <div className="top"><span>Question {i + 1} / {n}</span><span>Score: {score}</span></div>
      <div className="bar"><i style={{ width: `${(i / n) * 100}%` }} /></div>
      <span className="tag">{TYPE_LABEL[q.t] || "MCQ"}</span>
      <h2>{q.q}</h2>

      {!isFib && q.o.map((o, k) => {
        let cls = "opt";
        if (answered && k === q.a) cls += " ok";
        else if (answered && k === picked) cls += " no";
        return <button key={k} className={cls} disabled={answered} onClick={() => choose(k)}>{o}</button>;
      })}

      {isFib && (
        <div className="row">
          <input
            className={"fib" + (answered ? (fibOk ? " ok" : " no") : "")}
            type="text"
            placeholder="Type your answer"
            value={typed}
            disabled={answered}
            autoFocus
            onChange={(e) => setTyped(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") check(); }}
          />
          {!answered && <button className="btn" onClick={check}>Check</button>}
        </div>
      )}

      {answered && (
        <div>
          <p>
            <b style={{ color: `var(--${correct ? "ok" : "no"})` }}>
              {correct ? "Correct!" : isFib ? "Wrong." : "Wrong - the correct answer is shown in green."}
            </b>
            {isFib && !correct && <> Correct answer: <b>{q.a.split("/")[0]}</b></>}
          </p>
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
        .map((x) => ({ t: "mcq", q: String(x.q), o: x.o.map(String), a: +x.a }));
      const tfs = (r.tf || []).filter((x) => x && x.q && (x.a === true || x.a === false || x.a === "true" || x.a === "false"))
        .map((x) => ({ t: "tf", q: String(x.q), o: TF_OPTIONS, a: (x.a === true || x.a === "true") ? 0 : 1 }));
      const fibs = (r.fib || []).filter((x) => x && x.q && x.a && String(x.q).includes("__"))
        .map((x) => ({ t: "fib", q: String(x.q), a: String(x.a) }));
      const qas = (r.qa || []).filter((x) => x && x.q && x.a).map((x) => ({ q: String(x.q), a: String(x.a) }));

      const items = [...mcqs, ...tfs, ...fibs];
      if (!items.length && !qas.length) throw new Error("No questions could be made from this file. Try Claude mode.");
      onAdd(items, qas, file.name);
      setStatus(`Added ${mcqs.length} MCQs, ${tfs.length} True/False, ${fibs.length} Fill-in-the-blank and ${qas.length} written answers as its own option "${file.name}". Go Home to practise it.`);
    } catch (e) {
      setStatus("Could not generate: " + (e.message || "unknown error"));
    }
    setBusy(false);
  };

  return (
    <>
      <h1>Upload slides</h1>
      <p className="mu">Choose a .pptx file. Text is read in your browser. You get a mix of MCQs, True/False and Fill in the blanks.</p>
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
  const [qs, setQs] = useState(() => [...MC.map(parseMC), ...TF.map(parseTF), ...FIB.map(parseFIB)]);
  const [qa, setQa] = useState(() => QA.map(parseQA));
  const [uploads, setUploads] = useState({});
  const [view, setView] = useState("home");
  const [pool, setPool] = useState([]);
  const [runId, setRunId] = useState(0);

  const lab = (k) => LN[k] || uploads[k] || k;

  const keys = useMemo(
    () => [...Object.keys(LN), ...Object.keys(uploads)].filter((k) => qs.some((x) => x.l === k) || qa.some((x) => x.l === k)),
    [qs, qa, uploads]
  );

  const addUpload = (items, q, name) => {
    const id = Object.keys(uploads).find((k) => uploads[k] === name) || "U" + Date.now();
    setUploads((u) => ({ ...u, [id]: name }));
    setQs((a) => [...a.filter((x) => x.l !== id), ...items.map((x) => ({ ...x, l: id }))]);
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
      {view === "home" && <Home go={setView} nQA={qa.length} nQ={qs.length} />}
      {view === "written" && <Written qa={qa} keys={keys} lab={lab} />}
      {view === "setup" && <Setup keys={keys} lab={lab} onStart={(f, type) => startQuiz(qs.filter((x) => (f === "*" || x.l === f) && (type === "*" || x.t === type)))} />}
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
h1{font-size:1.5rem;margin:.2em 0}h2{font-size:1.15rem;margin:.5em 0 .4em}
.mu{color:var(--mu)}
button,select,input{font:inherit;color:var(--tx)}
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
.fib{flex:1;min-width:200px;background:var(--card);border:2px solid var(--bd);border-radius:12px;padding:12px}
.fib:focus{outline:none;border-color:var(--ac)}
.fib.ok{background:var(--okb);border-color:var(--ok)}
.fib.no{background:var(--nob);border-color:var(--no)}
.tag{display:inline-block;margin-top:10px;font-size:.75rem;font-weight:700;letter-spacing:.03em;text-transform:uppercase;color:var(--ac);border:1px solid var(--bd);border-radius:999px;padding:2px 10px}
.bar{height:8px;background:var(--bd);border-radius:6px;overflow:hidden}
.bar i{display:block;height:100%;background:var(--ac)}
.top{display:flex;justify-content:space-between;margin:10px 0 6px;font-weight:600}
details{background:var(--card);border:1px solid var(--bd);border-radius:12px;padding:10px 12px;margin:8px 0}
summary{cursor:pointer;font-weight:600}
details p{margin:.6em 0 .2em;color:var(--tx)}
.score{font-size:2.4rem;font-weight:800;text-align:center;margin:10px 0}
a.back{color:var(--ac);cursor:pointer;font-size:.95rem}
`;