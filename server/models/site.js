const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Site = sequelize.define('Site', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  domain_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  monthly_visitors: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  not_reviewed_pages: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  reviewed_pages: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'sites',
  timestamps: false, // Sequelize timestamps automatically manages createdAt and updatedAt
});

module.exports = Site;
