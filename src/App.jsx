import { useState, useEffect, useCallback } from "react";

const HF_URL = "https://api-inference.huggingface.co/v1/chat/completions";
const HF_MODEL = "Qwen/Qwen2.5-72B-Instruct";

const INIT = {
    header: {
        name: "Lorem Ipsum",
        id: "Lorem Ipsum",
        institution: "Lorem Ipsum",
        linkedin: "linkedin.com/in/lorem-ipsum",
        github: "github.com/lorem-ipsum",
    },
    education: [
        { program: "Lorem Ipsum", institution: "Lorem Ipsum", cgpa: "Lorem Ipsum", year: "Lorem Ipsum" },
        { program: "Lorem Ipsum", institution: "Lorem Ipsum", cgpa: "Lorem Ipsum", year: "Lorem Ipsum" },
        { program: "Lorem Ipsum", institution: "Lorem Ipsum", cgpa: "Lorem Ipsum", year: "Lorem Ipsum" },
    ],
    achievements: [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
    ],
    experience: [
        {
            title: "Lorem Ipsum — Lorem Ipsum",
            period: "Lorem Ipsum",
            bullets: [
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
                "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            ],
        },
        {
            title: "Lorem Ipsum — Lorem Ipsum",
            period: "Lorem Ipsum",
            bullets: [
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
                "Incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
            ],
        },
    ],
    projects: [
        {
            title: "Lorem Ipsum",
            github: "https://github.com/lorem",
            period: "Lorem Ipsum",
            bullets: [
                "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
                "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            ],
        },
        {
            title: "Lorem Ipsum",
            github: "https://github.com/ipsum",
            period: "Lorem Ipsum",
            bullets: [
                "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
                "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            ],
        },
    ],
    coursework: [
        "Lorem Ipsum", "Lorem Ipsum", "Lorem Ipsum",
        "Lorem Ipsum", "Lorem Ipsum", "Lorem Ipsum",
        "Lorem Ipsum", "Lorem Ipsum", "Lorem Ipsum",
    ],
    positions: [
        { title: "Lorem Ipsum — Lorem Ipsum", period: "Lorem Ipsum", bullets: ["Lorem ipsum dolor sit amet, consectetur adipiscing elit."] },
        { title: "Lorem Ipsum — Lorem Ipsum", period: "Lorem Ipsum", bullets: ["Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."] },
        { title: "Lorem Ipsum — Lorem Ipsum", period: "Lorem Ipsum", bullets: ["Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris."] },
    ],
    cocurricular: [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
        "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
        "Nisi ut aliquip ex ea commodo consequat.",
    ],
    skills: { languages: "Lorem Ipsum", frameworks: "Lorem Ipsum", tools: "Lorem Ipsum", databases: "Lorem Ipsum" },
};

const toAbsUrl = (url) => (!url || /^https?:\/\//i.test(url)) ? url : `https://${url}`;

// On Vercel: calls /api/polish (serverless function that holds the token server-side)
// Locally:   falls back to direct HF call if window.__HF_TOKEN__ is set via browser console
async function callPolish(text) {
    // Try the Vercel serverless proxy first
    try {
        const res = await fetch("/api/polish", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text }),
        });
        if (res.ok) {
            const data = await res.json();
            return data.result;
        }
    } catch (_) { /* not on Vercel, fall through */ }

    // Local dev fallback: set window.__HF_TOKEN__ in browser console or via .env
    const token = window.__HF_TOKEN__ || import.meta.env.VITE_HF_TOKEN;
    if (!token) throw new Error("No token. On Vercel set VITE_HF_TOKEN env var. Locally run: window.__HF_TOKEN__='hf_...' in console or add it to .env");
    const res = await fetch(HF_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
            model: HF_MODEL,
            messages: [
                { role: "system", content: "You are an expert resume writer. Polish the given resume text to be more impactful, action-oriented, quantifiable, and ATS-friendly. Return ONLY the polished text. No quotes, no preamble, no explanation." },
                { role: "user", content: text },
            ],
            max_tokens: 300,
        }),
    });
    const d = await res.json();
    if (d.error) throw new Error(d.error.message || "HuggingFace API error");
    return d.choices[0].message.content.trim();
}

function BoldFirst({ text }) {
    const idx = text.indexOf("—");
    if (idx === -1) return <>{text}</>;
    return <><strong>{text.slice(0, idx)}</strong>{"—" + text.slice(idx + 1)}</>;
}

