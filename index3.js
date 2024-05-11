const fs = require('fs');
const path = require('path');
const axios = require('axios');

const moveTokenImages = async () => {
  try {
    // API'den token bilgilerini çek
    const response = await axios.get('http://localhost:4001/tokens?chainName=SOLANA');
    const tokens = response.data;

    // Klasörleri tanımla
    const sourceFolder = path.join(__dirname, 'MexcTokenMedia');
    const targetFolder = path.join(__dirname, 'NewTokenMedia');

    // Hedef klasörü kontrol et ve yoksa oluştur
    if (!fs.existsSync(targetFolder)){
      fs.mkdirSync(targetFolder);
    }

    // Her bir token için resimleri taşı
    let movedCount = 0;
    tokens.forEach(token => {
      const sourceFile = path.join(sourceFolder, `${token.currency}.png`);
      const targetFile = path.join(targetFolder, `${token.currency}.png`);

      if (fs.existsSync(sourceFile)) {
        fs.renameSync(sourceFile, targetFile);
        console.log(`${token.currency} resmi taşındı.`);
        movedCount++;
      } else {
        console.log(`${token.currency} için resim bulunamadı.`);
      }
    });

    console.log(`${movedCount} adet resim başarıyla taşındı.`);
  } catch (error) {
    console.error('İşlem sırasında bir hata meydana geldi:', error);
  }
};

moveTokenImages();
