import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get user chats
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT c.id, c.title, c.created_at, c.updated_at,
              COUNT(m.id) as message_count
       FROM chats c
       LEFT JOIN messages m ON c.id = m.chat_id
       WHERE c.user_id = $1
       GROUP BY c.id, c.title, c.created_at, c.updated_at
       ORDER BY c.updated_at DESC`,
      [req.user.userId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error getting chats:', error);
    res.status(500).json({ error: 'Failed to get chats' });
  }
});

// Create new chat
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title = 'New Chat', firstMessage = null } = req.body;
    
    const result = await pool.query(
      'INSERT INTO chats (user_id, title) VALUES ($1, $2) RETURNING id, title, created_at',
      [req.user.userId, title]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({ error: 'Failed to create chat' });
  }
});

// Update chat title with first message
router.patch('/:chatId/title', authenticateToken, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { title } = req.body;
    
    // Verify chat belongs to user
    const chatCheck = await pool.query(
      'SELECT id FROM chats WHERE id = $1 AND user_id = $2',
      [chatId, req.user.userId]
    );
    
    if (chatCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    
    const result = await pool.query(
      'UPDATE chats SET title = $1 WHERE id = $2 RETURNING id, title',
      [title, chatId]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating chat title:', error);
    res.status(500).json({ error: 'Failed to update chat title' });
  }
});

// Get chat messages
router.get('/:chatId/messages', authenticateToken, async (req, res) => {
  try {
    const { chatId } = req.params;
    
    // Verify chat belongs to user
    const chatCheck = await pool.query(
      'SELECT id FROM chats WHERE id = $1 AND user_id = $2',
      [chatId, req.user.userId]
    );
    
    if (chatCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    
    const result = await pool.query(
      'SELECT id, user_message, ai_response, model_used, token_length, created_at FROM messages WHERE chat_id = $1 ORDER BY created_at ASC',
      [chatId]
    );
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error getting messages:', error);
    res.status(500).json({ error: 'Failed to get messages' });
  }
});

// Save message
router.post('/:chatId/messages', authenticateToken, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { userMessage, aiResponse, modelUsed, tokenLength } = req.body;
    
    // Verify chat belongs to user
    const chatCheck = await pool.query(
      'SELECT id FROM chats WHERE id = $1 AND user_id = $2',
      [chatId, req.user.userId]
    );
    
    if (chatCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    
    const result = await pool.query(
      'INSERT INTO messages (chat_id, user_message, ai_response, model_used, token_length) VALUES ($1, $2, $3, $4, $5) RETURNING id, created_at',
      [chatId, userMessage, aiResponse, modelUsed, tokenLength]
    );
    
    // Update chat's updated_at timestamp
    await pool.query(
      'UPDATE chats SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [chatId]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error saving message:', error);
    res.status(500).json({ error: 'Failed to save message' });
  }
});

// Save generated image
router.post('/:chatId/images', authenticateToken, async (req, res) => {
  try {
    const { chatId } = req.params;
    const { prompt, imagePath } = req.body;
    
    // Verify chat belongs to user
    const chatCheck = await pool.query(
      'SELECT id FROM chats WHERE id = $1 AND user_id = $2',
      [chatId, req.user.userId]
    );
    
    if (chatCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    
    const result = await pool.query(
      'INSERT INTO generated_images (chat_id, prompt, image_path) VALUES ($1, $2, $3) RETURNING id, created_at',
      [chatId, prompt, imagePath]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error saving image:', error);
    res.status(500).json({ error: 'Failed to save image' });
  }
});

// Delete chat
router.delete('/:chatId', authenticateToken, async (req, res) => {
  try {
    const { chatId } = req.params;
    
    // Verify chat belongs to user
    const chatCheck = await pool.query(
      'SELECT id FROM chats WHERE id = $1 AND user_id = $2',
      [chatId, req.user.userId]
    );
    
    if (chatCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Chat not found' });
    }
    
    // Delete chat (cascade will delete messages and images)
    await pool.query('DELETE FROM chats WHERE id = $1', [chatId]);
    
    res.json({ message: 'Chat deleted successfully' });
  } catch (error) {
    console.error('Error deleting chat:', error);
    res.status(500).json({ error: 'Failed to delete chat' });
  }
});

export default router; 