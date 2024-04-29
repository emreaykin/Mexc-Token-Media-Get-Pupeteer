const fs = require('fs');
const path = require('path');

// MexcTokenMedia klasörünün yolu
const directoryPath = path.join(__dirname, 'MexcTokenMedia');

// Klasördeki dosyaları listele
fs.readdir(directoryPath, (err, files) => {
  if (err) {
    console.log('Dosya okuma hatası:', err);
    return;
  }
  // Dosya sayısını filtreleyerek say (sadece .png dosyaları)
  const imageCount = files.filter(file => path.extname(file) === '.png').length;
  console.log(`Toplam resim dosyası sayısı: ${imageCount}`);
});
