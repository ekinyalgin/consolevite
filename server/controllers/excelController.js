const path = require('path');
const fs = require('fs');
const xlsx = require('xlsx');
const downloadReport = require('../utils/download');
const pool = require('../config/db');

exports.getExcelFiles = async (req, res) => {
  try {
    const tmpDir = path.join(process.cwd(), 'public', 'site', 'tmp');
    const files = await fs.promises.readdir(tmpDir);
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
	  const filePath = path.join(process.cwd(), 'public', 'site', 'tmp', `${domainName}.xlsx`);
  
	  if (!fs.existsSync(filePath)) {
		return res.status(404).json({ error: 'Excel file not found' });
	  }
  
	  const workbook = xlsx.readFile(filePath);
	  const sheetName = workbook.SheetNames[0];
	  const worksheet = workbook.Sheets[sheetName];
	  
	  const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
  
	  // Find the index of the "url" or "URL" column
	  const headerRow = jsonData[0];
	  const urlColumnIndex = headerRow.findIndex(col => 
		typeof col === 'string' && col.toLowerCase() === 'url'
	  );
  
	  if (urlColumnIndex === -1) {
		return res.status(400).json({ error: 'URL column not found in Excel file' });
	  }
  
	  // Extract URLs from the correct column
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
    const filePath = path.join(process.cwd(), 'public', 'site', 'tmp', `${domainName}.xlsx`);
    const fileExists = await fs.promises.access(filePath).then(() => true).catch(() => false);
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
  
	  const filePath = path.join(process.cwd(), 'public', 'site', 'tmp', `${domainName}.xlsx`);
	  if (fs.existsSync(filePath)) {
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
  
exports.bulkDownloadReports = async (req, res) => {
	const { sites } = req.body; // [{ domainName, language, monthlyVisitors }]
	
	try {
	  // Tüm indirme işlemlerini Promise'lerle başlatıyoruz
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
  
	  // Belirli sayıda eşzamanlı işlemin tamamlanmasını bekliyoruz
	  const results = await Promise.all(downloadPromises.slice(0, 5)); // İlk 5 tanesi için aynı anda indirme
  
	  // Geriye kalanları da 5'erli dilimlerle başlatabilirsiniz
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

exports.deleteExcelFile = async (req, res) => {
  const { domainName } = req.params;
  try {
    const filePath = path.join(process.cwd(), 'public', 'site', 'tmp', `${domainName}.xlsx`);
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      res.json({ message: 'Excel file deleted successfully' });
    } else {
      res.status(404).json({ error: 'Excel file not found' });
    }
  } catch (error) {
    console.error('Error deleting Excel file:', error);
    res.status(500).json({ error: 'Error deleting Excel file' });
  }
};

exports.addUrlsFromExcel = async (req, res) => {
  const { domainName } = req.params;
  const { urls } = req.body;
  try {
    const addedUrls = [];
    for (let url of urls) {
      const [result] = await pool.query('INSERT INTO urls (url, domain_name, reviewed) VALUES (?, ?, false)', [url, domainName]);
      addedUrls.push({ id: result.insertId, url, domain_name: domainName, reviewed: false });
    }

    // Update the site's not_reviewed_pages count
    //await pool.query('UPDATE sites SET not_reviewed_pages = not_reviewed_pages + ? WHERE domain_name = ?', [urls.length, domainName]);

    res.json({ message: 'URLs added successfully', addedUrls });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};