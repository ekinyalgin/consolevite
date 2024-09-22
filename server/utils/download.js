const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs'); // Dosya sistemi işlemleri için

async function downloadReport({ domainName, language, monthlyVisitors }) {
    const browser = await chromium.launch({
        headless: true,
    });

    const context = await browser.newContext({
        acceptDownloads: true
    });

    const page = await context.newPage();

    // Tam ekran yapma kodu
    await page.evaluate(() => {
        window.moveTo(0, 0);
        window.resizeTo(screen.width, screen.height);
    });

    try {
        await page.goto('https://app.toolsminati.com/login', { waitUntil: 'networkidle' });

        await page.fill('#amember-login', 'ekinyalgin@gmail.com');
        await page.fill('#amember-pass', 'qhunxciitm');
        await page.click('input[type="submit"]');
        await page.waitForNavigation({ waitUntil: 'networkidle' });

        const previousMonth = getPreviousMonth();
        const targetUrl = `https://sr.toolsminati.com/analytics/organic/pages/?filter=%7B%22search%22%3A%22%22%2C%22intentPositions%22%3A%5B%5D%2C%22advanced%22%3A%7B%220%22%3A%7B%22inc%22%3Atrue%2C%22fld%22%3A%22tf%22%2C%22cri%22%3A%22%3E%22%2C%22val%22%3A${monthlyVisitors}%7D%7D%7D&db=${language}&q=${domainName}&searchType=domain&date=${previousMonth}`;

//        const targetUrl = `https://sr.toolsminati.com/analytics/organic/pages/?sortField=&sortDirection=desc&filter=%7B%22search%22%3A%22%22%2C%22intentPositions%22%3A%5B%5D%2C%22advanced%22%3A%7B%220%22%3A%7B%22inc%22%3Atrue%2C%22fld%22%3A%22tf%22%2C%22cri%22%3A%22%3E%22%2C%22val%22%3A${monthlyVisitors}%7D%7D%7D&db=${language}&q=${domainName}&searchType=domain&date=${previousMonth}`;

        await page.goto(targetUrl, { waitUntil: 'load'});

        // Export butonuna tıklayın
        await page.click('button[aria-label="Export organic pages data"]');
        await page.waitForTimeout(2500);

        // Excel butonuna tıklayın
        const [download] = await Promise.all([
            page.waitForEvent('download'),
            page.click('text="Excel"')
        ]);

        // Dosya yolu ve adı belirleme
        const downloadPath = path.resolve(__dirname, '..', 'public', 'site', 'tmp');
        const fileName = `${domainName}.xlsx`;
        const filePath = path.join(downloadPath, fileName);

        // Eğer aynı isimde bir dosya varsa, onu sil
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`Mevcut dosya silindi: ${filePath}`);
        }

        // Dosyayı indir ve belirlenen konuma kaydet
        await download.saveAs(filePath);
        await download.path(); // Dosyanın başarılı bir şekilde indirildiğinden emin olmak için
        console.log('Dosya başarıyla indirildi:', filePath);
        await new Promise(resolve => setTimeout(resolve, 5000));

    } catch (error) {
        console.error('İşlem sırasında bir hata oluştu:', error);
    } finally {
        await browser.close();
    }
}

function getPreviousMonth() {
    const today = new Date();
    const firstDayOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfPreviousMonth = new Date(firstDayOfCurrentMonth - 1);
    return lastDayOfPreviousMonth.toISOString().slice(0, 7).replace('-', '');
}

module.exports = downloadReport;
