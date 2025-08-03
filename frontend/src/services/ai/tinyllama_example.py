# Load model directly
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

# Token length options as requested
TOKEN_LENGTHS = [50, 100, 200, 350, 500, 700, 900, 1000]

def load_model():
    """Load the TinyLlama model and tokenizer"""
    tokenizer = AutoTokenizer.from_pretrained("TinyLlama/TinyLlama-1.1B-Chat-v1.0")
    model = AutoModelForCausalLM.from_pretrained("TinyLlama/TinyLlama-1.1B-Chat-v1.0")
    return tokenizer, model

def generate_response(tokenizer, model, prompt, max_new_tokens=100):
    """Generate response with specified token length"""
    messages = [
        {"role": "user", "content": prompt},
    ]
    
    inputs = tokenizer.apply_chat_template(
        messages,
        add_generation_prompt=True,
        tokenize=True,
        return_dict=True,
        return_tensors="pt",
    ).to(model.device)

    outputs = model.generate(**inputs, max_new_tokens=max_new_tokens)
    response = tokenizer.decode(outputs[0][inputs["input_ids"].shape[-1]:])
    return response

import argparse
import sys

def main():
    """Main function to demonstrate different token lengths"""
    parser = argparse.ArgumentParser(description='TinyLlama AI Model')
    parser.add_argument('--prompt', type=str, help='Input prompt for the model')
    parser.add_argument('--max_tokens', type=int, default=500, help='Maximum tokens for response')
    
    args = parser.parse_args()
    
    if args.prompt:
        # Single prompt mode for web integration
        try:
            print("Loading TinyLlama model...")
            tokenizer, model = load_model()
            
            response = generate_response(tokenizer, model, args.prompt, args.max_tokens)
            print(response)
        except Exception as e:
            print(f"Error: {e}")
            sys.exit(1)
    else:
        # Demo mode
    print("Loading TinyLlama model...")
    tokenizer, model = load_model()
    
    # Example prompt
    prompt = "best places in india to visit"
    
    print(f"\nGenerating responses for prompt: '{prompt}'")
    print("=" * 60)
    
    for token_length in TOKEN_LENGTHS:
        print(f"\n--- Response with {token_length} tokens ---")
        try:
            response = generate_response(tokenizer, model, prompt, token_length)
            print(f"Length: {len(response.split())} words")
            print(f"Response: {response}")
        except Exception as e:
            print(f"Error generating {token_length} token response: {e}")
    
    print("\n" + "=" * 60)
    print("All responses generated successfully!")

if __name__ == "__main__":
    main() 