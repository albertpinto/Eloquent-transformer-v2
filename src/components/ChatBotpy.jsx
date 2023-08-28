import React, { useState } from 'react';

const ChatBotNew = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSend = async () => {
    if (inputValue.trim() !== '') {
      //setMessages([...messages, { text: inputValue, type: 'user' }]);
      const sTask="lc_tools" 
      const url= `http://127.0.0.1:5000/${sTask}?query=${inputValue}`;  
      console.log(url)
      const response= await fetch(url); 
      const botResponse = await response.json();
      console.log(botResponse);
      //const botResponse = await llm.predict(inputValue);
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

export default ChatBotNew;