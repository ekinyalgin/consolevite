require('dotenv').config();
const path = require('path');
//require('dotenv').config({ path: path.join(__dirname, '.env.production') });

const express = require("express");
const cors = require("cors");
const passportSetup = require("./config/passport");
const passport = require("passport");
const authRoute = require("./routes/auth");
const app = express();
const videoRoute = require('./routes/video');
const exerciseRoute = require('./routes/exercise');
const todoRoute = require('./routes/todo'); 
const siteRoute = require('./routes/site');
const urlRoute = require('./routes/url'); 
const excelRoute = require('./routes/excel');
const productionRoute = require('./routes/production');

app.use(express.json());
app.use(passport.initialize());

app.use(
  cors({
    origin: ["http://localhost:3000", "https://www.ekinyalgin.com", "https://ekinyalgin.com"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

// Access-Control-Allow-Origin Middleware
app.use((req, res, next) => {
  const allowedOrigins = [
    "http://localhost:3000",
    "https://www.ekinyalgin.com",
    "https://ekinyalgin.com",
  ];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  res.charset = 'utf-8';
  next();
});

// API rotaları
app.use("/auth", authRoute);
app.use('/api/videos', videoRoute);
app.use('/api/exercises', exerciseRoute);
app.use('/api/todos', todoRoute); 
app.use('/api/sites', siteRoute);
app.use('/api/urls', urlRoute);  
app.use('/api/excel', excelRoute);
app.use('/api/production', productionRoute);

// Statik dosyaları sunmak için
app.use(express.static(path.join(__dirname, '../dist')));

// Tüm GET isteklerini index.html'e yönlendir
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

const PORT = process.env.PORT || 5000; 
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});