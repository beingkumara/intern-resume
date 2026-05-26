import re

with open("src/App.jsx", "r") as f:
    content = f.read()

# 1. Remove BulletEditor from inside App
content = re.sub(
    r'\s+function BulletEditor\(\{ sKey, ei \}\) \{.*?\n\s+\}\n',
    '\n',
    content,
    flags=re.DOTALL
)

# 2. Add BulletEditor outside App, e.g. before `export default function App`
bullet_editor_code = """
function BulletEditor({ bullets, sKey, ei, ps, setPs, updBullet, remBullet, addBullet }) {
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
"""

content = content.replace("export default function App() {", bullet_editor_code + "\nexport default function App() {")

# 3. Update usages of BulletEditor
content = content.replace('<BulletEditor sKey="experience" ei={i} />', '<BulletEditor bullets={exp.bullets} sKey="experience" ei={i} ps={ps} setPs={setPs} updBullet={updBullet} remBullet={remBullet} addBullet={addBullet} />')
content = content.replace('<BulletEditor sKey="projects" ei={i} />', '<BulletEditor bullets={proj.bullets} sKey="projects" ei={i} ps={ps} setPs={setPs} updBullet={updBullet} remBullet={remBullet} addBullet={addBullet} />')
content = content.replace('<BulletEditor sKey="positions" ei={i} />', '<BulletEditor bullets={pos.bullets} sKey="positions" ei={i} ps={ps} setPs={setPs} updBullet={updBullet} remBullet={remBullet} addBullet={addBullet} />')

with open("src/App.jsx", "w") as f:
    f.write(content)

