// controllers/authController.js
const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');

// login/success endpoint'i
exports.loginSuccess = async (req, res) => {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return res.status(401).json({ message: 'Authentication token is missing' });
        }

        const token = authorizationHeader.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findOne({
            where: { id: decodedToken.id },
            include: [{ model: Role, as: 'Role', attributes: ['name'] }],
            attributes: ['id', 'username', 'firstname', 'lastname', 'image']
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const formattedUser = {
            id: user.id,
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            image: user.image,
            role: user.Role ? user.Role.name : null
        };

        res.status(200).json({ user: formattedUser });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
