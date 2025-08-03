import tkinter as tk
import customtkinter as ctk
from PIL import ImageTk, Image
import torch
from torch import autocast
from diffusers import StableDiffusionPipeline
import os
import base64
import io
from flask import Flask, request, jsonify
from flask_cors import CORS
import threading

app = Flask(__name__)
CORS(app)

# Global variables for the model
pipe = None
device = "cuda" if torch.cuda.is_available() else "cpu"

def load_model():
    """Load the Stable Diffusion model"""
    global pipe
    try:
        modelid = "CompVis/stable-diffusion-v1-4"
        pipe = StableDiffusionPipeline.from_pretrained(
            modelid,
            revision="fp16",
            torch_dtype=torch.float16,
        )
        pipe.to(device)
        print(f"Model loaded successfully on {device}")
        return True
    except Exception as e:
        print(f"Error loading model: {e}")
        return False

def generate_image(prompt, guidance_scale=8.5):
    """Generate image using Stable Diffusion"""
    if pipe is None:
        return None
    
    try:
        with autocast(device):
            image = pipe(prompt, guidance_scale=guidance_scale).images[0]
        
        # Convert to base64 for web transmission
        buffer = io.BytesIO()
        image.save(buffer, format='PNG')
        img_str = base64.b64encode(buffer.getvalue()).decode()
        
        return {
            'success': True,
            'image': img_str,
            'prompt': prompt
        }
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

@app.route('/generate', methods=['POST'])
def generate_endpoint():
    """API endpoint for image generation"""
    try:
        data = request.json
        prompt = data.get('prompt', '')
        guidance_scale = data.get('guidance_scale', 8.5)
        
        if not prompt:
            return jsonify({'success': False, 'error': 'No prompt provided'}), 400
        
        result = generate_image(prompt, guidance_scale)
        return jsonify(result)
    
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': pipe is not None,
        'device': device
    })

def run_flask_server():
    """Run the Flask server"""
    app.run(host='0.0.0.0', port=5000, debug=False)

def create_gui():
    """Create the GUI for local testing"""
    app_gui = tk.Tk()
    app_gui.geometry("532x632")
    app_gui.title("Stable Diffusion - Sahayak AI")
    ctk.set_appearance_mode("dark")

    prompt_entry = ctk.CTkEntry(
        master=app_gui, 
        height=40, 
        width=512, 
        font=("Arial", 20), 
        text_color="black", 
        fg_color="white"
    )
    prompt_entry.place(x=10, y=10)

    lmain = ctk.CTkLabel(master=app_gui, height=512, width=512)
    lmain.place(x=10, y=110)

    def generate_gui():
        prompt_text = prompt_entry.get()
        if not prompt_text:
            return
        
        # Show generating status
        trigger.configure(text="Generating...")
        trigger.configure(state="disabled")
        app_gui.update()
        
        try:
            result = generate_image(prompt_text)
            if result and result['success']:
                # Convert base64 back to image for GUI
                img_data = base64.b64decode(result['image'])
                img = Image.open(io.BytesIO(img_data))
                img_tk = ImageTk.PhotoImage(img)
                lmain.configure(image=img_tk)
                lmain.image = img_tk
                
                # Save the image
                img.save('generatedimage.png')
                print(f"Image generated and saved for prompt: {prompt_text}")
            else:
                print(f"Failed to generate image: {result.get('error', 'Unknown error')}")
        except Exception as e:
            print(f"Error generating image: {e}")
        finally:
            # Reset button
            trigger.configure(text="Generate")
            trigger.configure(state="normal")

    trigger = ctk.CTkButton(
        master=app_gui, 
        height=40, 
        width=120, 
        font=("Arial", 20), 
        text_color="white", 
        fg_color="blue", 
        command=generate_gui
    )
    trigger.configure(text="Generate")
    trigger.place(x=206, y=60)

    app_gui.mainloop()

if __name__ == "__main__":
    print("[INFO] Loading Stable Diffusion model...")
    if load_model():
        print("[OK] Model loaded successfully!")
        
        # Start Flask server in a separate thread
        server_thread = threading.Thread(target=run_flask_server, daemon=True)
        server_thread.start()
        
        print("[INFO] Flask server started on http://localhost:5000")
        print("[INFO] Starting GUI...")
        
        # Start GUI
        create_gui()
    else:
        print("[ERROR] Failed to load model. Exiting...")