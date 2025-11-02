// generate-icons.js - À exécuter une fois pour créer des icônes de base
const fs = require('fs');
const { createCanvas } = require('canvas');

// Créer logo192.png
const canvas192 = createCanvas(192, 192);
const ctx192 = canvas192.getContext('2d');
ctx192.fillStyle = '#4f46e5';
ctx192.fillRect(0, 0, 192, 192);
ctx192.fillStyle = 'white';
ctx192.font = 'bold 80px Arial';
ctx192.textAlign = 'center';
ctx192.fillText('💬', 96, 120);
const buffer192 = canvas192.toBuffer('image/png');
fs.writeFileSync('public/logo192.png', buffer192);

// Créer logo512.png  
const canvas512 = createCanvas(512, 512);
const ctx512 = canvas512.getContext('2d');
ctx512.fillStyle = '#4f46e5';
ctx512.fillRect(0, 0, 512, 512);
ctx512.fillStyle = 'white';
ctx512.font = 'bold 200px Arial';
ctx512.textAlign = 'center';
ctx512.fillText('💬', 256, 320);
const buffer512 = canvas512.toBuffer('image/png');
fs.writeFileSync('public/logo512.png', buffer512);

console.log('Icônes PWA générées !');