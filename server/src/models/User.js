const { db } = require('../database/init');
const bcrypt = require('bcryptjs');

class User {
  static create({ username, email, password }, callback) {
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return callback(err);

      db.run(
        'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
        [username, email, hashedPassword],
        function(err) {
          if (err) return callback(err);
          callback(null, this.lastID);
        }
      );
    });
  }

  static findByEmail(email, callback) {
    db.get('SELECT * FROM users WHERE email = ?', [email], callback);
  }

  static findById(id, callback) {
    db.get('SELECT id, username, email, created_at FROM users WHERE id = ?', [id], callback);
  }

  static comparePassword(candidatePassword, hashedPassword, callback) {
    bcrypt.compare(candidatePassword, hashedPassword, callback);
  }
}

module.exports = User; 