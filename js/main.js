// main.js
// Entry point for the application, sets up event listeners and initializes the app

import { UI_CONFIG } from './config.js';
import { sendMessage, updateApiKeyStatus } from './api-client.js';
import { 
    showApiKeyManager, 
    hideApiKeyManager,
    showApiKeyModal,
    hideApiKeyModal,
    toggleKeyVisibility,
    toggleApiKeyVisibility,
    submitApiKey,
    updateApiKey,
    removeApiKey,
    updateAllApiKeyStatuses
} from './api-key-manager.js';
import { saveConversation, clearConversation } from './conversation.js';
import { 
    toggleTheme, 
    scrollToBottom, 
    loadThemeSettings,
    setupClickOutsideHandler
} from './ui-utils.js';

// 立即暴露所有需要的函数到全局作用域
// 这样HTML中的内联onclick事件可以调用这些函数
window.sendMessage = sendMessage;
window.showApiKeyManager = showApiKeyManager;
window.hideApiKeyManager = hideApiKeyManager;
window.showApiKeyModal = showApiKeyModal;
window.hideApiKeyModal = hideApiKeyModal;
window.toggleTheme = toggleTheme;
window.saveConversation = saveConversation;
window.clearConversation = clearConversation;
window.updateApiKey = updateApiKey;
window.removeApiKey = removeApiKey;
window.toggleKeyVisibility = toggleKeyVisibility;
window.toggleApiKeyVisibility = toggleApiKeyVisibility;
window.submitApiKey = submitApiKey;

// 处理模型变更
window.handleModelChange = function(value) {
    localStorage.setItem(UI_CONFIG.selectedModelStorageKey, value);
    updateApiKeyStatus();
};

// Set up document-ready event handler
document.addEventListener('DOMContentLoaded', () => {
    initializeApplication();
    console.log("应用程序已初始化，全局函数已注册到window对象");
});

// Initialize the application
function initializeApplication() {
    // Load saved settings
    loadSavedSettings();
    
    // Initialize UI state
    initializeUIState();
    
    // 设置点击模态框外部关闭
    setupClickOutsideHandler();
}

// Load settings from localStorage
function loadSavedSettings() {
    // Load theme settings
    loadThemeSettings();
    
    // Load saved model selection
    const savedModel = localStorage.getItem(UI_CONFIG.selectedModelStorageKey);
    if (savedModel) {
        document.getElementById('model-selector').value = savedModel;
    }
}

// Initialize UI state
function initializeUIState() {
    // Update API key status indicators
    updateAllApiKeyStatuses();
    
    // Initial scroll to bottom
    const messagesContainer = document.querySelector('.messages');
    if (messagesContainer) {
        scrollToBottom(messagesContainer, false);
    }
}