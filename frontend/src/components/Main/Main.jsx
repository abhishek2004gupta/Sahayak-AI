import React, { useContext, useState, useEffect } from 'react';
import './Main.css';
import { assets } from '../../assets/assets';
import { Context } from '../../Context/Context';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import NameInputModal from '../ui/NameInputModal';
import TokenLengthSelector from '../chat/TokenLengthSelector';
import ModelSelector from '../chat/ModelSelector';
import LoginPage from '../auth/LoginPage';

const Main = () => {
  const { 
    // Authentication
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    
    // Chat state
    onSent, 
    recentPrompt, 
    showResult, 
    loading, 
    resultData, 
    setInput, 
    input, 
    prevPrompts, 
    setRecentPrompt,
    selectedTokenLength,
    setSelectedTokenLength,
    
    // Model selection
    selectedModel,
    setSelectedModel,
    tinyllamaInfo,
    geminiInfo,
    
    // Chat management
    currentChat,
    userChats,
    chatMessages,
    createNewChat,
    loadChat,
    
    // Image generation
    generateImage
  } = useContext(Context);
  
  const [showNameModal, setShowNameModal] = useState(false);
  const [generatingImage, setGeneratingImage] = useState(false);
  const { isListening, startListening, stopListening } = useSpeechRecognition();

  const handleMicClick = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening((transcript) => {
        setInput(transcript);
      });
    }
  };

  const handleCardClick = (prompt) => {
    setInput(prompt);
    setRecentPrompt(prompt);
    prevPrompts.push(prompt);
    onSent(prompt);
  };

  const handleImageGeneration = async (prompt) => {
    if (!prompt.trim()) return;
    
    setGeneratingImage(true);
    try {
      const imageData = await generateImage(prompt);
      // The image will be displayed in the chat
      console.log('Image generated successfully:', imageData);
    } catch (error) {
      console.error('Image generation failed:', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setGeneratingImage(false);
    }
  };

  const handleGalleryClick = () => {
    const imagePrompt = prompt("Enter image description:");
    if (imagePrompt) {
      handleImageGeneration(imagePrompt);
    }
  };

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loader">
          <div className="inner one"></div>
          <div className="inner two"></div>
          <div className="inner three"></div>
        </div>
        <p>Loading Sahayak AI...</p>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={login} onRegister={register} />;
  }

  return (
    <div className="main">
      <div className="nav">
        <div className="nav-left">
          <p>Sahayak AI</p>
          <span className="user-info">Welcome, {user?.username}</span>
        </div>
        <div className="nav-right">
          <button onClick={logout} className="logout-btn">Logout</button>
          <img src={assets.user_icon} alt="" />
        </div>
      </div>
      
      <div className="main-container">
            <div className="greet">
              <p>
                <span>Hello, {user?.username}.</span>
              </p>
              <p>How can I help you today?</p>
            </div>
            
            <div className="controls-section">
              <ModelSelector 
                selectedModel={selectedModel}
                onModelChange={setSelectedModel}
                tinyllamaInfo={tinyllamaInfo}
                geminiInfo={geminiInfo}
              />
              
              <TokenLengthSelector 
                selectedLength={selectedTokenLength}
                onLengthChange={setSelectedTokenLength}
              />
            </div>
            
        {!showResult ? (
            <div className="cards">
              <div onClick={() => handleCardClick('Suggest beautiful places to see on an upcoming road trip')} className="card">
                <p>Suggest beautiful places to see on an upcoming road trip</p>
                <img src={assets.compass_icon} alt="" />
              </div>
              <div onClick={() => handleCardClick('Briefly summarise this concept: urban planning')} className="card">
                <p>Briefly summarise this concept: urban planning</p>
                <img src={assets.bulb_icon} alt="" />
              </div>
              <div onClick={() => handleCardClick('Brainstorm team bonding activities for our work retreat')} className="card">
                <p>Brainstorm team bonding activities for our work retreat</p>
                <img src={assets.message_icon} alt="" />
              </div>
              <div onClick={() => handleCardClick('Improve the readability of the following code')} className="card">
                <p>Improve the readability of the following code</p>
                <img src={assets.code_icon} alt="" />
              </div>
            </div>
        ) : (
          <div className="chat-container">
            {chatMessages.map((message, index) => (
              <div key={index} className="message-pair">
                <div className="user-message">
              <img src={assets.user_icon} alt="" />
                  <p>{message.user_message}</p>
                </div>
                <div className="ai-message">
                  <img src={assets.gemini_icon} alt="" />
                  <p dangerouslySetInnerHTML={{ __html: message.ai_response }}></p>
                </div>
            </div>
            ))}
            
            {loading && (
              <div className="ai-message">
              <img src={assets.gemini_icon} alt="" />
                <div className="loader">
                  <div className="inner one"></div>
                  <div className="inner two"></div>
                  <div className="inner three"></div>
                </div>
              </div>
              )}
          </div>
        )}

        <div className="main-bottom">
          <div className="search-box">
            <input 
              onChange={(e) => setInput(e.target.value)} 
              value={input} 
              type="text" 
              placeholder="Enter a prompt here" 
              onKeyDown={(e) => {
                if (e.key === 'Enter' && input) {
                  e.preventDefault();
                  onSent();
                }
              }} 
            />
            <div className="search-controls">
              <img 
                src={assets.gallery_icon} 
                alt="gallery" 
                onClick={handleGalleryClick}
                style={{ cursor: 'pointer' }}
                title={generatingImage ? "Generating..." : "Generate Image"}
                className={generatingImage ? 'generating' : ''}
              />
              <img 
                src={assets.mic_icon} 
                alt="mic" 
                onClick={handleMicClick}
                className={isListening ? 'listening' : ''}
                style={{ cursor: 'pointer' }}
                title="Voice Input"
              />
              {input ? (
                <img 
                  onClick={() => onSent()} 
                  src={assets.send_icon} 
                  alt="send" 
                  style={{ cursor: 'pointer' }} 
                  title="Send Message"
                />
              ) : null}
            </div>
          </div>



          <p className="bottom-info">
            Sahayak AI may display inaccurate info, so double-check its responses. Your privacy is protected.
          </p>
        </div>
      </div>

      <NameInputModal
        isOpen={showNameModal}
        onClose={() => setShowNameModal(false)}
        onNameSubmit={(name) => {
          setShowNameModal(false);
        }}
        initialName={user?.username || ''}
      />
    </div>
  );
};

export default Main;
