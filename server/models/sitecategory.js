const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Site = require('./site');
const SiteCategory = sequelize.define('SiteCategory', {
  site_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Site,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  category_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'sites_cats',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
}, {
  tableName: 'site_categories',
  timestamps: false,
});

module.exports = SiteCategory;
