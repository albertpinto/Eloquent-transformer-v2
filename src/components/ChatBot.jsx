import React, { useEffect, useState, useRef } from 'react';
import { OpenAI} from "langchain/llms/openai";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { SerpAPI} from "langchain/tools";
// import { ChatOpenAI } from "langchain/chat_models/openai";
// import { initializeAgentExecutorWithOptions } from "langchain/agents";


const ChatBot = () => {

  

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const chainRef = useRef(null); // Step 1: Create a ref
  const initializeChat = async () => {
    const tools = [
      new SerpAPI(process.env.REACT_APP_SERPAPI_API_KEY, {
        location: "Austin,Texas,United States",
        hl: "en",
        gl: "us",
      })
    ];
    //console.log(tools)
    const llm = new OpenAI({
      openAIApiKey: process.env.REACT_APP_OPENAI_API_KEY, temperature: 0, llm: "gpt-4",tools: tools
    });
    // const chat = new ChatOpenAI({
    //   openAIApiKey: OPENAI_API_KEY,
    //   modelName: "gpt-4",
    //   temperature: 0,
    // });
    // const executor = await initializeAgentExecutorWithOptions(tools, chat, {
    //   agentType: "openai-functions",
    //   verbose: true,
    // });
    // const input ="What is the weather in New York?"
    // const result = await executor.run({input});
    // console.log("LangChain Agent:" + result);
    const memory = new BufferMemory();
    chainRef.current = new ConversationChain({ llm: llm, memory: memory }); // Step 2: Assign to the ref

    const response = await chainRef.current.call({ input: "Hi! I'm Albert. Your name is Jumbo" });
    const initialResponse =response.response
    setMessages([{ text: initialResponse, type: 'bot' }]);
  };

  useEffect(() => {
    initializeChat();
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  

  const handleSend = async () => {
    if (inputValue.trim() !== '') {
      //setMessages(prevMessages => [...prevMessages, { text: inputValue, type: 'user' }]);

      // Step 3: Update to use chainRef.current
      const botResponse = await chainRef.current.call({ input: inputValue });

      setTimeout(() => {
        setMessages(prevMessages => [...prevMessages, { text: inputValue, type: 'user' }, { text: botResponse.response, type: 'bot' }]);
      }, 1000);
      setInputValue('');
    }
  };

  const handleClear = () => {
    setMessages([]);
    setInputValue('');
    chainRef.current.memory.clear();
    initializeChat()
  };


  return (
    <div className="w-auto h-auto border border-gray-300 flex flex-col justify-between">
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
          onKeyDown={handleKeyDown} 
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
