import React from "react";
import { formatText } from "../utils";

const toAbsUrl = (url) => (!url || /^https?:\/\//i.test(url)) ? url : `https://${url}`;

// ─── AltaCV / Karan-style Two-Column Template ───────────────────────────────
// Faithfully replicates the Overleaf-compiled LaTeX altacv resume.
// Deep Navy accents, Lato font, two-column paracol 50/50 layout,
// NO header divider line, education entries styled exactly as LaTeX cveventd.

const NAVY     = "#023e7d";
const DARK     = "#1a1a1a";   // near-black for body text
const MED      = "#555555";   // grey for sub-text
const LATO     = "'Lato', 'Helvetica Neue', Arial, sans-serif";
const PT       = "var(--pt, 9pt)";

// ── Section heading: UPPERCASE navy text + full-width navy underrule ──────────
function SecHeading({ title }) {
    return (
        <div style={{
            fontFamily: LATO,
            fontSize: "var(--sec-pt, 10pt)",
            fontWeight: 900,
            color: NAVY,
            textTransform: "uppercase",
            letterSpacing: "0.4px",
            borderBottom: `1.5pt solid ${NAVY}`,
            paddingBottom: "1pt",
            marginBottom: "3pt",
            marginTop: "7pt",
        }}>
            {title}
        </div>
    );
}

// ── Thin navy divider between sub-entries ─────────────────────────────────────
function Divider() {
    return (
        <div style={{
            borderTop: `0.5pt solid ${NAVY}`,
            margin: "3pt 0",
            opacity: 0.35,
        }} />
    );
}

// ── Education entry — matches LaTeX \cveventd exactly ─────────────────────────
// Top row:  bold dark institution name         calendar-icon + bold-dark year
// 2nd row:  navy italic degree                                navy italic CGPA
function EduEntry({ institution, program, grade, year, isLast }) {
    return (
        <>
            {/* Row 1: institution + year */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                fontFamily: LATO,
                fontSize: PT,
            }}>
                <span style={{ fontWeight: 700, color: DARK }}>{institution}</span>
                <span style={{ fontWeight: 700, color: DARK, whiteSpace: "nowrap", marginLeft: "4pt", fontSize: "var(--sm-pt, 8pt)" }}>
                    <i className="fa-solid fa-calendar-day" style={{ marginRight: "2pt", color: DARK, fontSize: "0.85em" }} />
                    {year}
                </span>
            </div>
            {/* Row 2: program + grade (both in navy italic) */}
            {(program || grade) && (
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "baseline",
                    fontFamily: LATO,
                    fontSize: "var(--sm-pt, 8pt)",
                    fontStyle: "italic",
                    color: NAVY,
                    marginTop: "0.5pt",
                    marginBottom: "1pt",
                }}>
                    <span>{program}</span>
                    {grade && <span style={{ whiteSpace: "nowrap", marginLeft: "4pt" }}>{grade}</span>}
                </div>
            )}
            {!isLast && <Divider />}
        </>
    );
}

