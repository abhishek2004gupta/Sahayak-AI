import { createContext, useState, useEffect } from "react";
import apiService from "../services/api";
import imageGenerationService from "../services/ai/imageGenerationService";

export const Context = createContext();

const ContextProvider = (props) => {
  // Authentication state
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Chat state
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultData, setResultData] = useState("");
  const [selectedTokenLength, setSelectedTokenLength] = useState(500);
  
  // Model selection
  const [selectedModel, setSelectedModel] = useState('tinyllama'); // Default to TinyLlama
  const [currentChat, setCurrentChat] = useState(null);
  const [userChats, setUserChats] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);

  // Check authentication on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      
      if (token && userData) {
        const user = JSON.parse(userData);
        setUser(user);
          setIsAuthenticated(true);
        await loadUserChats();
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await apiService.login(username, password);
      setUser(response.user);
        setIsAuthenticated(true);
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('userData', JSON.stringify(response.user));
      await loadUserChats();
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  };

  const register = async (username, password, email) => {
    try {
      const response = await apiService.register(username, password, email);
      setUser(response.user);
      setIsAuthenticated(true);
      localStorage.setItem('authToken', response.token);
      localStorage.setItem('userData', JSON.stringify(response.user));
      await loadUserChats();
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    setCurrentChat(null);
    setUserChats([]);
    setChatMessages([]);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  };

  const loadUserChats = async () => {
    try {
      const chats = await apiService.getUserChats();
      setUserChats(chats);
    } catch (error) {
      console.error('Error loading chats:', error);
    }
  };

  const createNewChat = async () => {
    if (!user) return;
    
    try {
      const chat = await apiService.createChat();
      setCurrentChat(chat);
      setChatMessages([]);
      await loadUserChats();
      return chat;
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const loadChat = async (chatId) => {
    try {
      const messages = await apiService.getChatMessages(chatId);
      const chat = userChats.find(c => c.id === chatId);
      if (chat) {
      setCurrentChat(chat);
      setChatMessages(messages);
        setShowResult(true); // Show the chat interface
      }
    } catch (error) {
      console.error('Error loading chat:', error);
    }
  };

  const deleteChat = async (chatId) => {
    try {
      await apiService.deleteChat(chatId);
      await loadUserChats();
      if (currentChat && currentChat.id === chatId) {
        setCurrentChat(null);
        setChatMessages([]);
        setShowResult(false);
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  };

  const delayPara = (index, nextWord) => {
    setTimeout(function () {
      setResultData((prev) => prev + nextWord);
    }, 75 * index);
  };

  const newChat = () => {
    setLoading(false);
    setShowResult(false);
    createNewChat();
  };

  const getCurrentModel = () => {
    return selectedModel;
  };

  const onSent = async (prompt) => {
    if (!currentChat) {
      await createNewChat();
    }

    setLoading(true);
    setShowResult(true);
    
    let currentPrompt;
    
    if (prompt !== undefined) {
      currentPrompt = prompt;
    } else {
      setPrevPrompts((prev) => [...prev, input]);
      setRecentPrompt(input);
      currentPrompt = input;
    }

    try {
      const model = getCurrentModel();
      const result = await apiService.generateResponse(currentPrompt, selectedTokenLength, model);
      const response = result.response;

      // Format response with bold text and line breaks
      let responseArray = response.split("**");
      let newResponse = "";
      for (let i = 0; i < responseArray.length; i++) {
        if (i == 0 || i % 2 == 0) {
          newResponse += responseArray[i];
        } else {
          newResponse += "<b>" + responseArray[i] + "</b>";
        }
      }
      
      let formattedResponse = newResponse.split("*").join("</br>");
      
      // Save message to database
      if (currentChat) {
        await apiService.saveMessage(
          currentChat.id,
          currentPrompt,
          formattedResponse,
          selectedModel,
          selectedTokenLength
        );
        
        // Update chat title with first message if it's the first message
        if (chatMessages.length === 0) {
          const shortTitle = currentPrompt.length > 30 ? currentPrompt.substring(0, 30) + '...' : currentPrompt;
          await apiService.updateChatTitle(currentChat.id, shortTitle);
          // Reload user chats to update sidebar
          await loadUserChats();
        }
        
        await loadChat(currentChat.id);
      }
    } catch (error) {
      console.error('Error generating response:', error);
      alert("Sorry, I encountered an error. Please try again.");
    }
    
    setLoading(false);
    setInput("");
  };

  const generateImage = async (prompt) => {
    if (!currentChat) {
      await createNewChat();
    }

    try {
      const result = await imageGenerationService.generateImage(prompt);
      
      // Save image to database if we have a chat
      if (currentChat && result.url) {
        await apiService.saveGeneratedImage(currentChat.id, prompt, result.url);
        await loadChat(currentChat.id);
      }

      return result;
    } catch (error) {
      console.error('Error generating image:', error);
      throw new Error('Failed to generate image');
    }
  };

  const contextValue = {
    // Authentication
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    
    // Chat state
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat,
    
    // Model selection
    selectedTokenLength,
    setSelectedTokenLength,
    selectedModel,
    setSelectedModel,
    
    // Chat management
    currentChat,
    userChats,
    chatMessages,
    createNewChat,
    loadChat,
    deleteChat,
    
    // Image generation
    generateImage,
    
    // Model info
    tinyllamaInfo: { name: 'TinyLlama-1.1B-Chat-v1.0', isAvailable: true },
    geminiInfo: { name: 'Gemini 1.5 Flash', isAvailable: true }
  };

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  );
};

export default ContextProvider;