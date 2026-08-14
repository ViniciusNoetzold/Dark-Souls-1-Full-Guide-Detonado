const fs = require('fs');
const path = require('path');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            if(file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.css')) results.push(file);
        }
    });
    return results;
}

const files = walk('./src');
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Accents
    content = content.replace(/#ff4e00/g, 'var(--theme-accent)');
    content = content.replace(/#d97706/g, 'var(--theme-accent-muted)');
    
    // We can also replace font-serif with font-theme-heading etc, but let's just redefine standard font-serif in tailwind config if possible.
    
    fs.writeFileSync(file, content, 'utf8');
});
console.log('Replaced colors with CSS variables');
