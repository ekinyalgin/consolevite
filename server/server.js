require('dotenv').config();

const express = require("express");
const cors = require("cors");
const passportSetup = require("./config/passport");
const passport = require("passport");
const authRoute = require("./routes/auth");
const app = express();
const videoRoute = require('./routes/video');

app.use(express.json());
app.use(passport.initialize());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true, // Change this back to true
  })
);

// Add this middleware to set the appropriate headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  next();
});

app.use("/auth", authRoute);
app.use('/api/videos', videoRoute);

app.listen("5000", () => {
  console.log("Server is running!");
});
