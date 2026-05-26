import React from 'react';

// Very lightweight markdown-like parser for bold and italic
export function formatText(text) {
    if (!text) return text;
    if (typeof text !== 'string') return text;

    // Split by ** for bold
    const boldParts = text.split(/(\*\*.*?\*\*)/g);
    
    return boldParts.map((part, i) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            const inner = part.slice(2, -2);
            return <strong key={i}>{formatItalic(inner)}</strong>;
        }
        return <React.Fragment key={i}>{formatItalic(part)}</React.Fragment>;
    });
}

function formatItalic(text) {
    const italicParts = text.split(/(\*.*?\*)/g);
    return italicParts.map((part, i) => {
        if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
            return <em key={i}>{part.slice(1, -1)}</em>;
        }
        return <React.Fragment key={i}>{part}</React.Fragment>;
    });
}
