const sequelize = require('../config/db');
const { Sequelize } = require('sequelize');

const Exercise = require('./exercise');
const Video = require('./video');
const Site = require('./site'); 
const SiteCategory = require('./sitecategory'); 
const SiteLanguage = require('./sitelanguage');
const SiteCat = require('./sitecat'); 
const SiteLang = require('./sitelang'); 
const Url = require('./urls');
const Balance = require('./balance');
const Product = require('./product');
const TotalBalance = require('./totalBalance');
const User = require('./user');  // Make sure this line exists
const Role = require('./role');

// Site ile Category (SiteCat) ilişkisi (Many-to-Many)
Site.belongsToMany(SiteCat, { 
  through: SiteCategory, 
  foreignKey: 'site_id', 
  as: 'categories'
});
SiteCat.belongsToMany(Site, { 
  through: SiteCategory, 
  foreignKey: 'category_id', 
  as: 'sites'
});

// Site ile Language (SiteLang) ilişkisi (Many-to-Many)
Site.belongsToMany(SiteLang, { 
  through: SiteLanguage, 
  foreignKey: 'site_id', 
  as: 'languages'
});
SiteLang.belongsToMany(Site, { 
  through: SiteLanguage, 
  foreignKey: 'language_id', 
  as: 'sites'
});

// User ve Balance ilişkisi (One-to-Many)
User.hasMany(Balance, { foreignKey: 'userId' });
Balance.belongsTo(User, { foreignKey: 'userId' });

// User ve TotalBalance ilişkisi (One-to-One)
User.hasOne(TotalBalance, { foreignKey: 'userId' });
TotalBalance.belongsTo(User, { foreignKey: 'userId' });

// User ve Role ilişkisi (Many-to-One)
User.belongsTo(Role, { foreignKey: 'role_id' });
Role.hasMany(User, { foreignKey: 'role_id' });

module.exports = {
  sequelize,
  Sequelize,
  Exercise,
  Video,
  Site,
  SiteCategory,
  SiteLanguage,
  SiteCat,
  SiteLang,
  Url,
  Product,
  Balance,
  TotalBalance,
  User,  // Make sure this line exists
  Role
};

// Veritabanı senkronizasyonu için bu kodu kullanabilirsiniz

/*
console.log('Synchronization starting...');
sequelize.sync({ alter: true }) 
  .then(() => {
    console.log('Database and tables synchronized.');
  })
  .catch(error => {
    console.error('Database synchronization error:', error);
  });
console.log('Synchronization code executed.');

*/