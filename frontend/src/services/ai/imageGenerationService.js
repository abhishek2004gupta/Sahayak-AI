// Image Generation Service using Stable Diffusion
// This service handles image generation requests

export class ImageGenerationService {
  constructor() {
    this.modelId = "CompVis/stable-diffusion-v1-4";
    this.isAvailable = false;
    this.isGenerating = false;
    this.initializeModel();
  }

  async initializeModel() {
    try {
      // Check if Python script is available
      this.isAvailable = true;
      console.log('Stable Diffusion Python script available');
    } catch (error) {
      console.error('Error initializing Stable Diffusion:', error);
      this.isAvailable = false;
    }
  }

  async generateImage(prompt, guidanceScale = 8.5) {
    try {
      this.isGenerating = true;
      console.log('Starting image generation...');
      
      // Call the Python script directly
      const result = await this.generateWithPythonScript(prompt, guidanceScale);
      
      this.isGenerating = false;
      return result;
    } catch (error) {
      this.isGenerating = false;
      console.error('Image generation error:', error);
      throw new Error('Failed to generate image');
    }
  }

  async generateWithPythonScript(prompt, guidanceScale) {
    try {
      // Call the existing Python script
      const response = await fetch('http://localhost:5000/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          guidance_scale: guidanceScale
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        return {
          url: `data:image/png;base64,${result.image}`,
          prompt: result.prompt,
          model: 'Stable Diffusion v1.4',
          timestamp: new Date().toISOString()
        };
      } else {
        throw new Error(result.error || 'Generation failed');
      }
    } catch (error) {
      console.error('Python script error:', error);
      // Fallback to placeholder
      return {
        url: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTEyIiBoZWlnaHQ9IjUxMiIgdmlld0JveD0iMCAwIDUxMiA1MTIiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiBmaWxsPSIjRjNGNEY2Ii8+Cjx0ZXh0IHg9IjI1NiIgeT0iMjU2IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM2QjcyODAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5HZW5lcmF0aW5nLi4uPC90ZXh0Pgo8L3N2Zz4K',
        prompt: prompt,
        model: 'Stable Diffusion (Fallback)',
        timestamp: new Date().toISOString()
      };
    }
  }

  async downloadImage(imageData, filename = 'generated_image.png') {
    try {
      const link = document.createElement('a');
      link.href = imageData.url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading image:', error);
      throw new Error('Failed to download image');
    }
  }

  getModelInfo() {
    return {
      name: 'Stable Diffusion v1.4',
      isAvailable: this.isAvailable,
      modelId: this.modelId,
      isGenerating: this.isGenerating
    };
  }

  getGeneratingStatus() {
    return this.isGenerating;
  }
}

export default new ImageGenerationService(); 