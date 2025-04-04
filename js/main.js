// main.js
// Main application file that initializes everything

import { sendMessage, saveConversation } from './api.js';
import { updateApiKeyStatus, showApiKeyManager, hideApiKeyManager, showApiKeyModal, hideApiKeyModal, submitApiKey, toggleKeyVisibility, toggleApiKeyVisibility, updateAllApiKeyStatuses, updateApiKey, removeApiKey } from './apiKeyManager.js';
import { scrollToBottom } from './messages.js';
import { toggleTheme, initTheme } from './theme.js';
import { initTextareaResize } from './textarea-resize.js';

// Make functions available globally
window.sendMessage = sendMessage;
window.saveConversation = saveConversation;
window.showApiKeyManager = showApiKeyManager;
window.hideApiKeyManager = hideApiKeyManager;
window.showApiKeyModal = showApiKeyModal;
window.hideApiKeyModal = hideApiKeyModal;
window.submitApiKey = submitApiKey;
window.toggleKeyVisibility = toggleKeyVisibility;
window.toggleApiKeyVisibility = toggleApiKeyVisibility;
window.updateApiKey = updateApiKey;
window.removeApiKey = removeApiKey;
window.toggleTheme = toggleTheme;

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    // Initialize message container scrolling
    const messagesContainer = document.querySelector('.messages');
    if (messagesContainer) {
        scrollToBottom(messagesContainer, false);
    }

    // Initialize API key status
    updateApiKeyStatus();
    
    // Initialize theme
    initTheme();
    
    // Initialize textarea auto-resize
    initTextareaResize();
    
    // Load saved model from localStorage
    const savedModel = localStorage.getItem('selectedModel');
    if (savedModel) {
        document.getElementById('model-selector').value = savedModel;
    }

    // Set up event listeners
    setupEventListeners();
});

/**
 * Set up all event listeners
 */
function setupEventListeners() {
    // API Key modal close when clicking outside
    window.onclick = function(event) {
        const apiKeyModal = document.getElementById('apiKeyModal');
        const apiKeyManager = document.getElementById('apiKeyManager');
        const dropdowns = document.getElementsByClassName('dropdown-content');
        
        // Close API key manager when clicking outside
        if (event.target === apiKeyManager) {
            hideApiKeyManager();
        }
        
        // Close API key modal when clicking outside
        if (event.target === apiKeyModal) {
            hideApiKeyModal();
        }
        
        // Close dropdown menu when clicking elsewhere
        if (!event.target.matches('.dropdown button')) {
            for (const dropdown of dropdowns) {
                if (dropdown.classList.contains('show')) {
                    dropdown.classList.remove('show');
                }
            }
        }
    };

    // Enter key in API key input
    document.getElementById('apiKeyInput').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            submitApiKey();
        }
    });

    // 注意：Enter键处理已经移动到textarea-resize.js中

    // Model selector change
    document.getElementById('model-selector').addEventListener('change', function(event) {
        localStorage.setItem('selectedModel', event.target.value);
        updateApiKeyStatus();
    });
}

/**
 * Toggle dropdown menu visibility
 * @param {Event} event - The event object
 */
window.toggleDropdown = function(event) {
    event.preventDefault();
    document.getElementById('dropdownMenu').classList.toggle('show');
};