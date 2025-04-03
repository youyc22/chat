// api-client.js
// Handles API communication and model-specific configurations

import { API_CONFIG, SYSTEM_MESSAGE } from './config.js';
import { showApiKeyModal } from './api-key-manager.js';
import { displayMessage, formatMessage } from './message-display.js';
import { conversationHistory } from './conversation.js';
import { scrollToBottom } from './ui-utils.js';

// Helper function to get API key storage key and endpoint based on model
export function getApiKeyStorageKeyAndEndpoint(selectedModel) {
    let provider = 'deepseek'; // Default provider
    
    if (selectedModel.startsWith('qwen') || selectedModel.startsWith('qwq')) {
        provider = 'qwen';
    } else if (selectedModel.startsWith('deepseek')) {
        provider = 'deepseek';
    } else if (selectedModel.startsWith('hunyuan')) {
        provider = 'hunyuan';
    }
    
    return { 
        apiKeyStorageKey: API_CONFIG[provider].storageKey,
        endpoint: API_CONFIG[provider].endpoint
    };
}

// Get the model provider name (deepseek, qwen, hunyuan) from model string
export function getProviderFromModel(selectedModel) {
    if (selectedModel.startsWith('qwen') || selectedModel.startsWith('qwq')) {
        return 'qwen';
    } else if (selectedModel.startsWith('deepseek')) {
        return 'deepseek';
    } else if (selectedModel.startsWith('hunyuan')) {
        return 'hunyuan';
    }
    return 'deepseek'; // Default
}

// Get provider display name
export function getProviderDisplayName(provider) {
    return API_CONFIG[provider].displayName;
}

// Get avatar path for a model
export function getAvatarPath(provider) {
    return API_CONFIG[provider].avatarPath;
}

// Main function to send a message to the API
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

    if (!apiKey) {
        // If no API key, save current message and display input modal
        window.pendingMessage = message;
        showApiKeyModal();
        return;
    }

    // If not a forced message, clear input box
    if (!forcedMessage) {
        inputElement.value = '';
    }

    // Display user message
    displayMessage('user', message);

    // Update conversation history
    conversationHistory.push({ role: 'user', content: message });

    // Show loading animation
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = 'block';
    }

    // Prepare API request messages array
    const messages = [
        SYSTEM_MESSAGE,
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
    let botResponseMessage = ''; // For accumulating the complete bot reply

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
                                // Ensure final scroll to bottom
                                setTimeout(() => scrollToBottom(messagesContainer), 100);
                                // Add the complete bot reply to conversation history
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
                // Invalid API key handling
                const selectedModel = document.getElementById('model-selector').value;
                const { apiKeyStorageKey } = getApiKeyStorageKeyAndEndpoint(selectedModel);
                localStorage.removeItem(apiKeyStorageKey);
                contentElement.innerHTML = formatMessage('API Key无效，请重新输入');
                window.pendingMessage = message;
                showApiKeyModal();
            } else {
                // Other error handling
                contentElement.innerHTML = formatMessage('出错了，请稍后再试。错误信息: ' + error.message);
            }
            console.error('Error:', error);
        });
}