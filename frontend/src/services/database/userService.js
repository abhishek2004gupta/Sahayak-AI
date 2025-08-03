import pool from '../../config/database.js';
import bcrypt from 'bcrypt';

export class UserService {
  async createUser(username, password, email = null) {
    try {
      const passwordHash = await bcrypt.hash(password, 10);
      const query = `
        INSERT INTO users (username, password_hash, email)
        VALUES ($1, $2, $3)
        RETURNING id, username, email, created_at
      `;
      const result = await pool.query(query, [username, passwordHash, email]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  async authenticateUser(username, password) {
    try {
      const query = 'SELECT * FROM users WHERE username = $1';
      const result = await pool.query(query, [username]);
      
      if (result.rows.length === 0) {
        return null;
      }

      const user = result.rows[0];
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      
      if (!isValidPassword) {
        return null;
      }

      // Update last login
      await pool.query(
        'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = $1',
        [user.id]
      );

      return {
        id: user.id,
        username: user.username,
        email: user.email,
        created_at: user.created_at
      };
    } catch (error) {
      throw new Error(`Error authenticating user: ${error.message}`);
    }
  }

  async getUserById(userId) {
    try {
      const query = 'SELECT id, username, email, created_at, last_login FROM users WHERE id = $1';
      const result = await pool.query(query, [userId]);
      return result.rows[0] || null;
    } catch (error) {
      throw new Error(`Error getting user: ${error.message}`);
    }
  }
}

export default new UserService(); 