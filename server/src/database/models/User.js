const db = require('../init').db;
const bcrypt = require('bcryptjs');

class User {
    static async createTable() {
        return new Promise((resolve, reject) => {
            db.run(`
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT UNIQUE NOT NULL,
                    email TEXT UNIQUE NOT NULL,
                    password TEXT NOT NULL,
                    is_active BOOLEAN DEFAULT 1,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    last_login DATETIME,
                    last_password_change DATETIME
                )
            `, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    static async create({ username, email, password }) {
        const hashedPassword = await bcrypt.hash(password, 10);
        return new Promise((resolve, reject) => {
            db.run(
                'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                [username, email, hashedPassword],
                function(err) {
                    if (err) reject(err);
                    else resolve(this.lastID);
                }
            );
        });
    }

    static async findByEmail(email) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    static async findById(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    static async getPublicProfile(id) {
        return new Promise((resolve, reject) => {
            db.get(
                'SELECT id, username, email, created_at FROM users WHERE id = ?',
                [id],
                (err, row) => {
                    if (err) reject(err);
                    else resolve(row);
                }
            );
        });
    }

    static async updateLastLogin(id) {
        return new Promise((resolve, reject) => {
            db.run(
                'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
                [id],
                (err) => {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });
    }

    static async updatePassword(id, newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        return new Promise((resolve, reject) => {
            db.run(
                'UPDATE users SET password = ?, last_password_change = CURRENT_TIMESTAMP WHERE id = ?',
                [hashedPassword, id],
                (err) => {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });
    }

    static async deactivate(id) {
        return new Promise((resolve, reject) => {
            db.run(
                'UPDATE users SET is_active = 0 WHERE id = ?',
                [id],
                (err) => {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });
    }

    static async activate(id) {
        return new Promise((resolve, reject) => {
            db.run(
                'UPDATE users SET is_active = 1 WHERE id = ?',
                [id],
                (err) => {
                    if (err) reject(err);
                    else resolve();
                }
            );
        });
    }

    static async getSuggestedUsers(currentUserId, limit = 5) {
        return new Promise((resolve, reject) => {
            db.all(
                `SELECT id, username, email, created_at 
                FROM users 
                WHERE id != ? 
                AND id NOT IN (
                    SELECT following_id 
                    FROM followers 
                    WHERE follower_id = ?
                )
                ORDER BY RANDOM() 
                LIMIT ?`,
                [currentUserId, currentUserId, limit],
                (err, rows) => {
                    if (err) reject(err);
                    else resolve(rows);
                }
            );
        });
    }
}

module.exports = User; 