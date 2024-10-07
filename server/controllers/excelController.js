const path = require('path');
const fs = require('fs').promises;
const xlsx = require('xlsx');
const downloadReport = require('../utils/download');
const { Url, Site } = require('../models');
const { Op } = require('sequelize');

// Projenin kök dizinindeki 'public' klasörünün yolunu belirle
const PUBLIC_DIR = path.resolve(__dirname, '../../public');

exports.getExcelFiles = async (req, res) => {
  try {
    const tmpDir = path.join(PUBLIC_DIR, 'site', 'tmp');
    const files = await fs.readdir(tmpDir);
    const xlsxFiles = files.filter(file => file.endsWith('.xlsx'));
    res.json(xlsxFiles);
  } catch (error) {
    console.error('Error reading tmp directory:', error);
    res.status(500).json({ error: 'Error fetching Excel files' });
  }
};

exports.getExcelContent = async (req, res) => {
  const { domainName } = req.params;
  
  try {
    const filePath = path.join(PUBLIC_DIR, 'site', 'tmp', `${domainName}.xlsx`);
  
    if (!(await fs.access(filePath).then(() => true).catch(() => false))) {
     return res.status(404).json({ error: 'Excel file not found' });
    }
  
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
  
    const headerRow = jsonData[0];
    const urlColumnIndex = headerRow.findIndex(col => 
      typeof col === 'string' && col.toLowerCase() === 'url'
    );
  
    if (urlColumnIndex === -1) {
      return res.status(400).json({ error: 'URL column not found in Excel file' });
    }
  
    const urls = jsonData.slice(1).map(row => row[urlColumnIndex]).filter(url => url);
  
    if (urls.length === 0) {
      return res.status(404).json({ error: 'No URLs found in Excel file' });
    }
  
    return res.json(urls);
  } catch (error) {
    console.error('Error fetching Excel content:', error);
    res.status(500).json({ error: 'Error reading Excel content' });
  }
};

exports.checkExcelFile = async (req, res) => {
  const { domainName } = req.params;
  try {
    const filePath = path.join(PUBLIC_DIR, 'site', 'tmp', `${domainName}.xlsx`);
    const fileExists = await fs.access(filePath).then(() => true).catch(() => false);
    res.json({ hasFile: fileExists });
  } catch (error) {
    console.error('Error checking Excel file:', error);
    res.status(500).json({ error: 'Error checking Excel file' });
  }
};

exports.downloadExcel = async (req, res) => {
  const domainName = req.params.domainName;
  const { language, monthlyVisitors } = req.query;
  
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  
  try {
    await downloadReport({
      domainName,
      language,
      monthlyVisitors,
      onProgress: (message) => {
        res.write(`data: ${JSON.stringify({ message })}\n\n`);
      }
    });
  
    const filePath = path.join(PUBLIC_DIR, 'site', 'tmp', `${domainName}.xlsx`);
    const fileExists = await fs.access(filePath).then(() => true).catch(() => false);
    
    if (fileExists) {
      res.write(`data: ${JSON.stringify({ message: `Download completed for ${domainName}` })}\n\n`);
    } else {
      res.write(`data: ${JSON.stringify({ message: `File not found for ${domainName}` })}\n\n`);
    }
    res.end();
  } catch (error) {
    console.error('Error during download:', error);
    res.write(`data: ${JSON.stringify({ message: `An error occurred while downloading the file for ${domainName}` })}\n\n`);
    res.end();
  }
};

exports.deleteExcelFile = async (req, res) => {
  const { domainName } = req.params;
  try {
    const filePath = path.join(PUBLIC_DIR, 'site', 'tmp', `${domainName}.xlsx`);
    await fs.unlink(filePath);
    res.json({ message: 'Excel file deleted successfully' });
  } catch (error) {
    console.error('Error deleting Excel file:', error);
    if (error.code === 'ENOENT') {
      res.status(404).json({ error: 'Excel file not found' });
    } else {
      res.status(500).json({ error: 'Error deleting Excel file' });
    }
  }
};

exports.bulkDownloadReports = async (req, res) => {
  const { sites } = req.body; // [{ domainName, language, monthlyVisitors }]
  
  try {
    const downloadPromises = sites.map(site =>
      downloadReport({
        domainName: site.domainName,
        language: site.language,
        monthlyVisitors: site.monthlyVisitors,
        onProgress: (message) => {
          console.log(`Bulk download for ${site.domainName}: ${message}`);
        }
      })
    );
  
    await Promise.all(downloadPromises.slice(0, 5));
  
    for (let i = 5; i < downloadPromises.length; i += 5) {
      const batch = downloadPromises.slice(i, i + 5);
      await Promise.all(batch);
    }
  
    res.status(200).json({ message: 'Bulk download completed' });
  } catch (error) {
    console.error('Error during bulk download:', error);
    res.status(500).json({ error: 'Error during bulk download' });
  }
};

exports.addUrlsFromExcel = async (req, res) => {
  const { domainName } = req.params;
  const { urls } = req.body;
  try {
    const addedUrls = await Url.bulkCreate(
      urls.map(url => ({ url, domain_name: domainName, reviewed: false }))
    );

    await Site.increment('not_reviewed_pages', { 
      by: urls.length, 
      where: { domain_name: domainName } 
    });

    res.json({ message: 'URLs added successfully', addedUrls });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.addUrlsFromExcelAndDelete = async (req, res) => {
  const { sites } = req.body; // sites bir dizi olmalı: [{ domainName, id }, ...]
  const results = [];

  for (const site of sites) {
    try {
      const filePath = path.join(PUBLIC_DIR, 'site', 'tmp', `${site.domainName}.xlsx`);
      
      // Excel dosyasını oku
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

      // URL sütununu bul
      const headerRow = jsonData[0];
      const urlColumnIndex = headerRow.findIndex(col => 
        typeof col === 'string' && col.toLowerCase() === 'url'
      );

      if (urlColumnIndex === -1) {
        results.push({ domainName: site.domainName, status: 'error', message: 'URL column not found' });
        continue;
      }

      // URL'leri çıkar
      const urls = jsonData.slice(1).map(row => row[urlColumnIndex]).filter(url => url);

      // URL'leri veritabanına ekle
      const addedUrls = await Url.bulkCreate(
        urls.map(url => ({ url, domain_name: site.domainName, reviewed: false }))
      );

      // Site'ın not_reviewed_pages sayısını güncelle
      await Site.increment('not_reviewed_pages', { 
        by: addedUrls.length, 
        where: { domain_name: site.domainName } 
      });

      // Excel dosyasını sil
      await fs.unlink(filePath);

      results.push({ 
        domainName: site.domainName, 
        status: 'success', 
        addedUrls: addedUrls.length,
        message: 'URLs added and Excel file deleted'
      });

    } catch (error) {
      console.error(`Error processing ${site.domainName}:`, error);
      results.push({ 
        domainName: site.domainName, 
        status: 'error', 
        message: error.message 
      });
    }
  }

  res.json({ results });
};