// db.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Sequelize instance'ı oluşturuyoruz
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'mysql',
});

/*const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql', // or whatever database you're using
  logging: console.log, // This will log all Sequelize queries
  dialectOptions: {
    connectTimeout: 60000
  },
});*/

// Veritabanı bağlantısının doğrulanması
sequelize.authenticate()
  .then(() => {
    console.log('Veritabanı bağlantısı başarılı!');
  })
  .catch(err => {
    console.error('Veritabanı bağlantısı başarısız:', err);
    console.error('Bağlantı detayları:', {
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      host: process.env.DB_HOST
    });
  });

module.exports = sequelize;
