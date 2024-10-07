const { Url, Site } = require('../models');
const { Op, Sequelize } = require('sequelize');

exports.getUrlsForDomain = async (req, res) => {
  const { domainName } = req.params;
  try {
    if (!Url) {
      throw new Error('Url model is not defined');
    }
    const notReviewed = await Url.findAll({ where: { domain_name: domainName, reviewed: false } });
    const reviewed = await Url.findAll({ where: { domain_name: domainName, reviewed: true } });
    res.json({ notReviewed, reviewed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error', message: err.message });
  }
};

exports.getUrlsStatusForDomain = async (req, res) => {
  const { domainName } = req.params;
  try {
    const notReviewedCount = await Url.count({ where: { domain_name: domainName, reviewed: false } });
    const reviewedCount = await Url.count({ where: { domain_name: domainName, reviewed: true } });
    
    res.json({
      hasNotReviewed: notReviewedCount > 0,
      hasReviewed: reviewedCount > 0
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.addUrlsToDomain = async (req, res) => {
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

exports.markUrlAsReviewed = async (req, res) => {
  const { id } = req.params;
  const { reviewed } = req.body;
  try {
    const url = await Url.findByPk(id);

    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    await url.update({ reviewed });

    await Site.increment(
      reviewed ? { not_reviewed_pages: -1, reviewed_pages: 1 } : { not_reviewed_pages: 1, reviewed_pages: -1 },
      { where: { domain_name: url.domain_name } }
    );

    const updatedUrl = await Url.findByPk(id);
    res.json({ message: `URL marked as ${reviewed ? 'reviewed' : 'not reviewed'}`, updatedUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteUrl = async (req, res) => {
  const { id } = req.params;
  try {
    const url = await Url.findByPk(id);

    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    await url.destroy();

    await Site.decrement(
      url.reviewed ? 'reviewed_pages' : 'not_reviewed_pages',
      { where: { domain_name: url.domain_name } }
    );

    res.status(200).json({ message: 'URL deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete URL' });
  }
};

exports.getNotReviewedUrlsByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const urls = await Url.findAll({
      attributes: ['url'],
      include: [{
        model: Site,
        attributes: [],
        where: { category },
        required: true
      }],
      where: { reviewed: false }
    });
    res.json(urls.map(url => url.url));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getRandomDomainsWithNotReviewedUrls = async (req, res) => {
  const { category } = req.params;
  try {
    const domains = await Site.findAll({
      attributes: ['domain_name'],
      include: [{
        model: Url,
        attributes: [],
        where: { reviewed: false },
        required: true
      }],
      where: { category },
      order: Sequelize.literal('RAND()'),
      limit: 5
    });
    res.json(domains.map(domain => domain.domain_name));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getReviewedUrls = async (req, res) => {
  const { domainName } = req.params;
  try {
    const reviewed = await Url.findAll({ where: { domain_name: domainName, reviewed: true } });
    res.json(reviewed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getNotReviewedUrls = async (req, res) => {
  const { domainName } = req.params;
  try {
    const notReviewed = await Url.findAll({ where: { domain_name: domainName, reviewed: false } });
    res.json(notReviewed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};