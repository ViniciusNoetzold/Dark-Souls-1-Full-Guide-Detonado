const fs = require('fs');

const css = `
:root {
  --theme-accent: #ff4e00;
  --theme-accent-muted: #d97706;
  --theme-font-serif: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif;
  --theme-font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}

[data-theme="sorcerer"] {
  --theme-accent: #3b82f6;
  --theme-accent-muted: #2563eb;
  --theme-font-serif: "Cinzel", "Trajan Pro", "Baskerville", serif;
  --theme-font-mono: "Fira Code", monospace;
}

[data-theme="cleric"] {
  --theme-accent: #fbbf24;
  --theme-accent-muted: #d97706;
  --theme-font-serif: "Palatino Linotype", "Book Antiqua", Palatino, serif;
  --theme-font-mono: "Courier Prime", monospace;
}

[data-theme="abyssal"] {
  --theme-accent: #a855f7;
  --theme-accent-muted: #9333ea;
  --theme-font-serif: "Garamond", "Times New Roman", serif;
  --theme-font-mono: "VT323", monospace;
}

[data-theme="hollow"] {
  --theme-accent: #a1a1aa;
  --theme-accent-muted: #71717a;
  --theme-font-serif: "Courier New", monospace;
  --theme-font-mono: "Courier", monospace;
}
`;

let content = fs.readFileSync('src/index.css', 'utf8');

// Replace the old block
content = content.replace(/:root \{[\s\S]*?\}\s*\[data-theme="hollow"\] \{[\s\S]*?\}/, css.trim());

fs.writeFileSync('src/index.css', content);
