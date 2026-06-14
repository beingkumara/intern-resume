import React from "react";
import { formatText } from "../utils";

const toAbsUrl = (url) => (!url || /^https?:\/\//i.test(url)) ? url : `https://${url}`;

function BoldFirst({ text }) {
    const idx = text.indexOf("—");
    if (idx === -1) return <>{formatText(text)}</>;
    return <><strong>{formatText(text.slice(0, idx))}</strong>{"—"}{formatText(text.slice(idx + 1))}</>;
}

// ─── Resume Preview ───────────────────────────────────────────────────────────
const CM = "'Computer Modern', 'CMU Serif', 'Latin Modern Roman', Georgia, 'Times New Roman', serif";
const PT = "var(--pt, 9.5pt)";

// ── Shared indent constants matching LaTeX \hspace{1em} and leftmargin=2.5em ──
const INDENT = "1em";       // entry title left offset  (matches \hspace{1em})
const BULLET_LEFT = "2.5em"; // bullet list left padding (matches leftmargin=2.5em)

const secStyle = {
    fontFamily: CM, fontSize: PT, fontWeight: "bold",
    textTransform: "uppercase",
    borderBottom: "0.5pt solid #000",
    marginBottom: "0.42em", marginTop: "0.63em", paddingBottom: "0.1em",
    letterSpacing: "0.2px", color: "#000",
};

// Shared <ul> style — identical for EVERY bullet list in the resume
const ulStyle = {
    margin: "0.21em 0 0.42em 0",
    paddingLeft: BULLET_LEFT,
    fontFamily: CM,
    fontSize: PT,
    lineHeight: 1.35,
    color: "#000",
    listStyleType: "disc",
    textAlign: "left",
};

const liStyle = { marginBottom: "0.16em", paddingLeft: "0.1em" };

function REntry({ title, period, isProject = false, github = "" }) {
    return (
        <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "baseline",
            paddingLeft: INDENT, marginTop: "0.32em", marginBottom: "0pt",
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
                    {boldFirst ? <BoldFirst text={b} /> : formatText(b)}
                </li>
            ))}
        </ul>
    );
}

export default function Template1({ d }) {
    const { skills } = d;
    const hasSkills = skills.languages || skills.frameworks || skills.tools || skills.databases;

    return (
        <div id="resume-preview" style={{
            "--pt": "9.5pt",
            "--name-pt": "14pt",
            width: "210mm", height: "297mm",
            padding: "0.45in 0.5in 0.38in 0.5in",
            background: "white", color: "#000",
            fontFamily: CM, fontSize: PT, lineHeight: 1.25,
            boxSizing: "border-box",
            textAlign: "left",
            overflow: "hidden"
        }}>

            {/* ── Header ── */}
            <div style={{ position: "relative", marginBottom: "0.42em" }}>
                <div className="center" style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: CM, fontSize: "var(--name-pt, 14pt)", fontWeight: "bold", marginBottom: "0.21em", color: "#000" }}>
                        {d.header.name || "YOUR NAME"}
                    </div>
                    <div style={{ fontFamily: CM, fontSize: PT, color: "#000" }}>
                        {[
                            d.header.id,
                            d.header.institution,
                            d.header.linkedin && <a href={toAbsUrl(d.header.linkedin)} target="_blank" rel="noreferrer" style={{ color: "#000", textDecoration: "none" }}>linkedin</a>,
                            d.header.github && <a href={toAbsUrl(d.header.github)} target="_blank" rel="noreferrer" style={{ color: "#000", textDecoration: "none" }}>github</a>
                        ].filter(Boolean).map((item, idx, arr) => (
                            <span key={idx}>
                                {item}
                                {idx < arr.length - 1 && " \u00A0|\u00A0 "}
                            </span>
                        ))}
                    </div>
                </div>
                {import.meta.env.VITE_APP_VARIANT !== 'GENERAL' && (
                    <div style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)" }}>
                        <img src="/IIT_Madras_Logo_(Black_and_White).svg.png" alt="IIT Madras Logo" style={{ height: "45pt", width: "auto" }} />
                    </div>
                )}
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
            {d.experience?.length > 0 && (
                <>
                    <div style={secStyle}>Professional Experience</div>
                    {d.experience.map((exp, i) => (
                        <div key={i}>
                            <REntry title={exp.title} period={exp.period} />
                            <RBullets items={exp.bullets} />
                        </div>
                    ))}
                </>
            )}

            {/* ── Projects ── */}
            {d.projects?.length > 0 && (
                <>
                    <div style={secStyle}>Projects</div>
                    {d.projects.map((proj, i) => (
                        <div key={i}>
                            <REntry title={proj.title} period={proj.period} isProject github={proj.github} />
                            <RBullets items={proj.bullets} />
                        </div>
                    ))}
                </>
            )}

            {/* ── Relevant Coursework ── */}
            {d.coursework?.length > 0 && (
                <>
                    <div style={secStyle}>Relevant Coursework</div>
                    <ul style={{ ...ulStyle, margin: "2pt 0 4pt 0", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", columnGap: "0", rowGap: "1pt" }}>
                        {d.coursework.filter(Boolean).map((c, i) => (
                            <li key={i} style={liStyle}>{formatText(c)}</li>
                        ))}
                    </ul>
                </>
            )}

            {/* ── Positions of Responsibility ── */}
            {d.positions?.length > 0 && (
                <>
                    <div style={secStyle}>Positions of Responsibility</div>
                    {d.positions.map((pos, i) => (
                        <div key={i}>
                            <REntry title={pos.title} period={pos.period} />
                            <RBullets items={pos.bullets} />
                        </div>
                    ))}
                </>
            )}

            {/* ── Co-Curriculars & Extra-Curriculars ── */}
            {d.cocurricular?.length > 0 && (
                <>
                    <div style={secStyle}>Co-Curriculars &amp; Extra-Curriculars</div>
                    <RBullets items={d.cocurricular} />
                </>
            )}

            {/* ── Skills (optional) ── */}
            {hasSkills && (
                <>
                    <div style={secStyle}>Skills</div>
                    <ul style={ulStyle}>
                        {skills.languages && <li style={liStyle}><strong>Languages:</strong> {formatText(skills.languages)}</li>}
                        {skills.frameworks && <li style={liStyle}><strong>Frameworks:</strong> {formatText(skills.frameworks)}</li>}
                        {skills.tools && <li style={liStyle}><strong>Tools:</strong> {formatText(skills.tools)}</li>}
                        {skills.databases && <li style={liStyle}><strong>Databases:</strong> {formatText(skills.databases)}</li>}
                    </ul>
                </>
            )}

        </div>
    );
}
