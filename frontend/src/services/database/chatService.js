import pool from '../../config/database.js';

export class ChatService {
  async createChat(userId, title = 'New Chat') {
    try {
      const query = `
        INSERT INTO chats (user_id, title)
        VALUES ($1, $2)
        RETURNING id, title, created_at
      `;
      const result = await pool.query(query, [userId, title]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error creating chat: ${error.message}`);
    }
  }

  async getUserChats(userId) {
    try {
      const query = `
        SELECT c.id, c.title, c.created_at, c.updated_at,
               COUNT(m.id) as message_count
        FROM chats c
        LEFT JOIN messages m ON c.id = m.chat_id
        WHERE c.user_id = $1
        GROUP BY c.id, c.title, c.created_at, c.updated_at
        ORDER BY c.updated_at DESC
      `;
      const result = await pool.query(query, [userId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Error getting user chats: ${error.message}`);
    }
  }

  async saveMessage(chatId, userMessage, aiResponse, modelUsed, tokenLength) {
    try {
      const query = `
        INSERT INTO messages (chat_id, user_message, ai_response, model_used, token_length)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, created_at
      `;
      const result = await pool.query(query, [chatId, userMessage, aiResponse, modelUsed, tokenLength]);
      
      // Update chat's updated_at timestamp
      await pool.query(
        'UPDATE chats SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
        [chatId]
      );
      
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error saving message: ${error.message}`);
    }
  }

  async getChatMessages(chatId) {
    try {
      const query = `
        SELECT id, user_message, ai_response, model_used, token_length, created_at
        FROM messages
        WHERE chat_id = $1
        ORDER BY created_at ASC
      `;
      const result = await pool.query(query, [chatId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Error getting chat messages: ${error.message}`);
    }
  }

  async saveGeneratedImage(chatId, prompt, imagePath) {
    try {
      const query = `
        INSERT INTO generated_images (chat_id, prompt, image_path)
        VALUES ($1, $2, $3)
        RETURNING id, created_at
      `;
      const result = await pool.query(query, [chatId, prompt, imagePath]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Error saving generated image: ${error.message}`);
    }
  }

  async getChatImages(chatId) {
    try {
      const query = `
        SELECT id, prompt, image_path, created_at
        FROM generated_images
        WHERE chat_id = $1
        ORDER BY created_at DESC
      `;
      const result = await pool.query(query, [chatId]);
      return result.rows;
    } catch (error) {
      throw new Error(`Error getting chat images: ${error.message}`);
    }
  }
}

export default new ChatService(); 