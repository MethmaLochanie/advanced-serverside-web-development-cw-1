const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../database/init');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

// Email configuration
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Insert user with verification token
    db.run(
      'INSERT INTO users (username, email, password, verification_token) VALUES (?, ?, ?, ?)',
      [username, email, hashedPassword, verificationToken],
      async function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(409).json({ message: 'Username or email already exists' });
          }
          return res.status(500).json({ message: 'Error creating user' });
        }

        // Send verification email
        try {
          await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: email,
            subject: 'Verify your email',
            html: `Please click <a href="${process.env.FRONTEND_URL}/verify-email/${verificationToken}">here</a> to verify your email.`
          });
        } catch (emailErr) {
          console.error('Error sending verification email:', emailErr);
        }

        // Generate initial API key
        const apiKey = crypto.randomBytes(32).toString('hex');
        db.run(
          'INSERT INTO api_keys (user_id, api_key) VALUES (?, ?)',
          [this.lastID, apiKey],
          (err) => {
            if (err) {
              return res.status(500).json({ message: 'Error generating API key' });
            }

            res.status(201).json({
              message: 'User registered successfully. Please check your email to verify your account.',
              apiKey
            });
          }
        );
      }
    );
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error during registration' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user
    const user = await new Promise((resolve, reject) => {
      db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if account is locked
    if (user.account_locked_until && new Date(user.account_locked_until) > new Date()) {
      return res.status(401).json({ 
        message: 'Account is locked. Please try again later.',
        lockedUntil: user.account_locked_until
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Increment failed login attempts
      const failedAttempts = (user.failed_login_attempts || 0) + 1;
      const accountLockedUntil = failedAttempts >= 5 ? 
        new Date(Date.now() + 15 * 60 * 1000) : // Lock for 15 minutes
        null;

      await new Promise((resolve, reject) => {
        db.run(
          'UPDATE users SET failed_login_attempts = ?, account_locked_until = ? WHERE id = ?',
          [failedAttempts, accountLockedUntil, user.id],
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
      });

      return res.status(401).json({ 
        message: 'Invalid credentials',
        remainingAttempts: 5 - failedAttempts
      });
    }

    // Reset failed login attempts
    await new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET failed_login_attempts = 0, account_locked_until = NULL, last_login = CURRENT_TIMESTAMP WHERE id = ?',
        [user.id],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Get user's API keys
    const apiKeys = await new Promise((resolve, reject) => {
      db.all(
        'SELECT api_key FROM api_keys WHERE user_id = ? AND is_active = 1',
        [user.id],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });

    const userData = {
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        emailVerified: user.email_verified,
        apiKeys: apiKeys.map(k => k.api_key)
      }
    };
    res.json(userData);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error during login' });
  }
};

const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    const result = await new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET email_verified = 1, verification_token = NULL WHERE verification_token = ?',
        [token],
        function(err) {
          if (err) reject(err);
          else resolve(this.changes);
        }
      );
    });

    if (result === 0) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'Error verifying email' });
  }
};

const resetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await new Promise((resolve, reject) => {
      db.get('SELECT id FROM users WHERE email = ?', [email], (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour

    await new Promise((resolve, reject) => {
      db.run(
        'UPDATE users SET reset_password_token = ?, reset_password_expires = ? WHERE id = ?',
        [resetToken, resetExpires, user.id],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    // Send reset email
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Reset your password',
      html: `Please click <a href="${process.env.FRONTEND_URL}/reset-password/${resetToken}">here</a> to reset your password.`
    });

    res.json({ message: 'Password reset instructions sent to your email' });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({ message: 'Error processing password reset' });
  }
};

const validateToken = (req, res) => {
  // The user object is already attached to req by the verifyToken middleware
  const userId = req.user.id;

  // Get fresh user data
  db.get(
    'SELECT id, username, email, role, is_active FROM users WHERE id = ?',
    [userId],
    (err, user) => {
      if (err) {
        return res.status(500).json({ message: 'Database error' });
      }
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      if (!user.is_active) {
        return res.status(401).json({ message: 'Account is inactive' });
      }

      // Get user's API keys
      db.all(
        'SELECT id, api_key, is_active, created_at, last_used FROM api_keys WHERE user_id = ? AND is_active = 1',
        [userId],
        (err, apiKeys) => {
          if (err) {
            return res.status(500).json({ message: 'Error retrieving API keys' });
          }

          // Generate a fresh token
          const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
          );

          res.json({
            token,
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
              role: user.role,
              apiKeys: apiKeys.map(k => k.api_key)
            }
          });
        }
      );
    }
  );
};

module.exports = {
  register,
  login,
  validateToken,
  verifyEmail,
  resetPassword
}; 