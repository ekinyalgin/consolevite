const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Veritabanı bağlantısını içe aktarıyoruz

const Video = sequelize.define('Video', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false, // Title zorunlu bir alan
  },
  url: {
    type: DataTypes.STRING(255),
    allowNull: false, // URL zorunlu bir alan
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true, // Not alanı isteğe bağlı
  },
  done: {
    type: DataTypes.TINYINT(1),
    allowNull: true,
    defaultValue: 0, // Varsayılan değer tamamlanmamış (0)
  },
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW, // Varsayılan olarak mevcut zaman
  }
}, {
  tableName: 'videos', // Tablo adı
  timestamps: false, // createdAt ve updatedAt otomatik eklenmeyecek
});

module.exports = Video;
