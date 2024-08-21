import React, { useState } from 'react';
import { searchVersesWithAI } from '../functions/services/aiService';

export function SearchVerses() {
  const [searchTerm, setSearchTerm] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async () => {
    setIsLoading(true);
    try {
      const aiResult = await searchVersesWithAI(searchTerm);
      setResult(aiResult);
    } catch (error) {
      console.error('Error searching verses:', error);
      setResult('An error occurred while searching. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <input 
        type="text" 
        value={searchTerm} 
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search verses or topics..."
      />
      <button onClick={handleSearch} disabled={isLoading}>
        {isLoading ? 'Searching...' : 'Search'}
      </button>
      {result && (
        <div>
          <h3>AI Insights:</h3>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}