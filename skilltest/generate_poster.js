const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const width = 1200;
const height = 1600;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

// --- 1. Background: Void Black ---
ctx.fillStyle = '#000000';
ctx.fillRect(0, 0, width, height);

// --- 2. Color Palette ---
const colors = {
    black: '#000000',
    white: '#FFFFFF',
    neon: '#CCFF00' // Electric Lime
};

// --- 3. Geometric Sound Waves (The "Sonic" aspect) ---
// We'll create a concentric pattern that looks like a speaker cone or radar
ctx.lineWidth = 4;
const centerX = width / 2;
const centerY = height / 2;
const maxRadius = Math.sqrt(width * width + height * height) / 2;

// Draw repeating circles (The Bass)
for (let r = 50; r < maxRadius; r += 40) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
    // Alternating style
    if ((r / 40) % 2 === 0) {
        ctx.strokeStyle = colors.white;
        ctx.setLineDash([20, 10]); // Dashed line for rhythm
    } else {
        ctx.strokeStyle = 'rgba(204, 255, 0, 0.3)'; // Dim neon
        ctx.setLineDash([]);
    }
    ctx.stroke();
}

// Draw interference lines (The Treble)
ctx.save();
ctx.translate(centerX, centerY);
ctx.strokeStyle = colors.neon;
ctx.lineWidth = 2;
const numLines = 36;
for (let i = 0; i < numLines; i++) {
    ctx.rotate((Math.PI * 2) / numLines);
    ctx.beginPath();
    ctx.moveTo(100, 0);
    ctx.lineTo(maxRadius, 0);
    ctx.stroke();
}
ctx.restore();

// --- 4. Bold Typography as Rhythm ---
// We want huge text that interacts with the geometry
const fontMain = 'Arial, sans-serif'; // Keeping it standard but bold

ctx.save();
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';

// "SONIC" - Massive, White, clipped by bars
ctx.fillStyle = colors.white;
ctx.font = `900 250px "${fontMain}"`;
ctx.fillText('SONIC', centerX, height * 0.3);

// "GEOMETRY" - Outlined, Neon
ctx.strokeStyle = colors.neon;
ctx.lineWidth = 5;
ctx.font = `900 160px "${fontMain}"`;
ctx.strokeText('GEOMETRY', centerX, height * 0.45);

// "FESTIVAL" - Repeating echo effect
ctx.font = `bold 80px "${fontMain}"`;
for (let i = 0; i < 5; i++) {
    ctx.fillStyle = `rgba(255, 255, 255, ${1 - i * 0.2})`;
    ctx.fillText('FESTIVAL', centerX, height * 0.6 + (i * 70));
}

ctx.restore();

// --- 5. Data Points (Micro Labels) ---
ctx.fillStyle = colors.white;
ctx.font = `bold 24px "${fontMain}"`;
ctx.textAlign = 'left';

// Location and Date - corners
function drawLabel(text, x, y, align = 'left') {
    ctx.save();
    ctx.textAlign = align;
    ctx.fillText(text, x, y);
    // Draw a small bar next to it
    ctx.fillStyle = colors.neon;
    const barW = 40;
    const barH = 6;
    if (align === 'left') {
        ctx.fillRect(x, y + 10, barW, barH);
    } else {
        ctx.fillRect(x - barW, y + 10, barW, barH);
    }
    ctx.restore();
}

drawLabel('TOKYO / SHIBUYA', 60, height - 100, 'left');
drawLabel('2026.10.31', width - 60, height - 100, 'right');

// --- 6. Energy Overlay (Visual Noise) ---
// Random small geometric shapes to add "texture" without dirt
for (let i = 0; i < 50; i++) {
    const x = Math.random() * width;
    const y = Math.random() * height;
    const s = Math.random() * 20 + 5;
    
    ctx.fillStyle = Math.random() > 0.5 ? colors.neon : colors.white;
    if (Math.random() > 0.5) {
        ctx.fillRect(x, y, s, s); // Square
    } else {
        ctx.beginPath();
        ctx.arc(x, y, s/2, 0, Math.PI*2); // Circle
        ctx.fill();
    }
}

// --- 7. Final Polish: Scanlines ---
ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
for (let y = 0; y < height; y += 4) {
    ctx.fillRect(0, y, width, 2);
}

// Save
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(path.join(__dirname, 'Sonic_Geometry_Poster.png'), buffer);
console.log('Poster generated successfully at ' + path.join(__dirname, 'Sonic_Geometry_Poster.png'));
