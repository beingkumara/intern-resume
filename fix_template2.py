with open("src/templates/Template2.jsx", "r") as f:
    content = f.read()

# Add import
content = content.replace('import React, { useState, useRef, useLayoutEffect } from "react";', 'import React, { useState, useRef, useLayoutEffect } from "react";\nimport { formatText } from "../utils";')

# Replace {b} with {formatText(b)}
content = content.replace('{boldFirst ? <BoldFirst text={b} /> : b}', '{boldFirst ? <BoldFirst text={b} /> : formatText(b)}')

# Modify BoldFirst
content = content.replace('return <><strong>{text.slice(0, idx)}</strong>{"—" + text.slice(idx + 1)}</>;', 'return <><strong>{formatText(text.slice(0, idx))}</strong>{"—"}{formatText(text.slice(idx + 1))}</>;')
content = content.replace('if (idx === -1) return <>{text}</>;', 'if (idx === -1) return <>{formatText(text)}</>;')

# Coursework
content = content.replace('<li key={i} style={{ ...liStyle, paddingLeft: 0 }}>{c}</li>', '<li key={i} style={{ ...liStyle, paddingLeft: 0 }}>{formatText(c)}</li>')

# Skills
content = content.replace('<strong>Languages:</strong> {skills.languages}', '<strong>Languages:</strong> {formatText(skills.languages)}')
content = content.replace('<strong>Frameworks:</strong> {skills.frameworks}', '<strong>Frameworks:</strong> {formatText(skills.frameworks)}')
content = content.replace('<strong>Tools:</strong> {skills.tools}', '<strong>Tools:</strong> {formatText(skills.tools)}')
content = content.replace('<strong>Databases:</strong> {skills.databases}', '<strong>Databases:</strong> {formatText(skills.databases)}')

with open("src/templates/Template2.jsx", "w") as f:
    f.write(content)

