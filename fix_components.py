with open("src/App.jsx", "r") as f:
    content = f.read()

components = """
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

"""

content = content.replace('function ProfileSync({ d, setD }) {', components + 'function ProfileSync({ d, setD }) {')

with open("src/App.jsx", "w") as f:
    f.write(content)

