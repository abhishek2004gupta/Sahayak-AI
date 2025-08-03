const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Authentication
  async login(username, password) {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }
    
    return response.json();
  }

  async register(username, password, email) {
    const response = await fetch(`${this.baseURL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password, email })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Registration failed');
    }
    
    return response.json();
  }

  // Chat management
  async getUserChats() {
    const response = await fetch(`${this.baseURL}/chat`, {
      headers: this.getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch chats');
    }
    
    return response.json();
  }

  async createChat(title = 'New Chat') {
    const response = await fetch(`${this.baseURL}/chat`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ title })
    });
    
    if (!response.ok) {
      throw new Error('Failed to create chat');
    }
    
    return response.json();
  }

  async updateChatTitle(chatId, title) {
    const response = await fetch(`${this.baseURL}/chat/${chatId}/title`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ title })
    });
    
    if (!response.ok) {
      throw new Error('Failed to update chat title');
    }
    
    return response.json();
  }

  async deleteChat(chatId) {
    const response = await fetch(`${this.baseURL}/chat/${chatId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete chat');
    }
    
    return response.json();
  }

  async getChatMessages(chatId) {
    const response = await fetch(`${this.baseURL}/chat/${chatId}/messages`, {
      headers: this.getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }
    
    return response.json();
  }

  async saveMessage(chatId, userMessage, aiResponse, modelUsed, tokenLength) {
    const response = await fetch(`${this.baseURL}/chat/${chatId}/messages`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        userMessage,
        aiResponse,
        modelUsed,
        tokenLength
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to save message');
    }
    
    return response.json();
  }

  async saveGeneratedImage(chatId, prompt, imagePath) {
    const response = await fetch(`${this.baseURL}/chat/${chatId}/images`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ prompt, imagePath })
    });
    
    if (!response.ok) {
      throw new Error('Failed to save image');
    }
    
    return response.json();
  }

  // AI generation
  async generateResponse(prompt, maxTokens, model = 'gemini') {
    const endpoint = model === 'tinyllama' ? '/ai/tinyllama' : '/ai/generate';
    
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, maxTokens })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate response');
    }
    
    return response.json();
  }

  // Image generation
  async generateImage(prompt, guidanceScale = 8.5) {
    const response = await fetch(`${this.baseURL}/ai/generate-image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, guidanceScale })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to generate image');
    }
    
    return response.json();
  }
}

export default new ApiService(); 