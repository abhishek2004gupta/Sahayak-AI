import React from 'react';
import './ModelSelector.css';

const ModelSelector = ({ selectedModel, onModelChange, tinyllamaInfo, geminiInfo }) => {
  return (
    <div className="model-selector">
      <label>AI Model:</label>
      <div className="model-options">
        <button
          className={`model-option ${selectedModel === 'tinyllama' ? 'active' : ''}`}
          onClick={() => onModelChange('tinyllama')}
          title={tinyllamaInfo.isAvailable ? 'TinyLlama (Default)' : 'TinyLlama (Not Available)'}
          disabled={!tinyllamaInfo.isAvailable}
        >
          <span className="model-name">TinyLlama</span>
          <span className="model-status">
            {tinyllamaInfo.isAvailable ? '✓' : '✗'}
          </span>
        </button>
        
        <button
          className={`model-option ${selectedModel === 'gemini' ? 'active' : ''}`}
          onClick={() => onModelChange('gemini')}
          title={geminiInfo.isAvailable ? 'Gemini 1.5 Flash' : 'Gemini (Not Available)'}
          disabled={!geminiInfo.isAvailable}
        >
          <span className="model-name">Gemini</span>
          <span className="model-status">
            {geminiInfo.isAvailable ? '✓' : '✗'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default ModelSelector; 