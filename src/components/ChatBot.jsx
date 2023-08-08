import React, { useState } from 'react';
import { OpenAI } from "langchain/llms/openai";
import { ChatOpenAI } from "langchain/chat_models/openai" 
const OPENAI_API_KEY = "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";
const llm = new OpenAI({
    openAIApiKey: OPENAI_API_KEY,temperature: 0.9
  });

  const chat = new ChatOpenAI({
    openAIApiKey: OPENAI_API_KEY,temperature: 0,llm:"gpt-4"
  }); 
 

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSend = async () => {
    if (inputValue.trim() !== '') {
      setMessages([...messages, { text: inputValue, type: 'user' }]);
      //const botResponse = inputValue.split('').reverse().join(''); // Simple logic for bot's response.
      //const botResponse = await llm.predict(inputValue);
      const botResponse = await chat.predict(inputValue);
// "Feetful of Fun"
      setTimeout(() => {
        setMessages([...messages, { text: inputValue, type: 'user' }, { text: botResponse, type: 'bot' }]);
      }, 1000);
      setInputValue('');
    }
  };

  const handleClear = async () => {
    setMessages([]);
    setInputValue('');

  }

  return (
    <div className="w-auto h-96 border border-gray-300 flex flex-col justify-between">
      <div className="p-4 overflow-y-auto">
        {messages.map((message, index) => (
          <div key={index} className={`mb-2 p-2 rounded ${message.type === 'user' ? 'bg-gray-200 ml-auto' : 'bg-cyan-500 shadow-lg shadow-cyan-500/50'}`}>
            {message.text}
          </div>
        ))}
      </div>
      <div className="flex p-4 border-t border-gray-300">
        <input
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Type your message..."
          className="flex-1 p-2 border border-gray-400 rounded mr-2"
        />
        <button onClick={handleClear} className="px-4 py-1 bg-cyan-500 shadow-lg shadow-cyan-500/50 rounded-full">
          Clear
        </button>
        <button onClick={handleSend} className="px-4 py-1 bg-cyan-500 shadow-lg shadow-cyan-500/50 rounded-full">
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBot;