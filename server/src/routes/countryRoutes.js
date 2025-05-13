const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../database/models/User');

const register = async ({ username, email, password }) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await User.create({
        username,
        email,
        password: hashedPassword
    });

    return {
        userId,
        username,
        email
    };
};

const login = async ({ email, password }) => {
    const user = await User.findByEmail(email);

    if (!user) {
        throw new Error('User Not Found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid Password');
    }

    await User.updateLastLogin(user.id);

    // Generate JWT token
    const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
    );

    return {
        token,
        user: {
            id: user.id,
            username: user.username,
            email: user.email
        }
    };
};

module.exports = {
    register,
    login
}; 