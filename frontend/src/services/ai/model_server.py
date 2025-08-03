#!/usr/bin/env python3
"""
Unified Model Server for Sahayak AI
Loads both TinyLlama and Stable Diffusion models
"""

import argparse
import json
import sys
import base64
import io
from flask import Flask, request, jsonify
from flask_cors import CORS
import threading
import time

# Import model functions
try:
    from transformers import AutoTokenizer, AutoModelForCausalLM
    import torch
    TINYLLAMA_AVAILABLE = True
except ImportError:
    TINYLLAMA_AVAILABLE = False
    print("Warning: TinyLlama not available - transformers not installed")

try:
    from diffusers import StableDiffusionPipeline
    from PIL import Image
    STABLE_DIFFUSION_AVAILABLE = True
except ImportError:
    STABLE_DIFFUSION_AVAILABLE = False
    print("Warning: Stable Diffusion not available - diffusers not installed")

app = Flask(__name__)
CORS(app)

# Global model variables
tinyllama_tokenizer = None
tinyllama_model = None
stable_diffusion_pipe = None

def load_tinyllama():
    """Load TinyLlama model"""
    global tinyllama_tokenizer, tinyllama_model
    
    if not TINYLLAMA_AVAILABLE:
        return False
    
    try:
        print("Loading TinyLlama model...")
        tinyllama_tokenizer = AutoTokenizer.from_pretrained("TinyLlama/TinyLlama-1.1B-Chat-v1.0")
        tinyllama_model = AutoModelForCausalLM.from_pretrained("TinyLlama/TinyLlama-1.1B-Chat-v1.0")
        print("[OK] TinyLlama model loaded successfully")
        return True
    except Exception as e:
        print(f"[ERROR] Error loading TinyLlama: {e}")
        return False

def load_stable_diffusion():
    """Load Stable Diffusion model"""
    global stable_diffusion_pipe
    
    if not STABLE_DIFFUSION_AVAILABLE:
        return False
    
    try:
        print("Loading Stable Diffusion model...")
        modelid = "CompVis/stable-diffusion-v1-4"
        stable_diffusion_pipe = StableDiffusionPipeline.from_pretrained(
            modelid,
            revision="fp16",
            torch_dtype=torch.float16,
        )
        device = "cuda" if torch.cuda.is_available() else "cpu"
        stable_diffusion_pipe.to(device)
        print(f"[OK] Stable Diffusion model loaded successfully on {device}")
        return True
    except Exception as e:
        print(f"[ERROR] Error loading Stable Diffusion: {e}")
        return False

def generate_tinyllama_response(prompt, max_tokens=500):
    """Generate response using TinyLlama"""
    if not tinyllama_model or not tinyllama_tokenizer:
        return None
    
    try:
        messages = [
            {"role": "user", "content": prompt},
        ]
        
        inputs = tinyllama_tokenizer.apply_chat_template(
            messages,
            add_generation_prompt=True,
            tokenize=True,
            return_dict=True,
            return_tensors="pt",
        ).to(tinyllama_model.device)

        outputs = tinyllama_model.generate(**inputs, max_new_tokens=max_tokens)
        response = tinyllama_tokenizer.decode(outputs[0][inputs["input_ids"].shape[-1]:])
        return response
    except Exception as e:
        print(f"Error generating TinyLlama response: {e}")
        return None

def generate_stable_diffusion_image(prompt, guidance_scale=8.5):
    """Generate image using Stable Diffusion"""
    if not stable_diffusion_pipe:
        return None
    
    try:
        with torch.autocast(stable_diffusion_pipe.device):
            image = stable_diffusion_pipe(prompt, guidance_scale=guidance_scale).images[0]
        
        # Convert to base64
        buffer = io.BytesIO()
        image.save(buffer, format='PNG')
        img_str = base64.b64encode(buffer.getvalue()).decode()
        
        return {
            'image': img_str,
            'prompt': prompt
        }
    except Exception as e:
        print(f"Error generating Stable Diffusion image: {e}")
        return None

# Flask routes
@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'tinyllama_loaded': tinyllama_model is not None,
        'stable_diffusion_loaded': stable_diffusion_pipe is not None,
        'tinyllama_available': TINYLLAMA_AVAILABLE,
        'stable_diffusion_available': STABLE_DIFFUSION_AVAILABLE
    })

@app.route('/generate/text', methods=['POST'])
def generate_text():
    """Generate text response"""
    try:
        data = request.json
        prompt = data.get('prompt', '')
        max_tokens = data.get('max_tokens', 500)
        
        if not prompt:
            return jsonify({'error': 'Prompt is required'}), 400
        
        response = generate_tinyllama_response(prompt, max_tokens)
        
        if response:
            return jsonify({
                'success': True,
                'response': response,
                'model': 'tinyllama'
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Failed to generate response'
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

@app.route('/generate/image', methods=['POST'])
def generate_image():
    """Generate image"""
    try:
        data = request.json
        prompt = data.get('prompt', '')
        guidance_scale = data.get('guidance_scale', 8.5)
        
        if not prompt:
            return jsonify({'error': 'Prompt is required'}), 400
        
        result = generate_stable_diffusion_image(prompt, guidance_scale)
        
        if result:
            return jsonify({
                'success': True,
                'image': result['image'],
                'prompt': result['prompt'],
                'model': 'stable_diffusion'
            })
        else:
            return jsonify({
                'success': False,
                'error': 'Failed to generate image'
            }), 500
            
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

def run_server(host='0.0.0.0', port=5001):
    """Run the Flask server"""
    print(f"[START] Starting Model Server on {host}:{port}")
    print("[STATUS] Model Status:")
    print(f"   TinyLlama: {'[LOADED]' if tinyllama_model else '[NOT LOADED]'}")
    print(f"   Stable Diffusion: {'[LOADED]' if stable_diffusion_pipe else '[NOT LOADED]'}")
    
    app.run(host=host, port=port, debug=False)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Sahayak AI Model Server')
    parser.add_argument('--host', default='0.0.0.0', help='Host to bind to')
    parser.add_argument('--port', type=int, default=5001, help='Port to bind to')
    parser.add_argument('--load-tinyllama', action='store_true', help='Load TinyLlama model')
    parser.add_argument('--load-stable-diffusion', action='store_true', help='Load Stable Diffusion model')
    
    args = parser.parse_args()
    
    # Load models based on arguments
    if args.load_tinyllama:
        load_tinyllama()
    
    if args.load_stable_diffusion:
        load_stable_diffusion()
    
    # If no specific models requested, load both
    if not args.load_tinyllama and not args.load_stable_diffusion:
        load_tinyllama()
        load_stable_diffusion()
    
    run_server(args.host, args.port) 