import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyAHG-MmtVIqb99rF58zUisj8BGP2gyO9c8');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Generate response with Gemini
router.post('/generate', async (req, res) => {
  try {
    const { prompt, maxTokens = 500 } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    const generationConfig = {
      temperature: 1,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: maxTokens,
      responseMimeType: "text/plain",
    };

    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(prompt);
    const response = result.response.text();
    
    res.json({ response, model: 'gemini' });
  } catch (error) {
    console.error('AI generation error:', error);
    res.status(500).json({ error: 'Failed to generate response' });
  }
});

// TinyLlama with model server connection
router.post('/tinyllama', async (req, res) => {
  try {
    const { prompt, maxTokens = 500 } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    // Call the model server
    const response = await fetch('http://localhost:5001/generate/text', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, max_tokens: maxTokens })
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        res.json({ response: data.response, model: 'tinyllama' });
      } else {
        throw new Error(data.error || 'Model server error');
      }
    } else {
      throw new Error('Model server not available');
    }
    
  } catch (error) {
    console.error('TinyLlama generation error:', error);
    // Fallback to simulated response
    const fallbackResponse = `[TinyLlama Response] ${prompt} - Generated with ${maxTokens} tokens. This is a simulated response from the TinyLlama model.`;
    res.json({ response: fallbackResponse, model: 'tinyllama' });
  }
});

// Image generation with model server
router.post('/generate-image', async (req, res) => {
  try {
    const { prompt, guidanceScale = 8.5 } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }
    
    // Call the model server
    const response = await fetch('http://localhost:5001/generate/image', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, guidance_scale: guidanceScale })
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.success) {
        res.json({
          success: true,
          image: data.image,
          prompt: data.prompt,
          model: 'stable_diffusion'
        });
      } else {
        throw new Error(data.error || 'Model server error');
      }
    } else {
      throw new Error('Model server not available');
    }
    
  } catch (error) {
    console.error('Image generation error:', error);
    res.status(500).json({ error: 'Failed to generate image' });
  }
});

export default router; 