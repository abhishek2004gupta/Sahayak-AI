// TinyLlama Service - Default AI Model
// This service will be used as the primary model

export const TOKEN_LENGTHS = [50, 100, 200, 350, 500, 700, 900, 1000];

export class TinyLlamaService {
  constructor() {
    this.modelName = 'TinyLlama-1.1B-Chat-v1.0';
    this.isAvailable = false;
    this.initializeModel();
  }

  async initializeModel() {
    try {
      // Check if we're in a browser environment that supports transformers
      if (typeof window !== 'undefined' && window.transformers) {
        this.isAvailable = true;
        console.log('TinyLlama model initialized successfully');
      } else {
        console.log('TinyLlama not available in browser, falling back to API');
        this.isAvailable = false;
      }
    } catch (error) {
      console.error('Error initializing TinyLlama:', error);
      this.isAvailable = false;
    }
  }

  async generateResponse(prompt, maxTokens = 500) {
    try {
      if (this.isAvailable) {
        return await this.generateWithLocalModel(prompt, maxTokens);
      } else {
        return await this.generateWithAPI(prompt, maxTokens);
      }
    } catch (error) {
      console.error('TinyLlama generation error:', error);
      throw new Error('Failed to generate response with TinyLlama');
    }
  }

  async generateWithLocalModel(prompt, maxTokens) {
    // This would use the local TinyLlama model
    // For now, we'll simulate the response
    const response = `[TinyLlama Response] ${prompt} - Generated with ${maxTokens} tokens. This is a simulated response from the local TinyLlama model.`;
    return response;
  }

  async generateWithAPI(prompt, maxTokens) {
    // Fallback to a simple API or simulated response
    const response = `[TinyLlama API Response] ${prompt} - Generated with ${maxTokens} tokens. This is a simulated API response.`;
    return response;
  }

  async generateWithTokenLength(prompt, tokenLength) {
    if (!TOKEN_LENGTHS.includes(tokenLength)) {
      throw new Error(`Invalid token length. Must be one of: ${TOKEN_LENGTHS.join(', ')}`);
    }
    return this.generateResponse(prompt, tokenLength);
  }

  getModelInfo() {
    return {
      name: this.modelName,
      isAvailable: this.isAvailable,
      tokenLengths: TOKEN_LENGTHS
    };
  }
}

export default new TinyLlamaService(); 