// api.js
// API handling and communication

import { getApiKeyStorageKeyAndEndpoint } from './config.js';
import { displayMessage, scrollToBottom, formatMessage } from './messages.js';
import { showApiKeyModal } from './apiKeyManager.js';

// A global variable to hold the conversation history
export let conversationHistory = [];

/**
 * Send message to the API and handle streaming response
 * @param {string} forcedMessage - Optional message to use instead of input value
 */
export function sendMessage(forcedMessage = null) {
    // Get necessary DOM elements and user input
    const inputElement = document.getElementById('chat-input');
    const modelSelector = document.getElementById('model-selector');
    const message = forcedMessage || inputElement.value;
    const selectedModel = modelSelector.value;

    // Validate message is not empty
    if (!message.trim()) return;

    // Get API key and endpoint
    const { apiKeyStorageKey, endpoint } = getApiKeyStorageKeyAndEndpoint(selectedModel);
    const apiKey = localStorage.getItem(apiKeyStorageKey);

    // If no API key, save current message and show input modal
    if (!apiKey) {
        window.pendingMessage = message;
        showApiKeyModal();
        return;
    }

    // If not a forced message, clear input box
    if (!forcedMessage) {
        inputElement.value = '';
        // Reset textarea height to default (21px)
        inputElement.style.height = '21px';
    }

    // Display user message
    displayMessage('user', message);

    // Update conversationHistory
    conversationHistory.push({ role: 'user', content: message });

    // Show loading animation
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = 'block';
    }

    // Prepare API request messages array
    const messages = [
        { role: "system", content: "You are a helpful assistant." },
        ...conversationHistory
    ];

    // Create bot reply message container
    let botMessageContentElement = displayMessage('bot', ''); 
    const reasoningElement = document.createElement('div');
    reasoningElement.className = 'reasoning-content';
    const contentElement = document.createElement('div');
    contentElement.className = 'final-content';
    botMessageContentElement.appendChild(reasoningElement);
    botMessageContentElement.appendChild(contentElement);

    const messagesContainer = document.getElementById('messages');
    // Initial scroll to bottom
    scrollToBottom(messagesContainer, false);

    // Variables to store message content
    let reasoningContent = '';
    let finalContent = '';
    let botResponseMessage = ''; // For accumulating complete bot reply

    // Create debounced scroll function
    let scrollTimeout;
    const debouncedScroll = () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            scrollToBottom(messagesContainer);
        }, 100);
    };

    // Make API request
    fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({ model: selectedModel, messages: messages, stream: true })
    })
    .then(response => {
        // Check response status
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Create stream reader
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        // Handle streaming response
        return new ReadableStream({
            start(controller) {
                function push() {
                    reader.read().then(({ done, value }) => {
                        if (done) {
                            controller.close();
                            // Ensure one final scroll to bottom
                            setTimeout(() => scrollToBottom(messagesContainer), 100);
                            // Add bot's complete reply to conversationHistory
                            conversationHistory.push({ role: 'assistant', content: botResponseMessage });
                            return;
                        }

                        // Decode and process data chunks
                        const chunk = decoder.decode(value);
                        const lines = chunk.split('\n');

                        lines.forEach(line => {
                            if (line.startsWith('data: ')) {
                                try {
                                    const data = JSON.parse(line.slice(6));
                                    if (data.choices && data.choices.length > 0) {
                                        const delta = data.choices[0].delta;

                                        // Handle reasoning content
                                        if (delta.reasoning_content) {
                                            reasoningContent += delta.reasoning_content;
                                            reasoningElement.innerHTML = formatMessage(reasoningContent);
                                            debouncedScroll();
                                        }
                                        // Handle final content
                                        else if (delta.content) {
                                            finalContent += delta.content;
                                            botResponseMessage += delta.content; // Accumulate bot reply
                                            contentElement.innerHTML = formatMessage(finalContent);
                                            debouncedScroll();
                                        }
                                    }
                                } catch (e) {
                                    console.error('Error parsing chunk:', e);
                                }
                            }
                        });

                        controller.enqueue(value);
                        push();
                    });
                }
                push();
            }
        });
    })
    .then(() => {
        // Request complete, hide loading animation
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    })
    .catch(error => {
        // Error handling
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }

        if (error.message.includes('401')) {
            // Invalid API key
            const selectedModel = document.getElementById('model-selector').value;
            const { apiKeyStorageKey } = getApiKeyStorageKeyAndEndpoint(selectedModel);
            localStorage.removeItem(apiKeyStorageKey);
            contentElement.innerHTML = formatMessage('API Key无效，请重新输入');
            window.pendingMessage = message;
            showApiKeyModal();
        } else {
            // Other errors
            contentElement.innerHTML = formatMessage('出错了，请稍后再试。错误信息: ' + error.message);
        }
        console.error('Error:', error);
    });
}

/**
 * Save the current conversation to a text file
 */
export function saveConversation() {
    if (conversationHistory.length === 0) {
        alert('当前没有可保存的对话');
        return;
    }

    // Create conversation content
    let content = '聊天记录\n\n';
    content += `保存时间: ${new Date().toLocaleString('zh-CN')}\n`;
    content += `使用模型: ${document.getElementById('model-selector').value}\n\n`;
    content += '对话内容:\n';
    content += '----------------------------------------\n\n';

    conversationHistory.forEach((message) => {
        const role = message.role === 'user' ? '用户' : 'AI';
        content += `${role}:\n${message.content}\n\n`;
    });

    // Create Blob object
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    
    // Create download link
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `chat_history_${timestamp}.txt`;
    
    // Create download link and trigger download
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    
    // Add link to document and click
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}