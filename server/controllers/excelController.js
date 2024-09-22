const path = require('path');
const fs = require('fs').promises;
const xlsx = require('xlsx');
const downloadReport = require('../utils/download');

exports.getExcelFiles = async (req, res) => {
  try {
    const tmpDir = path.join(process.cwd(), 'public', 'site', 'tmp');
    const files = await fs.readdir(tmpDir);
    const xlsxFiles = files.filter(file => file.endsWith('.xlsx'));
    res.json(xlsxFiles);
  } catch (error) {
    console.error('Error reading tmp directory:', error);
    res.status(500).json({ error: 'Error fetching Excel files' });
  }
};

exports.getExcelContentByDomain = async (req, res) => {
  try {
    const { domainName } = req.params;
    const filePath = path.join(process.cwd(), 'public', 'site', 'tmp', `${domainName}.xlsx`);
    try {
      await fs.access(filePath);
    } catch (error) {
      return res.status(404).json({ error: 'Excel file not found' });
    }
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet, { header: 1 });
    const urls = data.slice(1).map(row => row[0]).filter(Boolean);
    res.json(urls);
  } catch (error) {
    console.error('Error reading Excel file:', error);
    res.status(500).json({ error: 'Error reading Excel file', details: error.message });
  }
};

exports.checkExcelFile = async (req, res) => {
  const { domainName } = req.params;
  try {
    const filePath = path.join(process.cwd(), 'public', 'site', 'tmp', `${domainName}.xlsx`);
    const fileExists = await fs.access(filePath).then(() => true).catch(() => false);
    res.json({ hasFile: fileExists });
  } catch (error) {
    console.error('Error checking Excel file:', error);
    res.status(500).json({ error: 'Error checking Excel file' });
  }
};

exports.downloadReport = async (req, res) => {
  const { domainName } = req.params;
  try {
    const [siteResult] = await pool.query('SELECT * FROM sites WHERE domain_name = ?', [domainName]);
    if (!siteResult.length) {
      return res.status(404).json({ error: 'Site not found' });
    }
    const site = siteResult[0];
    const [languageResult] = await pool.query(`
      SELECT l.name AS language
      FROM site_languages sl
      JOIN sites_langs l ON sl.language_id = l.id
      WHERE sl.site_id = ?`, [site.id]);
    const language = languageResult.length ? languageResult[0].language : null;
    await downloadReport({ domainName: site.domain_name, language: language || 'default', monthlyVisitors: site.monthly_visitors });
    res.json({ message: 'Download started' });
  } catch (error) {
    console.error('Error starting download:', error);
    res.status(500).json({ error: 'Error starting download' });
  }
};

exports.bulkDownloadReports = async (req, res) => {
  const { sites } = req.body;
  try {
    for (let site of sites) {
      await downloadReport({
        domainName: site.domain_name,
        language: site.language,
        monthlyVisitors: site.monthly_visitors
      });
    }
    res.json({ message: 'Bulk download started' });
  } catch (error) {
    console.error('Error starting bulk download:', error);
    res.status(500).json({ error: 'Error starting bulk download' });
  }
};
