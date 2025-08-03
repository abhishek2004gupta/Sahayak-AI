#!/usr/bin/env python3
"""
Startup script for Sahayak AI Model Server
This script will start the model server with both TinyLlama and Stable Diffusion
"""

import sys
import os
import subprocess
import time
import requests

def check_dependencies():
    """Check if required packages are installed"""
    required_packages = {
        'transformers': 'transformers',
        'torch': 'torch',
        'diffusers': 'diffusers',
        'Pillow': 'PIL',           # 👈 Fix here
        'flask': 'flask',
        'flask-cors': 'flask_cors' # 👈 Fix here
    }
    missing_packages = []
    for pip_name, import_name in required_packages.items():
        try:
            __import__(import_name)
            print(f"[OK] {pip_name}")
        except ImportError:
            missing_packages.append(pip_name)
            print(f"[ERROR] {pip_name}")

    
    if missing_packages:
        print(f"\n[ERROR] Missing packages: {', '.join(missing_packages)}")
        print("Please install them using:")
        print(f"pip install {' '.join(missing_packages)}")
        return False
    
    print("\n[OK] All dependencies are installed!")
    return True

def start_model_server():
    """Start the model server"""
    script_path = os.path.join('frontend', 'src', 'services', 'ai', 'model_server.py')
    
    if not os.path.exists(script_path):
        print(f"[ERROR] Model server script not found at: {script_path}")
        return False
    
    print("[START] Starting Model Server...")
    print("[INFO] This will load both TinyLlama and Stable Diffusion models")
    print("[INFO] This may take a few minutes on first run...")
    print("-" * 50)
    
    try:
        # Start the model server
        process = subprocess.Popen([
            sys.executable, script_path,
            '--load-tinyllama',
            '--load-stable-diffusion'
        ], stdout=subprocess.PIPE, stderr=subprocess.STDOUT, universal_newlines=True)
        
        # Monitor the output
        while True:
            output = process.stdout.readline()
            if output == '' and process.poll() is not None:
                break
            if output:
                print(output.strip())
        
        return_code = process.poll()
        if return_code != 0:
            print(f"[ERROR] Model server exited with code {return_code}")
            return False
            
    except Exception as e:
        print(f"[ERROR] Error starting model server: {e}")
        return False
    
    return True

def test_model_server():
    """Test if the model server is running"""
    try:
        response = requests.get('http://localhost:5001/health', timeout=5)
        if response.status_code == 200:
            data = response.json()
            print("\n[OK] Model Server is running!")
            print(f"   TinyLlama: {'[LOADED]' if data.get('tinyllama_loaded') else '[NOT LOADED]'}")
            print(f"   Stable Diffusion: {'[LOADED]' if data.get('stable_diffusion_loaded') else '[NOT LOADED]'}")
            return True
        else:
            print(f"[ERROR] Model server health check failed: {response.status_code}")
            return False
    except requests.exceptions.RequestException as e:
        print(f"[ERROR] Cannot connect to model server: {e}")
        return False

if __name__ == "__main__":
    print("[SETUP] Sahayak AI Model Server Setup")
    print("=" * 40)
    
    # Check dependencies
    print("\n[CHECK] Checking dependencies...")
    if not check_dependencies():
        sys.exit(1)
    
    # Start model server
    print("\n[START] Starting model server...")
    if start_model_server():
        print("\n[OK] Model server started successfully!")
        
        # Test the server
        print("\n[TEST] Testing model server...")
        if test_model_server():
            print("\n[READY] Everything is ready!")
            print("[INFO] You can now use the website with real AI models")
            print("[INFO] Keep this terminal open while using the website")
        else:
            print("\n[WARN] Model server may not be fully ready")
            print("[INFO] Check the output above for any errors")
    else:
        print("\n[ERROR] Failed to start model server")
        print("[INFO] Check the output above for errors")
        sys.exit(1) 