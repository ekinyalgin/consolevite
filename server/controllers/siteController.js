const pool = require('../config/db');

exports.getAllSites = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        s.id, 
        s.domain_name, 
        s.monthly_visitors, 
        s.created_at, 
        s.updated_at,
        l.id AS language_id,
        l.name AS language,
        c.id AS category_id,
        c.name AS category
      FROM sites s
      LEFT JOIN site_languages sl ON s.id = sl.site_id
      LEFT JOIN sites_langs l ON sl.language_id = l.id
      LEFT JOIN site_categories sc ON s.id = sc.site_id
      LEFT JOIN sites_cats c ON sc.category_id = c.id
      ORDER BY s.monthly_visitors DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

exports.createSite = async (req, res) => {
  const { domainName, monthlyVisitors, language, category } = req.body;
  try {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      const [result] = await connection.query(
        'INSERT INTO sites (domain_name, monthly_visitors) VALUES (?, ?)',
        [domainName, monthlyVisitors]
      );
      const siteId = result.insertId;

      if (language) {
        await connection.query(
          'INSERT INTO site_languages (site_id, language_id) VALUES (?, ?)',
          [siteId, language]
        );
      }
      if (category) {
        await connection.query(
          'INSERT INTO site_categories (site_id, category_id) VALUES (?, ?)',
          [siteId, category]
        );
      }
      
      await connection.commit();
      res.status(201).json({ id: siteId, domainName, monthlyVisitors });
    } catch (e) {
      await connection.rollback();
      throw e;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

exports.updateSite = async (req, res) => {
  const { id } = req.params;
  const { domainName, monthlyVisitors, language, category } = req.body;
  try {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      await connection.query(
        'UPDATE sites SET domain_name = ?, monthly_visitors = ? WHERE id = ?',
        [domainName, monthlyVisitors, id]
      );
      await connection.query('DELETE FROM site_languages WHERE site_id = ?', [id]);
      await connection.query('DELETE FROM site_categories WHERE site_id = ?', [id]);
      
      if (language) {
        await connection.query(
          'INSERT INTO site_languages (site_id, language_id) VALUES (?, ?)',
          [id, language]
        );
      }
      if (category) {
        await connection.query(
          'INSERT INTO site_categories (site_id, category_id) VALUES (?, ?)',
          [id, category]
        );
      }
      
      await connection.commit();
      res.json({ message: 'Site updated successfully' });
    } catch (e) {
      await connection.rollback();
      throw e;
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

exports.deleteSite = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM sites WHERE id = ?', [id]);
    res.json({ message: 'Site deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

exports.getLanguages = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM sites_langs ORDER BY name');
    res.json(rows || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createLanguage = async (req, res) => {
  const { name } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO sites_langs (name) VALUES (?)', [name]);
    const [newLanguage] = await pool.query('SELECT * FROM sites_langs WHERE id = ?', [result.insertId]);
    res.status(201).json(newLanguage[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteLanguage = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM sites_langs WHERE id = ?', [id]);
    res.json({ message: 'Language deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM sites_cats ORDER BY name');
    res.json(rows || []);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.createCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const [result] = await pool.query('INSERT INTO sites_cats (name) VALUES (?)', [name]);
    const [newCategory] = await pool.query('SELECT * FROM sites_cats WHERE id = ?', [result.insertId]);
    res.status(201).json(newCategory[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM sites_cats WHERE id = ?', [id]);
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.bulkUpdateSites = async (req, res) => {
  try {
    const { minVisitors, maxVisitors, changeValue, changeType, category } = req.body;
    let updateQuery;
    if (changeType === 'decrease') {
      updateQuery = `
        UPDATE sites s
        JOIN site_categories sc ON s.id = sc.site_id
        JOIN sites_cats c ON sc.category_id = c.id
        SET s.monthly_visitors = s.monthly_visitors - ?
        WHERE s.monthly_visitors BETWEEN ? AND ?
        AND c.name = ?
      `;
    } else {
      updateQuery = `
        UPDATE sites s
        JOIN site_categories sc ON s.id = sc.site_id
        JOIN sites_cats c ON sc.category_id = c.id
        SET s.monthly_visitors = s.monthly_visitors + ?
        WHERE s.monthly_visitors BETWEEN ? AND ?
        AND c.name = ?
      `;
    }
    const result = await pool.query(updateQuery, [changeValue, minVisitors, maxVisitors, category]);
    res.json({ message: 'Bulk update successful', updatedCount: result[0].affectedRows });
  } catch (error) {
    console.error('Error during bulk update:', error);
    res.status(500).json({ error: 'An error occurred during bulk update' });
  }
};
