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

    static async create({ title, content, country_name, date_of_visit, user_id }) {
        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO blog_posts (title, content, country_name, date_of_visit, user_id)
                 VALUES (?, ?, ?, ?, ?)`,
                [title, content, country_name, date_of_visit, user_id],
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
                SELECT bp.*, u.username 
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

    static async update(id, { title, content, country_name, date_of_visit }) {
        return new Promise((resolve, reject) => {
            db.run(
                `UPDATE blog_posts 
                 SET title = ?, content = ?, country_name = ?, date_of_visit = ?, updated_at = CURRENT_TIMESTAMP
                 WHERE id = ?`,
                [title, content, country_name, date_of_visit, id],
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
                SELECT bp.*, u.username 
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
                SELECT bp.*, u.username 
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
}

module.exports = BlogPost; 