const { db } = require('../database/init');

// Follow a user
const followUser = async (req, res) => {
    const { followerId, followingId } = req.body;

    // Prevent self-following
    if (followerId === followingId) {
        return res.status(400).json({ error: 'Users cannot follow themselves' });
    }

    try {
        // Check if both users exist
        const [follower, following] = await Promise.all([
            new Promise((resolve, reject) => {
                db.get('SELECT id FROM users WHERE id = ?', [followerId], (err, row) => {
                    if (err) reject(err);
                    resolve(row);
                });
            }),
            new Promise((resolve, reject) => {
                db.get('SELECT id FROM users WHERE id = ?', [followingId], (err, row) => {
                    if (err) reject(err);
                    resolve(row);
                });
            })
        ]);

        if (!follower || !following) {
            return res.status(404).json({ error: 'One or both users not found' });
        }

        // Check if already following
        const existingFollow = await new Promise((resolve, reject) => {
            db.get('SELECT id FROM followers WHERE follower_id = ? AND following_id = ?', 
                [followerId, followingId], 
                (err, row) => {
                    if (err) reject(err);
                    resolve(row);
                });
        });

        if (existingFollow) {
            return res.status(400).json({ error: 'Already following this user' });
        }

        // Create follow relationship
        await new Promise((resolve, reject) => {
            db.run('INSERT INTO followers (follower_id, following_id) VALUES (?, ?)',
                [followerId, followingId],
                function(err) {
                    if (err) reject(err);
                    resolve(this.lastID);
                });
        });

        res.status(201).json({ message: 'Successfully followed user' });
    } catch (error) {
        console.error('Error following user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Unfollow a user
const unfollowUser = async (req, res) => {
    const { followerId, followingId } = req.body;

    // Prevent self-unfollowing
    if (followerId === followingId) {
        return res.status(400).json({ error: 'Users cannot unfollow themselves' });
    }

    try {
        // Check if both users exist
        const [follower, following] = await Promise.all([
            new Promise((resolve, reject) => {
                db.get('SELECT id FROM users WHERE id = ?', [followerId], (err, row) => {
                    if (err) reject(err);
                    resolve(row);
                });
            }),
            new Promise((resolve, reject) => {
                db.get('SELECT id FROM users WHERE id = ?', [followingId], (err, row) => {
                    if (err) reject(err);
                    resolve(row);
                });
            })
        ]);

        if (!follower || !following) {
            return res.status(404).json({ error: 'One or both users not found' });
        }

        // Check if the follow relationship exists
        const existingFollow = await new Promise((resolve, reject) => {
            db.get('SELECT id FROM followers WHERE follower_id = ? AND following_id = ?', 
                [followerId, followingId], 
                (err, row) => {
                    if (err) reject(err);
                    resolve(row);
                });
        });

        if (!existingFollow) {
            return res.status(400).json({ error: 'You are not following this user' });
        }

        // Delete the follow relationship
        const result = await new Promise((resolve, reject) => {
            db.run('DELETE FROM followers WHERE follower_id = ? AND following_id = ?',
                [followerId, followingId],
                function(err) {
                    if (err) reject(err);
                    resolve(this.changes);
                });
        });

        if (result === 0) {
            return res.status(500).json({ error: 'Failed to unfollow user' });
        }

        // Get updated follower count for the unfollowed user
        const followerCount = await new Promise((resolve, reject) => {
            db.get('SELECT COUNT(*) as count FROM followers WHERE following_id = ?', 
                [followingId], 
                (err, row) => {
                    if (err) reject(err);
                    resolve(row.count);
                });
        });

        res.json({ 
            message: 'Successfully unfollowed user',
            followerCount
        });
    } catch (error) {
        console.error('Error unfollowing user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get user's followers
const getFollowers = async (req, res) => {
    const { userId } = req.params;

    try {
        const followers = await new Promise((resolve, reject) => {
            db.all(`
                SELECT u.id, u.username, u.email, f.created_at as followed_at
                FROM users u
                INNER JOIN followers f ON u.id = f.follower_id
                WHERE f.following_id = ?
                ORDER BY f.created_at DESC
            `, [userId], (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });

        res.json({ followers });
    } catch (error) {
        console.error('Error getting followers:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get user's following
const getFollowing = async (req, res) => {
    const { userId } = req.params;

    try {
        const following = await new Promise((resolve, reject) => {
            db.all(`
                SELECT u.id, u.username, u.email, f.created_at as followed_at
                FROM users u
                INNER JOIN followers f ON u.id = f.following_id
                WHERE f.follower_id = ?
                ORDER BY f.created_at DESC
            `, [userId], (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });

        res.json({ following });
    } catch (error) {
        console.error('Error getting following:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get blog posts from followed users
const getFollowedUsersPosts = async (req, res) => {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    try {
        // Get total count of posts
        const totalCount = await new Promise((resolve, reject) => {
            db.get(`
                SELECT COUNT(*) as count
                FROM blog_posts bp
                INNER JOIN followers f ON bp.user_id = f.following_id
                WHERE f.follower_id = ?
            `, [userId], (err, row) => {
                if (err) reject(err);
                resolve(row.count);
            });
        });

        // Get posts with pagination
        const posts = await new Promise((resolve, reject) => {
            db.all(`
                SELECT 
                    bp.*,
                    u.username as author_username,
                    u.email as author_email
                FROM blog_posts bp
                INNER JOIN followers f ON bp.user_id = f.following_id
                INNER JOIN users u ON bp.user_id = u.id
                WHERE f.follower_id = ?
                ORDER BY bp.created_at DESC
                LIMIT ? OFFSET ?
            `, [userId, limit, offset], (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });

        res.json({
            posts,
            pagination: {
                total: totalCount,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(totalCount / limit)
            }
        });
    } catch (error) {
        console.error('Error getting followed users posts:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    getFollowedUsersPosts
}; 