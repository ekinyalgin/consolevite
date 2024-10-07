const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Site = require('./site');
const SiteLanguage = sequelize.define('SiteLanguage', {
  site_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Site,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  language_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'sites_langs',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
}, {
  tableName: 'site_languages',
  timestamps: false,
});

module.exports = SiteLanguage;
