const { Sequelize } = require('sequelize');
const { Site, SiteLang, SiteCat } = require('../models');

// Tüm siteleri getirme
exports.getAllSites = async (req, res) => {
  try {
    const sites = await Site.findAll({
      include: [
        { 
          model: SiteLang, 
          as: 'languages', 
          through: { attributes: [] },
          attributes: ['id', 'name']
        },
        { 
          model: SiteCat, 
          as: 'categories', 
          through: { attributes: [] },
          attributes: ['id', 'name']
        }
      ],
      order: [['monthly_visitors', 'DESC']],
    });

    // Transform the result to match the expected format
    const transformedSites = sites.map(site => ({
      ...site.toJSON(),
      language: site.languages[0]?.name || null,
      category: site.categories[0]?.name || null,
    }));

    res.json(transformedSites);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

// Yeni bir site oluşturma
exports.createSite = async (req, res) => {
  const { domain_name, monthly_visitors, language, category } = req.body;
  try {
    const site = await Site.create({ 
      domain_name, 
      monthly_visitors, 
      not_reviewed_pages: 0, 
      reviewed_pages: 0 
    });

    // Find or create language
    const [siteLang] = await SiteLang.findOrCreate({ where: { name: language } });
    await site.addLanguage(siteLang);

    // Find or create category
    const [siteCat] = await SiteCat.findOrCreate({ where: { name: category } });
    await site.addCategory(siteCat);

    // Fetch the created site with its associations
    const createdSite = await Site.findByPk(site.id, {
      include: [
        { model: SiteLang, as: 'languages', through: { attributes: [] } },
        { model: SiteCat, as: 'categories', through: { attributes: [] } }
      ]
    });

    res.status(201).json({
      ...createdSite.toJSON(),
      language: createdSite.languages[0]?.name || null,
      category: createdSite.categories[0]?.name || null,
    });
  } catch (err) {
    console.error('Error creating site:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

// Site güncelleme
exports.updateSite = async (req, res) => {
  const { id } = req.params;
  const { domain_name, monthly_visitors, language, category } = req.body;
  try {
    const site = await Site.findByPk(id);
    if (!site) {
      return res.status(404).json({ message: 'Site not found' });
    }

    // Site bilgilerini güncelle
    site.domain_name = domain_name;
    site.monthly_visitors = monthly_visitors;
    await site.save();

    // Dili güncelle
    if (language) {
      const siteLang = await SiteLang.findOne({ where: { name: language } });
      await site.setLanguages([siteLang]);
    }

    // Kategoriyi güncelle
    if (category) {
      const siteCat = await SiteCat.findOne({ where: { name: category } });
      await site.setCategories([siteCat]);
    }

    res.json(site);
  } catch (err) {
    console.error('Error updating site:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

// Site silme
exports.deleteSite = async (req, res) => {
  const { id } = req.params;
  try {
    const site = await Site.findByPk(id);
    if (!site) {
      return res.status(404).json({ message: 'Site not found' });
    }

    await site.destroy();
    res.json({ message: 'Site deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
};

// Dilleri getirme
exports.getLanguages = async (req, res) => {
  try {
    const languages = await SiteLang.findAll();
    res.json(languages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Yeni bir dil oluşturma
exports.createLanguage = async (req, res) => {
  const { name } = req.body;
  try {
    const language = await SiteLang.create({ name });
    res.status(201).json(language);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Bir dili silme
exports.deleteLanguage = async (req, res) => {
  const { id } = req.params;
  try {
    const language = await SiteLang.findByPk(id);
    if (!language) {
      return res.status(404).json({ message: 'Language not found' });
    }

    await language.destroy();
    res.json({ message: 'Language deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Kategorileri getirme
exports.getCategories = async (req, res) => {
  try {
    const categories = await SiteCat.findAll({ order: [['name', 'ASC']] });
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Yeni bir kategori oluşturma
exports.createCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const category = await SiteCat.create({ name });
    res.status(201).json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Bir kategori silme
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await SiteCat.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await category.destroy();
    res.json({ message: 'Category deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.bulkUpdateSites = async (req, res) => {
  const { minVisitors, maxVisitors, changeValue, changeType, category } = req.body;

  try {
    // İlk olarak, güncellenecek siteleri kategorileriyle birlikte bulalım
    const sitesToUpdate = await Site.findAll({
      include: {
        model: SiteCat,
        as: 'categories', // 'as' anahtar kelimesini ekledik
        where: { name: category },
        through: { attributes: [] },
      },
      where: {
        monthly_visitors: {
          [Sequelize.Op.between]: [minVisitors, maxVisitors],
        },
      },
    });

    // Ziyaretçi sayısını artırma veya azaltma işlemini gerçekleştirelim
    const updatePromises = sitesToUpdate.map(async (site) => {
      if (changeType === 'decrease') {
        site.monthly_visitors = Math.max(site.monthly_visitors - changeValue, 0);
      } else {
        site.monthly_visitors += changeValue;
      }
      return site.save();
    });

    // Tüm güncellemeleri paralel olarak çalıştır
    await Promise.all(updatePromises);

    res.json({ message: 'Bulk update successful', updatedCount: sitesToUpdate.length });
  } catch (error) {
    console.error('Error during bulk update:', error);
    res.status(500).json({ error: 'An error occurred during bulk update' });
  }
};
