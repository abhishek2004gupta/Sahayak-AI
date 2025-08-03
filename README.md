# Sahayak AI - Advanced AI Chat Application

A comprehensive AI chat application built with React, featuring multiple AI models (TinyLlama & Gemini), Stable Diffusion image generation, user authentication, and persistent chat storage.

## ✨ Features

### 🤖 AI Integration
- **Dual AI Models**: TinyLlama (default) and Gemini 1.5 Flash
- **Model Switching**: Seamlessly switch between AI models
- **Customizable Response Lengths**: Choose from 50, 100, 200, 350, 500, 700, 900, or 1000 tokens
- **Real-time Response Streaming**: Watch responses appear word by word
- **Smart Prompt Suggestions**: Pre-built cards for common use cases

### 🎨 Image Generation
- **Stable Diffusion Integration**: Generate images from text descriptions
- **Local Model Support**: Run Stable Diffusion locally with Python server
- **Image Download**: Save generated images to your device
- **Gallery Integration**: Access generated images in chat history

### 🎤 Voice Input
- **Speech Recognition**: Click the mic button to speak your prompts
- **Visual Feedback**: Mic button pulses when listening
- **Browser-native**: Uses Web Speech API for compatibility

### 👤 User Experience
- **User Authentication**: Secure login/register system with PostgreSQL
- **Chat History**: Persistent storage of all conversations
- **User Profiles**: Personalized experience with user data
- **Modern UI**: Clean, responsive design with smooth animations
- **Keyboard Shortcuts**: Press Enter to send messages
- **Loading States**: Beautiful animated loading indicators

### 🏗️ Architecture
- **Well-organized Structure**: Modular components and services
- **Database Integration**: PostgreSQL for user management and chat storage
- **Custom Hooks**: Reusable logic for speech recognition and local storage
- **Context API**: Centralized state management
- **Service Layer**: Clean separation of AI service logic
- **Multi-model Support**: Extensible architecture for multiple AI models

## 📁 Project Structure

```
src/
├── components/
│   ├── chat/
│   │   ├── TokenLengthSelector.jsx
│   │   └── TokenLengthSelector.css
│   ├── common/
│   ├── Main/
│   │   ├── Main.jsx
│   │   └── Main.css
│   ├── Sidebar/
│   │   ├── Sidebar.jsx
│   │   └── Sidebar.css
│   └── ui/
│       ├── NameInputModal.jsx
│       └── NameInputModal.css
├── hooks/
│   ├── useLocalStorage.js
│   └── useSpeechRecognition.js
├── services/
│   └── ai/
│       ├── aiService.js
│       └── tinyllama_example.py
├── utils/
├── Context/
│   └── Context.jsx
├── assets/
│   └── assets.js
└── main.jsx
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL database
- Python 3.8+ (for local AI models)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gemini-clone
   ```

2. **Set up PostgreSQL Database**
   ```bash
   # Create database
   createdb sahayak
   
   # Run schema
   psql -d sahayak -f database_schema.sql
   ```

3. **Install Node.js dependencies**
   ```bash
   npm install
   ```

4. **Install Python dependencies (optional)**
   ```bash
   pip install -r requirements.txt
   ```

5. **Configure API Keys**
   - Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Update the API key in `src/services/ai/aiService.js`

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   Navigate to `http://localhost:5173`

## 🐍 Python Model Integration (Optional)

### TinyLlama Model
For local TinyLlama model usage:

1. **Install Python dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the example script**
   ```bash
   python src/services/ai/tinyllama_example.py
   ```

### Stable Diffusion Model
For local image generation:

1. **Run the Stable Diffusion server**
   ```bash
   python src/services/ai/stable_diffusion_server.py
   ```

2. **Access the API**
   - GUI: Opens automatically
   - API: `http://localhost:5000/generate`
   - Health check: `http://localhost:5000/health`

## 🎯 Usage

### Basic Chat
1. Enter your name when prompted (stored locally)
2. Type your message in the input field
3. Press Enter or click the send button
4. Watch the AI response appear in real-time

### Voice Input
1. Click the microphone icon
2. Speak your prompt clearly
3. The transcribed text will appear in the input field
4. Send the message as usual

### Customizing Response Length
1. Use the "Response Length" dropdown above the suggestion cards
2. Choose from 50 to 1000 tokens
3. Your selection affects all subsequent responses

### Quick Prompts
Click any of the suggestion cards to instantly send pre-written prompts:
- Travel suggestions
- Concept summaries
- Team activities
- Code improvements

## 🔧 Configuration

### Token Lengths
Modify the available token lengths in `src/services/ai/aiService.js`:
```javascript
export const TOKEN_LENGTHS = [50, 100, 200, 350, 500, 700, 900, 1000];
```

### API Configuration
Adjust model parameters in `src/services/ai/aiService.js`:
```javascript
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: maxTokens,
  responseMimeType: "text/plain",
};
```

## 🛠️ Technologies Used

- **Frontend**: React 18, Vite
- **Styling**: CSS3 with custom animations
- **AI**: Google Gemini API
- **Speech**: Web Speech API
- **Storage**: Local Storage API
- **State Management**: React Context API

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 🐛 Known Issues

- Speech recognition requires HTTPS in production
- Some browsers may have limited speech recognition support
- Large token lengths may increase response time

## 🔮 Future Enhancements

- [ ] Conversation history
- [ ] File upload support
- [ ] Multiple AI model support
- [ ] Export conversations
- [ ] Dark mode
- [ ] Mobile app version


D:\Coding\Projects\gemini-clone\frontend> npm run dev
(sahayak-env) PS D:\Coding\Projects\gemini-clone\backend> npm run dev
D:\Coding\Projects\gemini-clone> python start_model_server.py