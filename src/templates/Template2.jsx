import React from "react";
import { formatText } from "../utils";

const toAbsUrl = (url) => (!url || /^https?:\/\//i.test(url)) ? url : `https://${url}`;

function BoldFirst({ text }) {
    const idx = text.indexOf("—");
    if (idx === -1) return <>{formatText(text)}</>;
    return <><strong>{formatText(text.slice(0, idx))}</strong>{"—"}{formatText(text.slice(idx + 1))}</>;
}

// ─── Template 2 Constants ───────────────────────────────────────────────────
const CM = "'Computer Modern', 'CMU Serif', 'Latin Modern Roman', Georgia, 'Times New Roman', serif";
const PT = "var(--pt, 10pt)";

const secStyle = {
    fontFamily: CM,
    fontSize: "var(--sec-pt, 11pt)",
    fontWeight: "bold",
    textTransform: "uppercase",
    borderBottom: "0.5pt solid #000",
    marginBottom: "0.3em",
    marginTop: "0.6em",
    paddingBottom: "0.1em",
    color: "#000",
};

// Similar to LaTeX \begin{itemize}[leftmargin=*]
const ulStyle = {
    margin: "0 0 0.3em 0",
    paddingLeft: "1.2em",
    fontFamily: CM,
    fontSize: PT,
    lineHeight: 1.25,
    color: "#000",
    listStyleType: "disc",
    textAlign: "left",
};

const liStyle = { marginBottom: "0.1em" };

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

function parseTitle(title) {
    const idx = title.indexOf("—");
    if (idx !== -1) {
        return {
            main: title.slice(0, idx).trim(),
            sub: title.slice(idx + 1).trim()
        };
    }
    return { main: title, sub: "" };
}

export default function Template2({ d }) {
    const { skills } = d;
    const hasSkills = skills.languages || skills.frameworks || skills.tools || skills.databases;

    return (
        <div id="resume-preview" style={{
            "--pt": "10pt",
            "--sec-pt": "11pt",
            "--name-pt": "14pt",
            width: "210mm", height: "297mm",
            padding: "0.4in 0.4in 0.4in 0.4in",
            background: "white", color: "#000",
            fontFamily: CM, fontSize: PT, lineHeight: 1.2,
            boxSizing: "border-box",
            textAlign: "left",
            overflow: "hidden"
        }}>

            {/* ── Header ── */}
            <div style={{ position: "relative", marginBottom: "0.5em" }}>
                <div style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: CM, fontSize: "var(--name-pt, 14pt)", fontWeight: "bold", textTransform: "uppercase", marginBottom: "2pt", color: "#000" }}>
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

            {/* ── Education ── */}
            <div style={secStyle}>Education</div>
            <div style={{ marginBottom: "0.4em" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: CM, fontSize: PT }}>
                    <thead>
                        <tr>
                            <th style={{ border: "0.5pt solid #000", padding: "2pt 4pt", fontWeight: "bold", textAlign: "left" }}>Program</th>
                            <th style={{ border: "0.5pt solid #000", padding: "2pt 4pt", fontWeight: "bold", textAlign: "left" }}>Institute</th>
                            <th style={{ border: "0.5pt solid #000", padding: "2pt 4pt", fontWeight: "bold", textAlign: "center" }}>%/CGPA</th>
                            <th style={{ border: "0.5pt solid #000", padding: "2pt 4pt", fontWeight: "bold", textAlign: "center" }}>Year</th>
                        </tr>
                    </thead>
                    <tbody>
                        {d.education.map((e, i) => (
                            <tr key={i}>
                                <td style={{ border: "0.5pt solid #000", padding: "2pt 4pt", textAlign: "left" }}>{e.program}</td>
                                <td style={{ border: "0.5pt solid #000", padding: "2pt 4pt", textAlign: "left" }}>{e.institution}</td>
                                <td style={{ border: "0.5pt solid #000", padding: "2pt 4pt", textAlign: "center" }}>{e.cgpa}</td>
                                <td style={{ border: "0.5pt solid #000", padding: "2pt 4pt", textAlign: "center" }}>{e.year}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ── Scholastic Achievements ── */}
            {d.achievements?.length > 0 && (
                <>
                    <div style={secStyle}>Scholastic Achievements</div>
                    <RBullets items={d.achievements} boldFirst />
                </>
            )}

            {/* ── Professional Experience ── */}
            {d.experience?.length > 0 && (
                <>
                    <div style={secStyle}>Professional Experience</div>
                    {d.experience.map((exp, i) => {
                        const { main, sub } = parseTitle(exp.title);
                        return (
                            <div key={i} style={{ marginBottom: "0.3em" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                    <div>
                                        <strong>{main}</strong> {sub && `(${sub})`}
                                    </div>
                                    <div style={{ whiteSpace: "nowrap", marginLeft: "8pt" }}>{exp.period}</div>
                                </div>
                                <RBullets items={exp.bullets} />
                            </div>
                        );
                    })}
                </>
            )}

            {/* ── Projects ── */}
            {d.projects?.length > 0 && (
                <>
                    <div style={secStyle}>Projects</div>
                    {d.projects.map((proj, i) => (
                        <div key={i} style={{ marginBottom: "0.3em" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                <div>
                                    <strong>{proj.title}</strong>
                                    {proj.github && (
                                        <>
                                            {" "}
                                            [<a href={toAbsUrl(proj.github)} target="_blank" rel="noreferrer" style={{ color: "black", textDecoration: "none" }}>GITHUB</a>]
                                        </>
                                    )}
                                </div>
                                <div style={{ whiteSpace: "nowrap", marginLeft: "8pt" }}>{proj.period}</div>
                            </div>
                            <RBullets items={proj.bullets} />
                        </div>
                    ))}
                </>
            )}

            {/* ── Relevant Coursework ── */}
            {d.coursework?.length > 0 && (
                <>
                    <div style={secStyle}>Relevant Coursework</div>
                    <ul style={{ ...ulStyle, margin: "2pt 0 4pt 0", display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr", columnGap: "0", rowGap: "1pt", paddingLeft: 0, listStyleType: "none" }}>
                        {d.coursework.filter(Boolean).map((c, i) => (
                            <li key={i} style={{ ...liStyle, paddingLeft: 0 }}>{formatText(c)}</li>
                        ))}
                    </ul>
                </>
            )}

            {/* ── Positions of Responsibility ── */}
            {d.positions?.length > 0 && (
                <>
                    <div style={secStyle}>Positions of Responsibilities</div>
                    {d.positions.map((pos, i) => {
                        const { main, sub } = parseTitle(pos.title);
                        return (
                            <div key={i} style={{ marginBottom: "0.3em" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                    <div>
                                        <strong>{main}</strong>{sub && `, ${sub}`}
                                    </div>
                                    <div style={{ whiteSpace: "nowrap", marginLeft: "8pt" }}>{pos.period}</div>
                                </div>
                                <RBullets items={pos.bullets} />
                            </div>
                        );
                    })}
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
