const { db } = require('../database/init');

// Get user profile
const getUserProfile = async (req, res) => {
    const { userId } = req.params;

    try {
        // Get user data
        const user = await new Promise((resolve, reject) => {
            db.get(`
                SELECT id, username, email, role, created_at
                FROM users
                WHERE id = ? AND is_active = 1
            `, [userId], (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Get follower and following counts
        const [followerCount, followingCount] = await Promise.all([
            new Promise((resolve, reject) => {
                db.get('SELECT COUNT(*) as count FROM followers WHERE following_id = ?', 
                    [userId], (err, row) => {
                        if (err) reject(err);
                        resolve(row.count);
                    });
            }),
            new Promise((resolve, reject) => {
                db.get('SELECT COUNT(*) as count FROM followers WHERE follower_id = ?', 
                    [userId], (err, row) => {
                        if (err) reject(err);
                        resolve(row.count);
                    });
            })
        ]);

        res.json({
            ...user,
            followerCount,
            followingCount
        });
    } catch (error) {
        console.error('Error getting user profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get suggested users to follow
const getSuggestedUsers = async (req, res) => {
    const userId = req.user.id;

    try {
        // Get users that the current user is not following
        const suggestedUsers = await new Promise((resolve, reject) => {
            db.all(`
                SELECT u.id, u.username, u.email
                FROM users u
                WHERE u.id != ? 
                AND u.is_active = 1
                AND u.id NOT IN (
                    SELECT following_id 
                    FROM followers 
                    WHERE follower_id = ?
                )
                ORDER BY RANDOM()
                LIMIT 5
            `, [userId, userId], (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });

        res.json({ users: suggestedUsers });
    } catch (error) {
        console.error('Error getting suggested users:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getUserProfile,
    getSuggestedUsers
}; 