// ── Experience / Position entry header ───────────────────────────────────────
// Top row:   bold-large navy company name           italic-grey period
// 2nd row:   bold-italic role sub-title
// 3rd row:   optional italic sub-description
function ExpHeader({ company, role, period, sub }) {
    return (
        <div style={{ fontFamily: LATO, fontSize: PT, marginBottom: "1pt" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                <span style={{ fontWeight: 700, color: NAVY, fontSize: "var(--entry-pt, 9.5pt)" }}>
                    {company}
                </span>
                {period && (
                    <span style={{ fontStyle: "italic", color: MED, whiteSpace: "nowrap", marginLeft: "4pt", fontSize: "var(--sm-pt, 8pt)" }}>
                        {period}
                    </span>
                )}
            </div>
            {role && (
                <div style={{ fontWeight: 700, fontStyle: "italic", color: DARK, fontSize: "var(--sm-pt, 8pt)", marginTop: "0.5pt" }}>
                    {role}
                </div>
            )}
            {sub && (
                <div style={{ fontStyle: "italic", color: MED, fontSize: "var(--sm-pt, 8pt)", marginTop: "0.5pt" }}>
                    {sub}
                </div>
            )}
        </div>
    );
}

// ── Compact disc bullet list ──────────────────────────────────────────────────
function Bullets({ items }) {
    const filtered = items?.filter(Boolean) ?? [];
    if (!filtered.length) return null;
    return (
        <ul style={{
            margin: "1pt 0 1.5pt 0",
            paddingLeft: "1.3em",
            fontFamily: LATO,
            fontSize: PT,
            lineHeight: 1.32,
            color: DARK,
            listStyleType: "disc",
            textAlign: "left",
        }}>
            {filtered.map((b, i) => (
                <li key={i} style={{ marginBottom: "1.5pt" }}>{formatText(b)}</li>
            ))}
        </ul>
    );
}

// ── Parse "Company — Role" title ─────────────────────────────────────────────
function parseTitle(title) {
    const idx = title.indexOf("—");
    if (idx !== -1) return { main: title.slice(0, idx).trim(), sub: title.slice(idx + 1).trim() };
    return { main: title, sub: "" };
}

// ── Column wrapper ─────────────────────────────────────────────────────────────
function Col({ children, style }) {
    return (
        <div style={{ fontFamily: LATO, fontSize: PT, color: DARK, ...style }}>
            {children}
        </div>
    );
}

export default function Template3({ d }) {
    const { skills } = d;
    const hasSkills = skills.languages || skills.frameworks || skills.tools || skills.databases;

    return (
        <div
            id="resume-preview"
            style={{
                "--pt":       "9pt",
                "--sm-pt":    "7.9pt",
                "--sec-pt":   "10.2pt",
                "--entry-pt": "9.5pt",
                "--name-pt":  "18.9pt",
                "--tag-pt":   "11.7pt",
                width: "210mm",
                height: "297mm",
                padding: "0.31in 0.31in 0.28in 0.31in",
                background: "white",
                color: DARK,
                fontFamily: LATO,
                fontSize: PT,
                lineHeight: 1.3,
                boxSizing: "border-box",
                overflow: "hidden",
            }}
        >
            {/* ══════════════════════════ HEADER ══════════════════════════ */}
            <div style={{ position: "relative", marginBottom: "5pt" }}>

                {/* IIT Madras Logo — top right, absolutely positioned */}
                {import.meta.env.VITE_APP_VARIANT !== 'GENERAL' && (
                    <div style={{ position: "absolute", right: 0, top: 0 }}>
                        <img
                            src="/IIT_Madras_Logo_(Black_and_White).svg.png"
                            alt="IIT Madras"
                            style={{ height: "38pt", width: "auto" }}
                        />
                    </div>
                )}

                {/* Name — ALL CAPS, very bold, large */}
                <div style={{
                    fontFamily: LATO,
                    fontSize: "var(--name-pt, 19pt)",
                    fontWeight: 900,
                    color: DARK,
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    lineHeight: 1.05,
                    marginBottom: "2pt",
                }}>
                    {d.header.name || "YOUR NAME"}
                </div>

                {/* Institution tagline — navy, bold, slightly smaller */}
                {d.header.institution && (
                    <div style={{
                        fontFamily: LATO,
                        fontSize: "var(--tag-pt, 11.5pt)",
                        fontWeight: 700,
                        color: NAVY,
                        marginBottom: "3pt",
                    }}>
                        {d.header.institution}
                    </div>
                )}

                {/* Contact row: ID  |  GitHub icon + handle  |  LinkedIn icon + handle */}
                <div style={{
                    fontFamily: LATO,
                    fontSize: "var(--sm-pt, 8pt)",
                    color: DARK,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0 10pt",
                    alignItems: "center",
                }}>
                    {d.header.id && (
                        <span style={{ color: DARK }}>{d.header.id}</span>
                    )}
                    {d.header.github && (
                        <a href={toAbsUrl(d.header.github)} target="_blank" rel="noreferrer"
                            style={{ color: DARK, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "2.5pt" }}>
                            <i className="fa-brands fa-github" style={{ fontSize: "1em", color: DARK }} />
                            {d.header.github
                                .replace(/^https?:\/\/(www\.)?github\.com\//, "")
                                .replace(/\/$/, "")}
                        </a>
                    )}
                    {d.header.linkedin && (
                        <a href={toAbsUrl(d.header.linkedin)} target="_blank" rel="noreferrer"
                            style={{ color: DARK, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "2.5pt" }}>
                            <i className="fa-brands fa-linkedin" style={{ fontSize: "1em", color: DARK }} />
                            {d.header.linkedin
                                .replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, "")
                                .replace(/\/$/, "")}
                        </a>
                    )}
                </div>
            </div>

            {/* ═══════════════════ TWO COLUMNS (no divider line) ════════════════ */}
            <div style={{
                display: "flex",
                gap: "10pt",
                height: "calc(100% - 68pt)",
            }}>

                {/* ══════════ LEFT COLUMN 50% ══════════ */}
                <Col style={{ flex: "0 0 49%", width: "49%", overflow: "hidden" }}>

                    {/* EDUCATION */}
                    <SecHeading title="Education" />
                    {d.education.map((edu, i) => (
                        <EduEntry
                            key={i}
                            institution={edu.institution}
                            program={edu.program}
                            grade={edu.cgpa}
                            year={edu.year}
                            isLast={i === d.education.length - 1}
                        />
                    ))}

                    {/* PROFESSIONAL EXPERIENCE */}
                    {d.experience?.length > 0 && (
                        <>
                            <SecHeading title="Professional Experience" />
                            {d.experience.map((exp, i) => {
                                const { main, sub } = parseTitle(exp.title);
                                return (
                                    <div key={i}>
                                        <ExpHeader company={main} role={sub} period={exp.period} />
                                        <Bullets items={exp.bullets} />
                                        {i < d.experience.length - 1 && <Divider />}
                                    </div>
                                );
                            })}
                        </>
                    )}

                    {/* KEY PROJECTS */}
                    {d.projects?.length > 0 && (
                        <>
                            <SecHeading title="Key Projects" />
                            {d.projects.map((proj, i) => (
                                <div key={i}>
                                    <div style={{ fontFamily: LATO, fontSize: PT, marginBottom: "1pt" }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "4pt" }}>
                                            <span style={{ fontWeight: 700, color: NAVY, fontSize: "var(--entry-pt, 9.5pt)", lineHeight: 1.2 }}>
                                                {proj.title}
                                            </span>
                                            {proj.period && (
                                                <span style={{ fontStyle: "italic", color: MED, whiteSpace: "nowrap", fontSize: "var(--sm-pt, 8pt)", flexShrink: 0 }}>
                                                    {proj.period}
                                                </span>
                                            )}
                                        </div>
                                        {proj.github && (
                                            <div style={{ fontSize: "var(--sm-pt, 8pt)", color: MED, marginTop: "0.5pt" }}>
                                                <a href={toAbsUrl(proj.github)} target="_blank" rel="noreferrer"
                                                    style={{ color: NAVY, textDecoration: "none" }}>
                                                    <i className="fa-brands fa-github" style={{ marginRight: "2pt" }} />
                                                    {proj.github.replace(/^https?:\/\/(www\.)?github\.com\//, "").replace(/\/$/, "")}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                    <Bullets items={proj.bullets} />
                                    {i < d.projects.length - 1 && <Divider />}
                                </div>
                            ))}
                        </>
                    )}

                </Col>



                {/* ══════════ RIGHT COLUMN ══════════ */}
                <Col style={{ flex: 1, overflow: "hidden" }}>

                    {/* COURSE PROJECTS (maps from coursework when items have bullet-like text) */}
                    {/* We keep coursework as a bullet list matching the LaTeX right column */}
                    {d.coursework?.length > 0 && (
                        <>
                            <SecHeading title="Coursework" />
                            <ul style={{
                                margin: "0 0 3pt 0",
                                paddingLeft: "1.15em",
                                fontFamily: LATO,
                                fontSize: PT,
                                lineHeight: 1.32,
                                color: DARK,
                                listStyleType: "disc",
                                columns: 2,
                                columnGap: "6pt",
                            }}>
                                {d.coursework.filter(Boolean).map((c, i) => (
                                    <li key={i} style={{ marginBottom: "1pt", breakInside: "avoid" }}>{formatText(c)}</li>
                                ))}
                            </ul>
                        </>
                    )}

                    {/* SKILLS */}
                    {hasSkills && (
                        <>
                            <SecHeading title="Skills" />
                            <ul style={{
                                margin: "0 0 3pt 0",
                                paddingLeft: "1.15em",
                                fontFamily: LATO,
                                fontSize: PT,
                                lineHeight: 1.32,
                                color: DARK,
                                listStyleType: "disc",
                            }}>
                                {skills.languages && (
                                    <li style={{ marginBottom: "1pt" }}>
                                        <strong>Programming:</strong> {formatText(skills.languages)}
                                    </li>
                                )}
                                {skills.frameworks && (
                                    <li style={{ marginBottom: "1pt" }}>
                                        <strong>Libraries:</strong> {formatText(skills.frameworks)}
                                    </li>
                                )}
                                {skills.tools && (
                                    <li style={{ marginBottom: "1pt" }}>
                                        <strong>Tools & Platforms:</strong> {formatText(skills.tools)}
                                    </li>
                                )}
                                {skills.databases && (
                                    <li style={{ marginBottom: "1pt" }}>
                                        <strong>Databases:</strong> {formatText(skills.databases)}
                                    </li>
                                )}
                            </ul>
                        </>
                    )}

                    {/* SCHOLASTIC ACHIEVEMENTS */}
                    {d.achievements?.length > 0 && (
                        <>
                            <SecHeading title="Scholastic Achievements" />
                            <Bullets items={d.achievements} />
                        </>
                    )}

                    {/* POSITIONS OF RESPONSIBILITY */}
                    {d.positions?.length > 0 && (
                        <>
                            <SecHeading title="Positions of Responsibility" />
                            {d.positions.map((pos, i) => {
                                const { main, sub } = parseTitle(pos.title);
                                return (
                                    <div key={i}>
                                        <ExpHeader company={main} role={sub} period={pos.period} />
                                        <Bullets items={pos.bullets} />
                                        {i < d.positions.length - 1 && <Divider />}
                                    </div>
                                );
                            })}
                        </>
                    )}

                    {/* CO-CURRICULARS */}
                    {d.cocurricular?.length > 0 && (
                        <>
                            <SecHeading title="Co-Curriculars & Extra-Curriculars" />
                            <Bullets items={d.cocurricular} />
                        </>
                    )}

                </Col>
            </div>
        </div>
    );
}
