const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const download = require('image-downloader');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Mexc token medya klasörünü oluştur
  const mediaFolder = path.join(__dirname, 'MexcTokenMedia');
  if (!fs.existsSync(mediaFolder)){
    fs.mkdirSync(mediaFolder);
  }

  await page.goto('https://www.mexc.com/tr-TR/markets');
  let currentPage = 1;

  while (currentPage <= 53) {
    // Token resimlerini ve isimlerini çek
    const tokens = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('.marketList_icon__0JtBF')).map(element => {
        let imageUrl = element.style.backgroundImage.slice(5, -2).replace('/api/', 'https://www.mexc.com/api/');
        let fullSymbol = element.nextSibling.textContent.trim();
        let symbol = fullSymbol.split('/')[0]; // '/' karakterine göre ayır ve ilk kısmı al
        return {
          symbol,
          imageUrl,
          filename: symbol.replace(/[\s\/\\?%*:|"<>]/g, '') // Dosya adı için geçersiz karakterleri temizle
        };
      });
    });

    // Resimleri indir
    for (const token of tokens) {
      const options = {
        url: token.imageUrl,
        dest: path.join(mediaFolder, `${token.filename}.png`)  // Dosya ismini token sembolü olarak kaydet
      };

      try {
        const { filename } = await download.image(options);
        console.log('Resim kaydedildi:', filename);
      } catch (error) {
        console.error('Resim indirme hatası:', error);
      }
    }

    // Sayfa numarasını güncelle
    currentPage = await page.evaluate(() => {
      const activePageElement = document.querySelector('.ant-pagination-item-active a');
      return Number(activePageElement.innerText);
    });

    // Sonraki sayfaya geçiş (son sayfa kontrolü)
    if (currentPage < 53) {
      await page.click('.ant-pagination-next:not(.ant-pagination-disabled) button');
      await page.waitForSelector(`.ant-pagination-item-${currentPage + 1}.ant-pagination-item-active`); // Yeni sayfanın yüklenmesini bekler
    }
  }
  console.log('Tüm sayfalar tarandı ve işlem tamamlandı.');
  await browser.close();
})();
