const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Veritabanı bağlantısını içe aktarıyoruz

const Url = sequelize.define('Url', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  url: {
    type: DataTypes.STRING(2083), // URL maksimum uzunluk
    allowNull: false,
  },
  domain_name: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  reviewed: {
    type: DataTypes.TINYINT(1),
    allowNull: false,
    defaultValue: 0, // Varsayılan olarak false (0)
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
  tableName: 'urls',
  timestamps: false, // created_at ve updated_at alanlarını otomatik olarak günceller
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Url;
