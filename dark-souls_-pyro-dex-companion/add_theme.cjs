const fs = require('fs');
let content = fs.readFileSync('src/index.css', 'utf8');

const twTheme = `
@theme {
  --font-serif: var(--theme-font-serif);
  --font-mono: var(--theme-font-mono);
}
`;

content = content.replace('@import "tailwindcss";', '@import "tailwindcss";\n' + twTheme);
fs.writeFileSync('src/index.css', content);
