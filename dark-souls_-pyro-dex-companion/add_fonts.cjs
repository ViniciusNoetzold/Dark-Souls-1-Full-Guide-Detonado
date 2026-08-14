const fs = require('fs');

const fontCSS = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400..900&family=Comic+Neue:wght@400;700&family=Fredoka:wght@300..700&family=Inter:wght@100..900&family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Quicksand:wght@300..700&display=swap');

[data-font="classic"] {
  --font-sans: ui-sans-serif, system-ui, sans-serif;
  --font-serif: var(--theme-font-serif);
  --font-mono: var(--theme-font-mono);
}

[data-font="clean"] {
  --font-sans: 'Inter', sans-serif;
  --font-serif: 'Inter', sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, monospace;
}

[data-font="soft"] {
  --font-sans: 'Nunito', sans-serif;
  --font-serif: 'Quicksand', sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, monospace;
}

[data-font="cartoon"] {
  --font-sans: 'Fredoka', sans-serif;
  --font-serif: 'Fredoka', sans-serif;
  --font-mono: 'Comic Neue', cursive;
}
`;

let content = fs.readFileSync('src/index.css', 'utf8');

// Insert after @import "tailwindcss"; and before the themes
content = content.replace('@import "tailwindcss";', '@import "tailwindcss";\n' + fontCSS);

// Now update the @theme block to use the newly mapped data-font variables globally.
// Tailwind 4 handles this beautifully.
const themeCSS = `
@theme {
  --font-sans: var(--font-sans);
  --font-serif: var(--font-serif);
  --font-mono: var(--font-mono);
}
`;

content = content.replace(/@theme \{[\s\S]*?\}/, themeCSS.trim());

fs.writeFileSync('src/index.css', content);
