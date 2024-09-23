// utils/download.js
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function downloadReport({ domainName, language, monthlyVisitors, onProgress }) {
    const logMessage = (message) => {
        console.log(message); 
        if (onProgress) onProgress(message); 
    };

    logMessage(`Starting download for domain: ${domainName}`);
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ acceptDownloads: true });
    const page = await context.newPage();

    try {
        await page.goto('https://app.toolsminati.com/login', { waitUntil: 'networkidle' });
        logMessage(`Logging in for domain: ${domainName}`);

        await page.fill('#amember-login', 'ekinyalgin@gmail.com');
        await page.fill('#amember-pass', 'qhunxciitm');
        await page.click('input[type="submit"]');
        await page.waitForNavigation({ waitUntil: 'networkidle' });

        const previousMonth = getPreviousMonth();
        const targetUrl = `https://sr.toolsminati.com/analytics/organic/pages/?filter=%7B%22search%22%3A%22%22%2C%22intentPositions%22%3A%5B%5D%2C%22advanced%22%3A%7B%220%22%3A%7B%22inc%22%3Atrue%2C%22fld%22%3A%22tf%22%2C%22cri%22%3A%22%3E%22%2C%22val%22%3A${monthlyVisitors}%7D%7D%7D&db=${language}&q=${domainName}&searchType=domain&date=${previousMonth}`;

        logMessage(`Navigating to data page for domain: ${domainName}`);
        await page.goto(targetUrl, { waitUntil: 'load' });

        await page.click('button[aria-label="Export organic pages data"]');
        await page.waitForTimeout(2500);
        logMessage(`Exporting data for domain: ${domainName}`);

        const [download] = await Promise.all([
            page.waitForEvent('download'),
            page.click('text="Excel"')
        ]);

        const downloadPath = path.resolve(__dirname, '..', 'public', 'site', 'tmp');
        const fileName = `${domainName}.xlsx`;
        const filePath = path.join(downloadPath, fileName);

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            logMessage(`Existing file deleted: ${filePath}`);
        }

        await download.saveAs(filePath);
        logMessage(`Download completed for domain: ${domainName}`);
    } catch (error) {
        console.error('Error during the process:', error);
        logMessage(`Error during download for domain: ${domainName}`);
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
