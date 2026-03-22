const fs = require('fs');
let code = fs.readFileSync('data.js', 'utf8');

// Replace for Классические роллы
code = code.replace(/category:\s*"Классические роллы",\s*items:\s*\[([\s\S]*?)\]/, (match, items) => {
    return `category: "Классические роллы",\n    items: [` + items.replace(/image:\s*"[^"]+"/g, 'image: "img/classic_maki_roll.png"') + `]`;
});

// Replace for Запеченные роллы
code = code.replace(/category:\s*"Запеченные роллы",\s*items:\s*\[([\s\S]*?)\]/, (match, items) => {
    return `category: "Запеченные роллы",\n    items: [` + items.replace(/image:\s*"[^"]+"/g, 'image: "img/baked_sushi_roll.png"') + `]`;
});

// Replace for Премиум роллы
code = code.replace(/category:\s*"Премиум роллы",\s*items:\s*\[([\s\S]*?)\]/, (match, items) => {
    return `category: "Премиум роллы",\n    items: [` + items.replace(/image:\s*"[^"]+"/g, 'image: "img/premium_sushi_roll.png"') + `]`;
});

fs.writeFileSync('data.js', code);
