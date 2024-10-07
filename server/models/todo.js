const { DataTypes } = require('sequelize');
const sequelize = require('../config/db'); // Veritabanı bağlantısını içe aktarıyoruz

const Todo = sequelize.define('Todo', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false, // Başlık zorunlu
  },
  date: {
    type: DataTypes.DATE,
    allowNull: true, // Tarih isteğe bağlı
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true, // Not isteğe bağlı
  },
}, {
  tableName: 'todos', // Tablo adı
  timestamps: false, // createdAt ve updatedAt otomatik olarak eklenmesin
});

module.exports = Todo;
