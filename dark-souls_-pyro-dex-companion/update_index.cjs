const fs = require('fs');

const css = `
:root {
  --theme-accent: #ff4e00;
  --theme-accent-muted: #d97706;
}

[data-theme="sorcerer"] {
  --theme-accent: #3b82f6;
  --theme-accent-muted: #2563eb;
}

[data-theme="cleric"] {
  --theme-accent: #fbbf24;
  --theme-accent-muted: #d97706;
}

[data-theme="abyssal"] {
  --theme-accent: #a855f7;
  --theme-accent-muted: #9333ea;
}

[data-theme="hollow"] {
  --theme-accent: #a1a1aa;
  --theme-accent-muted: #71717a;
}
`;

let content = fs.readFileSync('src/index.css', 'utf8');
content = content.replace('@import "tailwindcss";', '@import "tailwindcss";\n' + css);
fs.writeFileSync('src/index.css', content);
