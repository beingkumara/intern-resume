import re

with open("src/App.jsx", "r") as f:
    content = f.read()

# 1. Add imports
content = content.replace(
    'import { useUser, useAuth, SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";',
    'import { useUser, useAuth, SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";\nimport Template1 from "./templates/Template1";\nimport Template2 from "./templates/Template2";'
)

# 2. Add state
content = content.replace(
    'const [showForm, setShowForm] = useState(true);',
    'const [showForm, setShowForm] = useState(true);\n    const [selectedTemplate, setSelectedTemplate] = useState("template1");'
)

# 3. Add toggle
toggle_old = '<button onClick={() => setShowForm(f => !f)} style={{ padding: "6px 14px", background: "#1e293b", color: "#94a3b8", border: "1px solid #334155", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>'
toggle_new = '''<select 
                    value={selectedTemplate} 
                    onChange={e => setSelectedTemplate(e.target.value)}
                    style={{ padding: "6px 10px", background: "#1e293b", color: "#94a3b8", border: "1px solid #334155", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600 }}
                >
                    <option value="template1">Template 1</option>
                    <option value="template2">Template 2</option>
                </select>
                <button onClick={() => setShowForm(f => !f)} style={{ padding: "6px 14px", background: "#1e293b", color: "#94a3b8", border: "1px solid #334155", borderRadius: 6, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>'''
content = content.replace(toggle_old, toggle_new)

# 4. Replace Preview component call
preview_old = '<Preview d={d} />'
preview_new = '{selectedTemplate === "template1" ? <Template1 d={d} /> : <Template2 d={d} />}'
content = content.replace(preview_old, preview_new)

# 5. Remove dead code (from BoldFirst to end of Preview)
start_str = 'function BoldFirst({ text }) {'
end_str = 'function ProfileSync({ d, setD }) {'

start_idx = content.find(start_str)
end_idx = content.find(end_str)

if start_idx != -1 and end_idx != -1:
    content = content[:start_idx] + content[end_idx:]

with open("src/App.jsx", "w") as f:
    f.write(content)

