import React, { useState, useEffect, useRef } from 'react';
import { Moon, Sun, Send, Settings } from 'lucide-react';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedModel, setSelectedModel] = useState('deepseek-chat');
  const [showSettings, setShowSettings] = useState(false);
  const [currentReasoning, setCurrentReasoning] = useState('');
  const [currentResponse, setCurrentResponse] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setIsDarkMode(savedDarkMode);
    scrollToBottom();
  }, [messages]);

  const formatMessage = (text) => {
    if (!text) return '';
    
    // Handle bold text
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Handle sections
    const sections = text.split('###').filter(section => section.trim());
    
    return sections.map(section => {
      const lines = section.split('\n').filter(line => line.trim());
      return lines.map(line => {
        if (/^\d+\./.test(line)) {
          return `<p class="text-lg font-semibold mb-2">${line}</p>`;
        } else if (line.startsWith('-')) {
          return `<p class="mb-2 font-medium">${line.replace(/^-/, '')}</p>`;
        } else if (line.includes(':')) {
          const [subtitle, content] = line.split(':');
          return `<p class="mb-2"><span class="font-medium">${subtitle}:</span>${content}</p>`;
        }
        return `<p class="mb-2">${line}</p>`;
      }).join('');
    }).join('');
  };

  const processStreamResponse = async (reader) => {
    let reasoningContent = '';
    let content = '';
    
    try {
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        // Convert the chunk to text and parse it
        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());
        
        for (const line of lines) {
          if (!line.startsWith('data:')) continue;
          
          try {
            const jsonData = JSON.parse(line.slice(5));
            const delta = jsonData.choices[0].delta;
            
            if (delta.reasoning_content) {
              reasoningContent += delta.reasoning_content;
              setCurrentReasoning(reasoningContent);
            } else if (delta.content) {
              content += delta.content;
              setCurrentResponse(content);
            }
          } catch (e) {
            console.error('Error parsing chunk:', e);
          }
        }
      }
      
      return { reasoningContent, content };
    } catch (error) {
      console.error('Error processing stream:', error);
      throw error;
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage = { role: 'user', content: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setCurrentReasoning('');
    setCurrentResponse('');

    try {
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk-0456c3e480af4d24ac6ab2f688fa7515'
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            { role: "system", content: "You are a helpful assistant" },
            ...messages,
            userMessage
          ],
          stream: true
        })
      });

      const { reasoningContent, content } = await processStreamResponse(response.body.getReader());
      
      // After streaming is complete, add the final response to messages
      setMessages(prev => [
        ...prev,
        { 
          role: 'assistant', 
          content: content,
          reasoning: reasoningContent 
        }
      ]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '发生错误，请稍后重试。'
      }]);
    } finally {
      setIsLoading(false);
      setCurrentReasoning('');
      setCurrentResponse('');
    }
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem('darkMode', newMode);
  };

  return (
    <div className={`flex flex-col h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <div className={`flex justify-between items-center p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
        <h1 className="text-xl font-bold">DeepSeek Chat</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={toggleDarkMode}
            className={`p-2 rounded-full ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className={`p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-b`}>
          <div className="flex items-center gap-4">
            <span className="font-medium">模型选择：</span>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className={`p-2 rounded ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'} border`}
            >
              <option value="deepseek-chat">DeepSeek Chat</option>
              <option value="deepseek-reasoner">DeepSeek Reasoner</option>
            </select>
          </div>
        </div>
      )}

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-3xl rounded-lg p-4 ${
                message.role === 'user'
                  ? `${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white`
                  : `${isDarkMode ? 'bg-gray-800' : 'bg-white'} ${isDarkMode ? 'text-white' : 'text-gray-900'}`
              } shadow`}
            >
              <div dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }} />
              {message.reasoning && (
                <div className="mt-2 pt-2 border-t border-gray-600">
                  <p className="text-sm text-gray-400">推理过程：</p>
                  <div className="text-sm text-gray-300" dangerouslySetInnerHTML={{ __html: formatMessage(message.reasoning) }} />
                </div>
              )}
            </div>
          </div>
        ))}
        
        {/* Streaming Response */}
        {(currentReasoning || currentResponse) && (
          <div className="flex justify-start">
            <div className={`max-w-3xl rounded-lg p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} ${isDarkMode ? 'text-white' : 'text-gray-900'} shadow`}>
              {currentReasoning && (
                <div className="mb-2">
                  <p className="text-sm text-gray-400">推理中...</p>
                  <div className="text-sm text-gray-300">{currentReasoning}</div>
                </div>
              )}
              {currentResponse && <div>{currentResponse}</div>}
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className={`p-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border-t`}>
        <div className="flex items-center gap-4 max-w-4xl mx-auto">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="输入消息..."
            className={`flex-1 p-3 rounded-lg resize-none ${
              isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            rows="1"
          />
          <button
            onClick={handleSend}
            disabled={isLoading}
            className={`p-3 rounded-lg ${
              isDarkMode ? 'bg-blue-600' : 'bg-blue-500'
            } text-white hover:opacity-90 disabled:opacity-50 transition-opacity`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;