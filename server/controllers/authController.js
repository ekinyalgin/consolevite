// controllers/authController.js
const jwt = require('jsonwebtoken');
const pool = require('../config/dbold'); // Veritabanı bağlantınızın bulunduğu dosya

// login/success endpoint'i
exports.loginSuccess = async (req, res) => {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return res.status(401).json({ message: 'Authentication token is missing' });
        }

        const token = authorizationHeader.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // Kullanıcı bilgilerini veritabanından alın ve roles tablosu ile JOIN yapın
        const [user] = await pool.query(`
            SELECT u.id, u.username, u.firstname, u.lastname, u.image, r.name as role 
            FROM users u 
            JOIN roles r ON u.role_id = r.id 
            WHERE u.id = ?
        `, [decodedToken.id]);

        if (user.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Kullanıcı bilgilerini JSON olarak döndürün
        res.status(200).json({ user: user[0] });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
