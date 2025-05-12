const db = require('../init').db;

class Follow {
    static async createTable() {
        return new Promise((resolve, reject) => {
            db.run(`
                CREATE TABLE IF NOT EXISTS followers (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    follower_id INTEGER NOT NULL,
                    following_id INTEGER NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (follower_id) REFERENCES users(id),
                    FOREIGN KEY (following_id) REFERENCES users(id),
                    UNIQUE(follower_id, following_id)
                )
            `, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    static async follow(followerId, followingId) {
        return new Promise((resolve, reject) => {
            db.run(
                'INSERT INTO followers (follower_id, following_id) VALUES (?, ?)',
                [followerId, followingId],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    }

    static async unfollow(followerId, followingId) {
        return new Promise((resolve, reject) => {
            db.run(
                'DELETE FROM followers WHERE follower_id = ? AND following_id = ?',
                [followerId, followingId],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.changes);
                }
            );
        });
    }

    static async getFollowers(userId) {
        return new Promise((resolve, reject) => {
            db.all(`
                SELECT u.id, u.username, u.email, u.created_at
                FROM followers f
                JOIN users u ON f.follower_id = u.id
                WHERE f.following_id = ?
                ORDER BY f.created_at DESC
            `, [userId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    static async getFollowing(userId) {
        return new Promise((resolve, reject) => {
            db.all(`
                SELECT u.id, u.username, u.email, u.created_at
                FROM followers f
                JOIN users u ON f.following_id = u.id
                WHERE f.follower_id = ?
                ORDER BY f.created_at DESC
            `, [userId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    static async isFollowing(followerId, followingId) {
        return new Promise((resolve, reject) => {
            db.get(
                'SELECT 1 FROM followers WHERE follower_id = ? AND following_id = ?',
                [followerId, followingId],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(!!row);
                }
            );
        });
    }

    static async getFollowerCount(userId) {
        return new Promise((resolve, reject) => {
            db.get(
                'SELECT COUNT(*) as count FROM followers WHERE following_id = ?',
                [userId],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row ? row.count : 0);
                }
            );
        });
    }

    static async getFollowingCount(userId) {
        return new Promise((resolve, reject) => {
            db.get(
                'SELECT COUNT(*) as count FROM followers WHERE follower_id = ?',
                [userId],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row ? row.count : 0);
                }
            );
        });
    }

    static async getSuggestedUsers(userId, limit = 5) {
        return new Promise((resolve, reject) => {
            db.all(`
                SELECT u.id, u.username, u.email
                FROM users u
                WHERE u.id != ? 
                AND u.id NOT IN (
                    SELECT following_id 
                    FROM followers 
                    WHERE follower_id = ?
                )
                ORDER BY RANDOM()
                LIMIT ?
            `, [userId, userId, limit], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    static async getFollowedUsersPosts(userId, limit, offset) {
        return new Promise((resolve, reject) => {
            db.all(`
                SELECT bp.*, u.username 
                FROM blog_posts bp
                JOIN users u ON bp.user_id = u.id
                WHERE bp.user_id IN (
                    SELECT following_id 
                    FROM followers 
                    WHERE follower_id = ?
                )
                ORDER BY bp.created_at DESC
                LIMIT ? OFFSET ?
            `, [userId, limit, offset], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    static async getFollowedPostsCount(userId) {
        return new Promise((resolve, reject) => {
            db.get(`
                SELECT COUNT(*) as count
                FROM blog_posts bp
                WHERE bp.user_id IN (
                    SELECT following_id 
                    FROM followers 
                    WHERE follower_id = ?
                )
            `, [userId], (err, row) => {
                if (err) reject(err);
                else resolve(row ? row.count : 0);
            });
        });
    }
}

module.exports = Follow; 