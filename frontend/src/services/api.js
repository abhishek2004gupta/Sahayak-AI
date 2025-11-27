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

  async handleResponse(response) {
    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new Error('Unauthorized');
      }
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Request failed');
    }
    return response.json();
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

    return this.handleResponse(response);
  }

  async createChat(title = 'New Chat') {
    const response = await fetch(`${this.baseURL}/chat`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ title })
    });

    return this.handleResponse(response);
  }

  async updateChatTitle(chatId, title) {
    const response = await fetch(`${this.baseURL}/chat/${chatId}/title`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ title })
    });

    return this.handleResponse(response);
  }

  async deleteChat(chatId) {
    const response = await fetch(`${this.baseURL}/chat/${chatId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });

    return this.handleResponse(response);
  }

  async getChatMessages(chatId) {
    const response = await fetch(`${this.baseURL}/chat/${chatId}/messages`, {
      headers: this.getAuthHeaders()
    });

    return this.handleResponse(response);
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

    return this.handleResponse(response);
  }

  async saveGeneratedImage(chatId, prompt, imagePath) {
    const response = await fetch(`${this.baseURL}/chat/${chatId}/images`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ prompt, imagePath })
    });

    return this.handleResponse(response);
  }

  // AI generation
  async generateResponse(prompt, maxTokens, model = 'gemini') {
    const endpoint = model === 'tinyllama' ? '/ai/tinyllama' : '/ai/generate';

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, maxTokens })
    });

    return this.handleResponse(response);
  }

  // Image generation
  async generateImage(prompt, guidanceScale = 8.5) {
    const response = await fetch(`${this.baseURL}/ai/generate-image`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, guidanceScale })
    });

    return this.handleResponse(response);
  }
}

export default new ApiService();