const iBase = {
    width: "100%", padding: "5px 9px", border: "1px solid #2d3748",
    borderRadius: 5, fontSize: 12, fontFamily: "system-ui, sans-serif",
    boxSizing: "border-box", outline: "none", background: "#1a2332", color: "#e2e8f0",
};

function Inp({ label, value, onChange, mono = false }) {
    return (
        <div style={{ marginBottom: 9 }}>
            {label && <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", marginBottom: 3, textTransform: "uppercase", letterSpacing: "0.6px" }}>{label}</div>}
            <input value={value} onChange={e => onChange(e.target.value)} style={{ ...iBase, fontFamily: mono ? "monospace" : "system-ui, sans-serif" }} />
        </div>
    );
}

function PField({ value, onChange, pKey, ps, setPs, rows = 2 }) {
    const busy = ps[pKey];
    const run = useCallback(async () => {
        if (!value.trim()) return;
        setPs(s => ({ ...s, [pKey]: true }));
        try { onChange(await callPolish(value)); }
        catch (e) { alert("Polish failed: " + e.message); }
        finally { setPs(s => ({ ...s, [pKey]: false })); }
    }, [value, pKey]);

    return (
        <div style={{ display: "flex", gap: 5, alignItems: "flex-start" }}>
            <textarea value={value} onChange={e => onChange(e.target.value)} rows={rows}
                style={{ ...iBase, flex: 1, resize: "vertical", lineHeight: 1.4 }} />
            <button onClick={run} disabled={busy} title="Polish with AI"
                style={{ padding: "5px 10px", background: busy ? "#553c7b" : "#7c3aed", color: "white", border: "none", borderRadius: 5, cursor: busy ? "wait" : "pointer", fontSize: 11, fontWeight: 700, whiteSpace: "nowrap", flexShrink: 0, height: 32, transition: "background 0.2s" }}>
                {busy ? "✦ ..." : "✦ Polish"}
            </button>
        </div>
    );
}

function SCard({ title, children, accent = "#334155" }) {
    return (
        <div style={{ marginBottom: 14, border: "1px solid #1e293b", borderRadius: 7, overflow: "hidden" }}>
            <div style={{ background: accent, padding: "7px 14px", fontWeight: 700, fontSize: 11, color: "#94a3b8", letterSpacing: "0.8px", textTransform: "uppercase" }}>{title}</div>
            <div style={{ padding: "12px 14px" }}>{children}</div>
        </div>
    );
}

function AddBtn({ onClick, label = "+ Add" }) {
    return (
        <button onClick={onClick} style={{ width: "100%", padding: "5px", border: "1.5px dashed #334155", borderRadius: 5, background: "none", color: "#60a5fa", fontSize: 11, fontWeight: 600, cursor: "pointer", marginTop: 6 }}>
            {label}
        </button>
    );
}

function RemBtn({ onClick, label = "✕" }) {
    return (
        <button onClick={onClick} style={{ padding: "3px 7px", background: "#2d1515", color: "#f87171", border: "1px solid #451a1a", borderRadius: 4, cursor: "pointer", fontSize: 11, fontWeight: 700, flexShrink: 0 }}>
            {label}
        </button>
    );
}

function EntryBlock({ label, onRemove, children }) {
    return (
        <div style={{ border: "1px solid #1e293b", borderRadius: 6, padding: "10px 10px 10px 10px", marginBottom: 10, background: "#111827" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <span style={{ fontSize: 10, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.6px" }}>{label}</span>
                <RemBtn onClick={onRemove} label="Remove" />
            </div>
            {children}
        </div>
    );
}

// Unified bullet row — same layout used in every description section
function BulletRow({ value, onChange, onRemove, pKey, ps, setPs, rows = 2 }) {
    return (
        <div style={{ display: "flex", alignItems: "flex-start", gap: 0, marginBottom: 6 }}>
            <div style={{ width: 22, flexShrink: 0, paddingTop: 9, textAlign: "center", color: "#6366f1", fontSize: 14, fontWeight: 700, userSelect: "none" }}>•</div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <PField value={value} onChange={onChange} pKey={pKey} ps={ps} setPs={setPs} rows={rows} />
            </div>
            <div style={{ paddingTop: 4, paddingLeft: 5, flexShrink: 0 }}>
                <RemBtn onClick={onRemove} />
            </div>
        </div>
    );
}

// ─── Resume Preview ───────────────────────────────────────────────────────────
const CM = "'Computer Modern', 'CMU Serif', 'Latin Modern Roman', Georgia, 'Times New Roman', serif";
const PT = "9.5pt";

// ── Shared indent constants matching LaTeX \hspace{1em} and leftmargin=2.5em ──
const INDENT = "1em";       // entry title left offset  (matches \hspace{1em})
const BULLET_LEFT = "2.5em"; // bullet list left padding (matches leftmargin=2.5em)

const secStyle = {
    fontFamily: CM, fontSize: PT, fontWeight: "bold",
    textTransform: "uppercase",
    borderBottom: "0.5pt solid #000",
    marginBottom: "4pt", marginTop: "6pt", paddingBottom: "1pt",
    letterSpacing: "0.2px", color: "#000",
};

// Shared <ul> style — identical for EVERY bullet list in the resume
const ulStyle = {
    margin: "2pt 0 4pt 0",
    paddingLeft: BULLET_LEFT,
    fontFamily: CM,
    fontSize: PT,
    lineHeight: 1.35,
    color: "#000",
    listStyleType: "disc",
    textAlign: "left",
};

const liStyle = { marginBottom: "1.5pt", paddingLeft: "0.1em" };

function REntry({ title, period, isProject = false, github = "" }) {
    return (
        <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "baseline",
            paddingLeft: INDENT, marginTop: "3pt", marginBottom: "0pt",
            fontFamily: CM, fontSize: PT, textAlign: "left",
        }}>
            <span style={{ fontWeight: "bold" }}>
                {title}
                {isProject && github && (
                    <span style={{ fontWeight: "normal" }}>
                        {" "}[<a href={toAbsUrl(github)} target="_blank" rel="noreferrer"
                            style={{ color: "blue", textDecoration: "none" }}>GitHub</a>]
                    </span>
                )}
            </span>
            <span style={{ whiteSpace: "nowrap", marginLeft: "8pt", fontWeight: "normal" }}>{period}</span>
        </div>
    );
}

// Single bullet list renderer used everywhere
function RBullets({ items, boldFirst = false }) {
    const filtered = items.filter(Boolean);
    if (!filtered.length) return null;
    return (
        <ul style={ulStyle}>
            {filtered.map((b, i) => (
                <li key={i} style={liStyle}>
                    {boldFirst ? <BoldFirst text={b} /> : b}
                </li>
            ))}
        </ul>
    );
}

function Preview({ d }) {
    const { skills } = d;
    const hasSkills = skills.languages || skills.frameworks || skills.tools || skills.databases;

    return (
        <div id="resume-preview" style={{
            width: "210mm", minHeight: "297mm",
            padding: "0.45in 0.5in 0.38in 0.5in",
            background: "white", color: "#000",
            fontFamily: CM, fontSize: PT, lineHeight: 1.25,
            boxSizing: "border-box",
            textAlign: "left",
        }}>

            {/* ── Header ── */}
            <div style={{ position: "relative", marginBottom: "4pt" }}>
                <div className="center" style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: CM, fontSize: "14pt", fontWeight: "bold", marginBottom: "2pt", color: "#000" }}>
                        {d.header.name || "YOUR NAME"}
                    </div>
                    <div style={{ fontFamily: CM, fontSize: PT, color: "#000" }}>
                        {[
                            d.header.id,
                            d.header.institution,
                            d.header.linkedin && <a href={toAbsUrl(d.header.linkedin)} target="_blank" rel="noreferrer" style={{ color: "#000", textDecoration: "none" }}>{d.header.linkedin.replace(/^https?:\/\/(www\.)?/, '')}</a>,
                            d.header.github && <a href={toAbsUrl(d.header.github)} target="_blank" rel="noreferrer" style={{ color: "#000", textDecoration: "none" }}>{d.header.github.replace(/^https?:\/\/(www\.)?/, '')}</a>
                        ].filter(Boolean).map((item, idx, arr) => (
                            <span key={idx}>
                                {item}
                                {idx < arr.length - 1 && " \u00A0|\u00A0 "}
                            </span>
                        ))}
                    </div>
                </div>
                <div style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                    <img src="/IIT_Madras_Logo_(Black_and_White).svg.png" alt="IIT Madras Logo" style={{ height: "45pt", width: "auto" }} />
                </div>
            </div>

            {/* ── Education & Scholastic Achievements ── */}
            <div style={secStyle}>Education &amp; Scholastic Achievements</div>
            <div style={{ paddingLeft: INDENT }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: CM, fontSize: PT }}>
                    <thead>
                        <tr style={{ borderBottom: "0.5pt solid #000" }}>
                            {["Program", "Institution", "CGPA / %", "Year"].map(h => (
                                <th key={h} style={{ fontWeight: "bold", textAlign: "left", paddingBottom: "2pt", paddingRight: "8pt", color: "#000" }}>{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {d.education.map((e, i) => (
                            <tr key={i}>
                                {[e.program, e.institution, e.cgpa, e.year].map((v, j) => (
                                    <td key={j} style={{ paddingTop: "2pt", paddingRight: "8pt", color: "#000" }}>{v}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <RBullets items={d.achievements} boldFirst />

            {/* ── Professional Experience ── */}
            <div style={secStyle}>Professional Experience</div>
            {d.experience.map((exp, i) => (
                <div key={i}>
                    <REntry title={exp.title} period={exp.period} />
                    <RBullets items={exp.bullets} />
                </div>
            ))}

            {/* ── Projects ── */}
            <div style={secStyle}>Projects</div>
            {d.projects.map((proj, i) => (
                <div key={i}>
                    <REntry title={proj.title} period={proj.period} isProject github={proj.github} />
                    <RBullets items={proj.bullets} />
                </div>
            ))}

            {/* ── Relevant Coursework ── */}
            <div style={secStyle}>Relevant Coursework</div>
            <ul style={{ ...ulStyle, margin: "2pt 0 4pt 0", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", columnGap: "0", rowGap: "1pt" }}>
                {d.coursework.filter(Boolean).map((c, i) => (
                    <li key={i} style={liStyle}>{c}</li>
                ))}
            </ul>

            {/* ── Positions of Responsibility ── */}
            <div style={secStyle}>Positions of Responsibility</div>
            {d.positions.map((pos, i) => (
                <div key={i}>
                    <REntry title={pos.title} period={pos.period} />
                    <RBullets items={pos.bullets} />
                </div>
            ))}

            {/* ── Co-Curriculars & Extra-Curriculars ── */}
            <div style={secStyle}>Co-Curriculars &amp; Extra-Curriculars</div>
            <RBullets items={d.cocurricular} />

            {/* ── Skills (optional) ── */}
            {hasSkills && (
                <>
                    <div style={secStyle}>Skills</div>
                    <ul style={ulStyle}>
                        {skills.languages && <li style={liStyle}><strong>Languages:</strong> {skills.languages}</li>}
                        {skills.frameworks && <li style={liStyle}><strong>Frameworks:</strong> {skills.frameworks}</li>}
                        {skills.tools && <li style={liStyle}><strong>Tools:</strong> {skills.tools}</li>}
                        {skills.databases && <li style={liStyle}><strong>Databases:</strong> {skills.databases}</li>}
                    </ul>
                </>
            )}

        </div>
    );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
    const [d, setD] = useState(INIT);
    const [ps, setPs] = useState({});
    const [showForm, setShowForm] = useState(true);

    useEffect(() => {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = "https://cdn.jsdelivr.net/gh/dreampulse/computer-modern-web-font@master/font.css";
        document.head.appendChild(link);

        const style = document.createElement("style");
        style.textContent = `
      @media print {
        .no-print { display: none !important; }
        body { margin: 0 !important; background: white !important; }
        #resume-preview { box-shadow: none !important; margin: 0 !important; }
      }
      @page { size: A4; margin: 0; }
      textarea:focus, input:focus { border-color: #7c3aed !important; box-shadow: 0 0 0 2px rgba(124,58,237,0.15) !important; }
      #resume-preview, #resume-preview * { text-align: left; box-sizing: border-box; }
      #resume-preview .center { text-align: center !important; }
    `;
        document.head.appendChild(style);
    }, []);

    // Generic helpers
    const updH = (k, v) => setD(x => ({ ...x, header: { ...x.header, [k]: v } }));
    const updSkills = (k, v) => setD(x => ({ ...x, skills: { ...x.skills, [k]: v } }));
    const updObj = (key, i, patch) => setD(x => ({ ...x, [key]: x[key].map((item, j) => j === i ? { ...item, ...patch } : item) }));
    const updStr = (key, i, v) => setD(x => ({ ...x, [key]: x[key].map((s, j) => j === i ? v : s) }));
    const remItem = (key, i) => setD(x => ({ ...x, [key]: x[key].filter((_, j) => j !== i) }));
    const addItem = (key, item) => setD(x => ({ ...x, [key]: [...x[key], item] }));
    const updBullet = (key, i, bi, v) => {
        const bs = [...d[key][i].bullets];
        bs[bi] = v;
        updObj(key, i, { bullets: bs });
    };
    const remBullet = (key, i, bi) => updObj(key, i, { bullets: d[key][i].bullets.filter((_, j) => j !== bi) });
    const addBullet = (key, i) => updObj(key, i, { bullets: [...d[key][i].bullets, ""] });

    function BulletEditor({ sKey, ei }) {
        const bullets = d[sKey][ei].bullets;
        return (
            <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 10, fontWeight: 700, color: "#475569", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.6px" }}>Bullets</div>
                {bullets.map((b, bi) => (
                    <BulletRow key={bi}
                        value={b} onChange={v => updBullet(sKey, ei, bi, v)}
                        onRemove={() => remBullet(sKey, ei, bi)}
                        pKey={`${sKey}-${ei}-${bi}`} ps={ps} setPs={setPs} rows={2}
                    />
                ))}
                <AddBtn onClick={() => addBullet(sKey, ei)} label="+ Add Bullet" />
            </div>
        );
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh", fontFamily: "system-ui, sans-serif", background: "#0a0f1a" }}>

            {/* ── Top Bar ── */}
            <div className="no-print" style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 18px", background: "#060c18", borderBottom: "1px solid #1e293b", flexShrink: 0, zIndex: 10 }}>
                <div style={{ fontWeight: 800, fontSize: 14, color: "#e2e8f0", letterSpacing: "-0.3px" }}>
                    <span style={{ color: "#7c3aed" }}>▣</span> LaTeX Resume Builder
                </div>
                <div style={{ flex: 1 }} />
                <button onClick={() => setShowForm(f => !f)} style={{ padding: "6px 14px", background: "#1e293b", color: "#94a3b8", border: "1px solid #334155", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>
                    {showForm ? "⊟ Hide Form" : "⊞ Show Form"}
                </button>
                <button onClick={() => window.print()} style={{ padding: "7px 18px", background: "#7c3aed", color: "white", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 700, letterSpacing: "0.2px" }}>
                    ↓ Download PDF
                </button>
            </div>

            {/* ── Body ── */}
            <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

                {/* ── Form Panel ── */}
                {showForm && (
                    <div className="no-print" style={{ width: 430, background: "#0d1424", borderRight: "1px solid #1e293b", overflowY: "auto", padding: "14px 14px 30px", flexShrink: 0 }}>

                        <SCard title="Header">
                            <Inp label="Full Name" value={d.header.name} onChange={v => updH("name", v)} />
                            <Inp label="Roll / Student ID" value={d.header.id} onChange={v => updH("id", v)} />
                            <Inp label="Institution" value={d.header.institution} onChange={v => updH("institution", v)} />
                            <Inp label="LinkedIn URL" value={d.header.linkedin || ""} onChange={v => updH("linkedin", v)} />
                            <Inp label="GitHub URL" value={d.header.github || ""} onChange={v => updH("github", v)} />
                        </SCard>

                        <SCard title="Education">
                            {d.education.map((edu, i) => (
                                <EntryBlock key={i} label={`Entry ${i + 1}`} onRemove={() => remItem("education", i)}>
                                    <Inp label="Program" value={edu.program} onChange={v => updObj("education", i, { program: v })} />
                                    <Inp label="Institution" value={edu.institution} onChange={v => updObj("education", i, { institution: v })} />
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                                        <Inp label="CGPA / %" value={edu.cgpa} onChange={v => updObj("education", i, { cgpa: v })} />
                                        <Inp label="Year" value={edu.year} onChange={v => updObj("education", i, { year: v })} />
                                    </div>
                                </EntryBlock>
                            ))}
                            <AddBtn label="+ Add Education Entry" onClick={() => addItem("education", { program: "", institution: "", cgpa: "", year: "" })} />
                        </SCard>

                        <SCard title="Scholastic Achievements">
                            {d.achievements.map((a, i) => (
                                <BulletRow key={i}
                                    value={a} onChange={v => updStr("achievements", i, v)}
                                    onRemove={() => remItem("achievements", i)}
                                    pKey={`ach-${i}`} ps={ps} setPs={setPs} rows={2}
                                />
                            ))}
                            <AddBtn label="+ Add Achievement" onClick={() => addItem("achievements", "")} />
                        </SCard>

                        <SCard title="Professional Experience">
                            {d.experience.map((exp, i) => (
                                <EntryBlock key={i} label={`Experience ${i + 1}`} onRemove={() => remItem("experience", i)}>
                                    <Inp label="Company — Role" value={exp.title} onChange={v => updObj("experience", i, { title: v })} />
                                    <Inp label="Period" value={exp.period} onChange={v => updObj("experience", i, { period: v })} />
                                    <BulletEditor sKey="experience" ei={i} />
                                </EntryBlock>
                            ))}
                            <AddBtn label="+ Add Experience" onClick={() => addItem("experience", { title: "", period: "", bullets: [""] })} />
                        </SCard>

                        <SCard title="Projects">
                            {d.projects.map((proj, i) => (
                                <EntryBlock key={i} label={`Project ${i + 1}`} onRemove={() => remItem("projects", i)}>
                                    <Inp label="Project Name" value={proj.title} onChange={v => updObj("projects", i, { title: v })} />
                                    <Inp label="GitHub URL" value={proj.github} onChange={v => updObj("projects", i, { github: v })} mono />
                                    <Inp label="Period" value={proj.period} onChange={v => updObj("projects", i, { period: v })} />
                                    <BulletEditor sKey="projects" ei={i} />
                                </EntryBlock>
                            ))}
                            <AddBtn label="+ Add Project" onClick={() => addItem("projects", { title: "", github: "", period: "", bullets: [""] })} />
                        </SCard>

                        <SCard title="Relevant Coursework">
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 6 }}>
                                {d.coursework.map((c, i) => (
                                    <div key={i} style={{ display: "flex", gap: 4, alignItems: "center" }}>
                                        <input value={c} onChange={e => updStr("coursework", i, e.target.value)}
                                            style={{ ...iBase, flex: 1, fontSize: 11, padding: "4px 7px" }} />
                                        <RemBtn onClick={() => remItem("coursework", i)} />
                                    </div>
                                ))}
                            </div>
                            <AddBtn label="+ Add Course" onClick={() => addItem("coursework", "")} />
                        </SCard>

                        <SCard title="Positions of Responsibility">
                            {d.positions.map((pos, i) => (
                                <EntryBlock key={i} label={`Position ${i + 1}`} onRemove={() => remItem("positions", i)}>
                                    <Inp label="Title / Role" value={pos.title} onChange={v => updObj("positions", i, { title: v })} />
                                    <Inp label="Period" value={pos.period} onChange={v => updObj("positions", i, { period: v })} />
                                    <BulletEditor sKey="positions" ei={i} />
                                </EntryBlock>
                            ))}
                            <AddBtn label="+ Add Position" onClick={() => addItem("positions", { title: "", period: "", bullets: [""] })} />
                        </SCard>

                        <SCard title="Co-Curriculars & Extra-Curriculars">
                            {d.cocurricular.map((c, i) => (
                                <BulletRow key={i}
                                    value={c} onChange={v => updStr("cocurricular", i, v)}
                                    onRemove={() => remItem("cocurricular", i)}
                                    pKey={`coc-${i}`} ps={ps} setPs={setPs} rows={1}
                                />
                            ))}
                            <AddBtn label="+ Add Item" onClick={() => addItem("cocurricular", "")} />
                        </SCard>

                        <SCard title="Skills (Optional)" accent="#1a1025">
                            <div style={{ fontSize: 11, color: "#475569", marginBottom: 10 }}>Leave blank to hide this section from the resume.</div>
                            <Inp label="Languages  (e.g. Python, Java, C++)" value={d.skills.languages} onChange={v => updSkills("languages", v)} />
                            <Inp label="Frameworks  (e.g. React, Spring Boot, Node.js)" value={d.skills.frameworks} onChange={v => updSkills("frameworks", v)} />
                            <Inp label="Tools  (e.g. Git, Docker, Kafka, Redis)" value={d.skills.tools} onChange={v => updSkills("tools", v)} />
                            <Inp label="Databases  (e.g. MongoDB, PostgreSQL)" value={d.skills.databases} onChange={v => updSkills("databases", v)} />
                        </SCard>

                    </div>
                )}

                {/* ── Preview Panel ── */}
                <div style={{ flex: 1, background: "#1e2433", overflowY: "auto", display: "flex", justifyContent: "center", padding: 24, alignItems: "flex-start" }}>
                    <div style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.6)", flexShrink: 0 }}>
                        <Preview d={d} />
                    </div>
                </div>

            </div>
        </div>
    );
}