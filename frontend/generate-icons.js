import { createCanvas } from 'canvas';
import fs from 'fs';

const sizes = [192, 512];

sizes.forEach(size => {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#10b981');
  gradient.addColorStop(1, '#059669');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  
  // House icon
  ctx.fillStyle = '#ffffff';
  const houseSize = size * 0.6;
  const houseX = (size - houseSize) / 2;
  const houseY = (size - houseSize) / 2;
  
  // House body
  ctx.fillRect(houseX, houseY + houseSize * 0.3, houseSize, houseSize * 0.7);
  
  // Roof
  ctx.beginPath();
  ctx.moveTo(houseX, houseY + houseSize * 0.3);
  ctx.lineTo(size / 2, houseY);
  ctx.lineTo(houseX + houseSize, houseY + houseSize * 0.3);
  ctx.closePath();
  ctx.fill();
  
  // Door
  ctx.fillStyle = '#0f766e';
  const doorWidth = houseSize * 0.2;
  const doorHeight = houseSize * 0.4;
  ctx.fillRect(
    size / 2 - doorWidth / 2,
    houseY + houseSize * 0.6,
    doorWidth,
    doorHeight
  );
  
  // Save to file
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(`public/icon-${size}.png`, buffer);
  console.log(`Generated icon-${size}.png`);
});