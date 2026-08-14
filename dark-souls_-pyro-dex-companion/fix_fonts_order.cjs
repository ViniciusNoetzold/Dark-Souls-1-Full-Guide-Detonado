const fs = require('fs');
let content = fs.readFileSync('src/index.css', 'utf8');

// Remove the import from inside
content = content.replace("@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400..900&family=Comic+Neue:wght@400;700&family=Fredoka:wght@300..700&family=Inter:wght@100..900&family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Quicksand:wght@300..700&display=swap');", "");

// Prepend it to the file
content = "@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400..900&family=Comic+Neue:wght@400;700&family=Fredoka:wght@300..700&family=Inter:wght@100..900&family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Quicksand:wght@300..700&display=swap');\n" + content;

fs.writeFileSync('src/index.css', content);
