const router = require("express").Router();
const passport = require("passport");
const jwt = require('jsonwebtoken');
const authController = require('../controllers/authController'); // authController.js dosyasını içe aktar

// Ensure CLIENT_URL is correctly accessed from environment variables
const CLIENT_URL = process.env.CLIENT_URL;
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

// login/success endpoint'ini authController'daki loginSuccess'e yönlendir
router.get("/login/success", passport.authenticate('jwt', { session: false }), authController.loginSuccess);

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.clearCookie("refreshToken");
  res.status(200).json({ message: "Logged out successfully" });
});

// Google Authentication routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    console.log("Google callback hit, req.user:", req.user);
    if (req.user && req.user.token && req.user.refreshToken) {
      const token = req.user.token;
      const refreshToken = req.user.refreshToken;
      res.redirect(`${CLIENT_URL}?token=${encodeURIComponent(token)}&refreshToken=${encodeURIComponent(refreshToken)}`);
    } else {
      console.log("User or tokens not found in req.user");
      res.redirect(`${CLIENT_URL}/`);
    }
  }
);

// Protected route example
router.get("/protected", passport.authenticate('jwt', { session: false }), (req, res) => {
  res.json({ message: "You accessed a protected route!", user: req.user });
});

// Refresh token route
router.post("/refresh-token", (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh Token is required" });
  }
  try {
    const user = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const newToken = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token: newToken });
  } catch (error) {
    res.status(403).json({ message: "Invalid refresh token" });
  }
});

console.log("CLIENT_URL:", CLIENT_URL);

module.exports = router;
