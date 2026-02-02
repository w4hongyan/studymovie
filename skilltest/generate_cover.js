const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const width = 1200;
const height = 1600;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

// --- 1. Background: Deep Blue to Cyan Gradient ---
const bgGradient = ctx.createLinearGradient(0, 0, width, height);
bgGradient.addColorStop(0, '#001f3f'); // Deep Blue
bgGradient.addColorStop(0.6, '#004050'); // Mid transition
bgGradient.addColorStop(1, '#008080'); // Teal/Cyan mix
ctx.fillStyle = bgGradient;
ctx.fillRect(0, 0, width, height);

// --- 2. Grid System (The "Digital" aspect) ---
ctx.lineWidth = 1;
ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
const gridSize = 80;

// Draw Grid
for (let x = 0; x <= width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
}
for (let y = 0; y <= height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
}

// --- 3. Fluid Shapes (The "Organic" aspect) ---
function drawFluidShape(x, y, size, color, blendMode = 'source-over') {
    ctx.save();
    ctx.globalCompositeOperation = blendMode;
    ctx.fillStyle = color;
    ctx.beginPath();
    
    // Create a random blob using bezier curves
    const points = [];
    const numPoints = 12; // Smoother shape
    const angleStep = (Math.PI * 2) / numPoints;
    
    // Use a fixed seed-like random for reproducibility in this context
    // But Math.random is fine for art
    for (let i = 0; i < numPoints; i++) {
        const angle = i * angleStep;
        // Introduce organic irregularity
        const r = size * (0.7 + Math.random() * 0.5); 
        points.push({
            x: x + Math.cos(angle) * r,
            y: y + Math.sin(angle) * r
        });
    }

    // Draw smooth curve through points
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 0; i < points.length; i++) {
        const p0 = points[i];
        const p1 = points[(i + 1) % points.length];
        const cp = {
            x: (p0.x + p1.x) / 2,
            y: (p0.y + p1.y) / 2
        };
        ctx.quadraticCurveTo(p0.x, p0.y, cp.x, cp.y);
    }
    
    ctx.closePath();
    // Create a radial gradient for the fill to give it volume
    const fillGrad = ctx.createRadialGradient(x, y, 0, x, y, size * 1.2);
    fillGrad.addColorStop(0, color);
    fillGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = fillGrad;
    ctx.fill();

    ctx.restore();
}

// Layering fluid shapes
// Center-ish large glows
drawFluidShape(width * 0.5, height * 0.4, 500, 'rgba(0, 50, 100, 0.4)', 'screen');
drawFluidShape(width * 0.3, height * 0.6, 400, 'rgba(0, 255, 255, 0.15)', 'screen');
drawFluidShape(width * 0.7, height * 0.5, 450, 'rgba(0, 150, 150, 0.2)', 'screen');
drawFluidShape(width * 0.5, height * 0.8, 600, 'rgba(0, 20, 60, 0.5)', 'multiply'); // Depth

// --- 4. Flow Lines (Connecting Digital & Organic) ---
ctx.save();
ctx.lineWidth = 1.5;
ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
for (let i = 0; i < 25; i++) {
    const yStart = height * 0.2 + i * 30;
    ctx.beginPath();
    ctx.moveTo(0, yStart);
    ctx.bezierCurveTo(
        width * 0.4, yStart + (Math.sin(i) * 200),
        width * 0.6, yStart - (Math.cos(i) * 200),
        width, yStart
    );
    ctx.stroke();
}
ctx.restore();

// --- 5. Typography & UI Elements ---
// We'll use system fonts. Windows usually has Arial, Segoe UI, etc.
const fontMain = 'Segoe UI, Arial, sans-serif';

ctx.fillStyle = '#FFFFFF';
ctx.textAlign = 'center';

// Title
ctx.save();
ctx.shadowColor = 'rgba(0, 255, 255, 0.5)';
ctx.shadowBlur = 20;
ctx.font = `300 100px "${fontMain}"`; 
ctx.fillText('Digital', width / 2, height / 2 - 20);
ctx.font = `600 100px "${fontMain}"`; 
ctx.fillText('Organics', width / 2, height / 2 + 80);
ctx.restore();

// Subtitle / Annual Report
ctx.font = `200 24px "${fontMain}"`;
// Simulating letter spacing by drawing characters manually or just keeping it simple
// Canvas text tracking is hard without library support, so we stick to simple text
ctx.fillText('ANNUAL REPORT 2026', width / 2, 120);

// TechNova Inc. Logo area
ctx.textAlign = 'left';
ctx.font = `bold 20px "${fontMain}"`;
ctx.fillText('TechNova Inc.', 60, height - 60);

// Date / Ref
ctx.textAlign = 'right';
ctx.font = `200 20px "${fontMain}"`;
ctx.fillText('REF: 2026-AR-V1', width - 60, height - 60);

// --- 6. Technical Overlay Details (Crosshairs, etc) ---
ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
ctx.lineWidth = 2;

function drawCrosshair(x, y) {
    const s = 10;
    ctx.beginPath();
    ctx.moveTo(x - s, y); ctx.lineTo(x + s, y);
    ctx.moveTo(x, y - s); ctx.lineTo(x, y + s);
    ctx.stroke();
}

drawCrosshair(50, 50);
drawCrosshair(width - 50, 50);
drawCrosshair(50, height - 50);
drawCrosshair(width - 50, height - 50);

// A vertical line for data feel
ctx.beginPath();
ctx.moveTo(width / 2, height - 150);
ctx.lineTo(width / 2, height - 100);
ctx.stroke();

// Save
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(path.join(__dirname, 'Digital_Organics_Cover.png'), buffer);
console.log('Cover generated successfully at ' + path.join(__dirname, 'Digital_Organics_Cover.png'));
