const pool = require('../config/db');

exports.getUrlsForDomain = async (req, res) => {
  const { domainName } = req.params;
  try {
    const [notReviewed] = await pool.query('SELECT * FROM urls WHERE domain_name = ? AND reviewed = false', [domainName]);
    const [reviewed] = await pool.query('SELECT * FROM urls WHERE domain_name = ? AND reviewed = true', [domainName]);
    res.json({ notReviewed, reviewed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.addUrlsToDomain = async (req, res) => {
  const { domainName } = req.params;
  const { urls } = req.body;
  try {
    for (let url of urls) {
      await pool.query('INSERT INTO urls (url, domain_name, reviewed) VALUES (?, ?, false)', [url, domainName]);
    }
    res.json({ message: 'URLs added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.markUrlAsReviewed = async (req, res) => {
  const { id } = req.params;
  const { reviewed } = req.body;
  try {
    await pool.query('UPDATE urls SET reviewed = ? WHERE id = ?', [reviewed, id]);
    res.json({ message: `URL marked as ${reviewed ? 'reviewed' : 'not reviewed'}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteUrl = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM urls WHERE id = ?', [id]);
    res.json({ message: 'URL deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getNotReviewedUrlsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const [rows] = await pool.query(
      'SELECT u.url FROM urls u JOIN sites s ON u.domain_name = s.domain_name JOIN site_categories sc ON s.id = sc.site_id JOIN sites_cats c ON sc.category_id = c.id WHERE c.name = ? AND u.reviewed = false',
      [category]
    );
    res.json(rows.map(row => row.url));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getRandomDomainsWithNotReviewedUrls = async (req, res) => {
  const { category } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT DISTINCT s.domain_name 
       FROM sites s 
       JOIN site_categories sc ON s.id = sc.site_id 
       JOIN sites_cats c ON sc.category_id = c.id 
       JOIN urls u ON s.domain_name = u.domain_name 
       WHERE c.name = ? AND u.reviewed = false 
       ORDER BY RAND() 
       LIMIT 5`,
      [category]
    );
    res.json(rows.map(row => row.domain_name));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
