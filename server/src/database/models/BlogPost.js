const db = require('../init').db;

class BlogPost {
    static async createTable() {
        return new Promise((resolve, reject) => {
            db.run(`
                CREATE TABLE IF NOT EXISTS blog_posts (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    content TEXT NOT NULL,
                    country_name TEXT NOT NULL,
                    country_cca3 TEXT NOT NULL,
                    date_of_visit TEXT NOT NULL,
                    user_id INTEGER NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users(id)
                )
            `, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    static async createDislikesTable() {
        return new Promise((resolve, reject) => {
            db.run(`
                CREATE TABLE IF NOT EXISTS post_dislikes (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    post_id INTEGER NOT NULL,
                    user_id INTEGER NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                    UNIQUE(post_id, user_id)
                )
            `, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    static async createLikesTable() {
        return new Promise((resolve, reject) => {
            db.run(`
                CREATE TABLE IF NOT EXISTS post_likes (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    post_id INTEGER NOT NULL,
                    user_id INTEGER NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (post_id) REFERENCES blog_posts(id) ON DELETE CASCADE,
                    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
                    UNIQUE(post_id, user_id)
                )
            `, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    static async create({ title, content, country_name, country_cca3, date_of_visit, user_id }) {
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO blog_posts (title, content, country_name, country_cca3, date_of_visit, user_id)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [title, content, country_name, country_cca3, date_of_visit, user_id],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    }

    static async findAll() {
        return new Promise((resolve, reject) => {
            db.all(`
                SELECT bp.*, u.username,
                  (SELECT COUNT(*) FROM post_reactions pr WHERE pr.post_id = bp.id AND pr.reaction_type = 'like') as like_count,
                  (SELECT COUNT(*) FROM post_comments pc WHERE pc.post_id = bp.id) as comment_count
                FROM blog_posts bp
                JOIN users u ON bp.user_id = u.id
                ORDER BY bp.created_at DESC
            `, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    static async findById(id) {
        return new Promise((resolve, reject) => {
            db.get(`
                SELECT bp.*, u.username 
                FROM blog_posts bp
                JOIN users u ON bp.user_id = u.id
                WHERE bp.id = ?
            `, [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    static async findByUserId(userId) {
        return new Promise((resolve, reject) => {
            db.all(`
                SELECT bp.*, u.username 
                FROM blog_posts bp
                JOIN users u ON bp.user_id = u.id
                WHERE bp.user_id = ? 
                ORDER BY bp.created_at DESC
            `, [userId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    static async update(id, { title, content, country_name, country_cca3, date_of_visit }) {
        return new Promise((resolve, reject) => {
            db.run(
                `UPDATE blog_posts 
                 SET title = ?, content = ?, country_name = ?, country_cca3 = ?, date_of_visit = ?, updated_at = CURRENT_TIMESTAMP
                 WHERE id = ?`,
                [title, content, country_name, country_cca3, date_of_visit, id],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.changes);
                }
            );
        });
    }

    static async delete(id) {
        return new Promise((resolve, reject) => {
            db.run(
                'DELETE FROM blog_posts WHERE id = ?',
                [id],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.changes);
                }
            );
        });
    }

    static async findByCountry(countryName, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        return new Promise((resolve, reject) => {
            db.all(`
                SELECT bp.*, u.username,
                  (SELECT COUNT(*) FROM post_reactions pr WHERE pr.post_id = bp.id AND pr.reaction_type = 'like') as like_count,
                  (SELECT COUNT(*) FROM post_comments pc WHERE pc.post_id = bp.id) as comment_count
                FROM blog_posts bp
                JOIN users u ON bp.user_id = u.id
                WHERE LOWER(bp.country_name) LIKE LOWER(?)
                ORDER BY bp.created_at DESC
                LIMIT ? OFFSET ?
            `, [`%${countryName}%`, limit, offset], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    static async findByUsername(username, page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        return new Promise((resolve, reject) => {
            db.all(`
                SELECT bp.*, u.username,
                  (SELECT COUNT(*) FROM post_reactions pr WHERE pr.post_id = bp.id AND pr.reaction_type = 'like') as like_count,
                  (SELECT COUNT(*) FROM post_comments pc WHERE pc.post_id = bp.id) as comment_count
                FROM blog_posts bp
                JOIN users u ON bp.user_id = u.id
                WHERE LOWER(u.username) LIKE LOWER(?)
                ORDER BY bp.created_at DESC
                LIMIT ? OFFSET ?
            `, [`%${username}%`, limit, offset], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    static async getTotalCountByCountry(countryName) {
        return new Promise((resolve, reject) => {
            db.get(`
                SELECT COUNT(*) as total
                FROM blog_posts bp
                JOIN users u ON bp.user_id = u.id
                WHERE LOWER(bp.country_name) LIKE LOWER(?)
            `, [`%${countryName}%`], (err, row) => {
                if (err) reject(err);
                else resolve(row ? row.total : 0);
            });
        });
    }

    static async getTotalCountByUsername(username) {
        return new Promise((resolve, reject) => {
            db.get(`
                SELECT COUNT(*) as total
                FROM blog_posts bp
                JOIN users u ON bp.user_id = u.id
                WHERE LOWER(u.username) LIKE LOWER(?)
            `, [`%${username}%`], (err, row) => {
                if (err) reject(err);
                else resolve(row ? row.total : 0);
            });
        });
    }

    static async getTotalCount() {
        return new Promise((resolve, reject) => {
            db.get(`
                SELECT COUNT(*) as total
                FROM blog_posts
            `, (err, row) => {
                if (err) reject(err);
                else resolve(row ? row.total : 0);
            });
        });
    }

    static async toggleReaction(postId, userId, reactionType) {
        const oppositeType = reactionType === 'like' ? 'dislike' : 'like';
        return new Promise((resolve, reject) => {
            // First, remove the opposite reaction if it exists
            db.run(
                'DELETE FROM post_reactions WHERE post_id = ? AND user_id = ? AND reaction_type = ?',
                [postId, userId, oppositeType],
                (err) => {
                    if (err) return reject(err);
                    // Now, check if the current reaction exists
                    db.get(
                        'SELECT * FROM post_reactions WHERE post_id = ? AND user_id = ? AND reaction_type = ?',
                        [postId, userId, reactionType],
                        (err, row) => {
                            if (err) {
                                reject(err);
                                return;
                            }
                            if (row) {
                                // Reaction exists, remove it
                                db.run(
                                    'DELETE FROM post_reactions WHERE post_id = ? AND user_id = ? AND reaction_type = ?',
                                    [postId, userId, reactionType],
                                    (err) => {
                                        if (err) reject(err);
                                        else resolve({ isActive: false });
                                    }
                                );
                            } else {
                                // No reaction, add it
                                db.run(
                                    'INSERT INTO post_reactions (post_id, user_id, reaction_type) VALUES (?, ?, ?)',
                                    [postId, userId, reactionType],
                                    (err) => {
                                        if (err) reject(err);
                                        else resolve({ isActive: true });
                                    }
                                );
                            }
                        }
                    );
                }
            );
        });
    }

    static async getReactionStatus(postId, userId, reactionType) {
        return new Promise((resolve, reject) => {
            db.get(
                'SELECT * FROM post_reactions WHERE post_id = ? AND user_id = ? AND reaction_type = ?',
                [postId, userId, reactionType],
                (err, row) => {
                    if (err) reject(err);
                    else resolve({ isActive: !!row });
                }
            );
        });
    }

    static async getReactionCount(postId, reactionType) {
        return new Promise((resolve, reject) => {
            db.get(
                'SELECT COUNT(*) as count FROM post_reactions WHERE post_id = ? AND reaction_type = ?',
                [postId, reactionType],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row ? row.count : 0);
                }
            );
        });
    }

    static async addComment(postId, userId, content) {
        return new Promise((resolve, reject) => {
            db.run(
                'INSERT INTO post_comments (post_id, user_id, content) VALUES (?, ?, ?)',
                [postId, userId, content],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    }

    static async getComments(postId) {
        return new Promise((resolve, reject) => {
            db.all(`
                SELECT c.*, u.username 
                FROM post_comments c
                JOIN users u ON c.user_id = u.id
                WHERE c.post_id = ?
                ORDER BY c.created_at DESC
            `, [postId], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    static async deleteComment(commentId, userId) {
        return new Promise((resolve, reject) => {
            db.run(
                'DELETE FROM post_comments WHERE id = ? AND user_id = ?',
                [commentId, userId],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.changes > 0);
                }
            );
        });
    }

    static async getPopularPosts(limit = 10) {
        return new Promise((resolve, reject) => {
            db.all(`
                SELECT bp.*, u.username,
                  (SELECT COUNT(*) FROM post_reactions pr WHERE pr.post_id = bp.id AND pr.reaction_type = 'like') as like_count,
                  (SELECT COUNT(*) FROM post_reactions pr WHERE pr.post_id = bp.id AND pr.reaction_type = 'dislike') as dislike_count,
                  (SELECT COUNT(*) FROM post_comments pc WHERE pc.post_id = bp.id) as comment_count,
                  ((
                    (SELECT COUNT(*) FROM post_reactions pr WHERE pr.post_id = bp.id AND pr.reaction_type = 'like') +
                    (SELECT COUNT(*) FROM post_comments pc WHERE pc.post_id = bp.id) -
                    (SELECT COUNT(*) FROM post_reactions pr WHERE pr.post_id = bp.id AND pr.reaction_type = 'dislike')
                  )) as popularity_score
                FROM blog_posts bp
                JOIN users u ON bp.user_id = u.id
                ORDER BY popularity_score DESC, bp.created_at DESC
                LIMIT ?
            `, [limit], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    static async getRecentPosts(limit = 10) {
        return new Promise((resolve, reject) => {
            db.all(`
                SELECT bp.*, u.username,
                  (SELECT COUNT(*) FROM post_reactions pr WHERE pr.post_id = bp.id AND pr.reaction_type = 'like') as like_count,
                  (SELECT COUNT(*) FROM post_comments pc WHERE pc.post_id = bp.id) as comment_count
                FROM blog_posts bp
                JOIN users u ON bp.user_id = u.id
                ORDER BY bp.created_at DESC
                LIMIT ?
            `, [limit], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }
}

module.exports = BlogPost; 