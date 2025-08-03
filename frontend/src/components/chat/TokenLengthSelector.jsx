import React from 'react';
import { TOKEN_LENGTHS } from '../../services/ai/aiService';
import './TokenLengthSelector.css';

const TokenLengthSelector = ({ selectedLength, onLengthChange }) => {
  return (
    <div className="token-length-selector">
      <label htmlFor="token-length">Response Length:</label>
      <select
        id="token-length"
        value={selectedLength}
        onChange={(e) => onLengthChange(parseInt(e.target.value))}
        className="token-select"
      >
        {TOKEN_LENGTHS.map((length) => (
          <option key={length} value={length}>
            {length} tokens
          </option>
        ))}
      </select>
    </div>
  );
};

export default TokenLengthSelector; 