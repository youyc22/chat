// apiKeyManager.js
// API key management functions

import { getApiKeyStorageKeyAndEndpoint } from './config.js';
import { sendMessage } from './api.js';

/**
 * Show the API key modal when user tries to send a message without a key
 */
export function showApiKeyModal() {
    const modal = document.getElementById('apiKeyModal');
    modal.style.display = 'flex';
    document.getElementById('apiKeyInput').focus();
}

/**
 * Hide the API key modal
 */
export function hideApiKeyModal() {
    const modal = document.getElementById('apiKeyModal');
    modal.style.display = 'none';
    document.getElementById('apiKeyInput').value = '';
}

/**
 * Submit the API key from the modal
 */
export function submitApiKey() {
    const apiKey = document.getElementById('apiKeyInput').value.trim();
    if (apiKey) {
        const selectedModel = document.getElementById('model-selector').value;
        const { apiKeyStorageKey } = getApiKeyStorageKeyAndEndpoint(selectedModel);
        localStorage.setItem(apiKeyStorageKey, apiKey);
        hideApiKeyModal();
        // If there was a pending message, send it now
        if (window.pendingMessage) {
            sendMessage(window.pendingMessage);
            window.pendingMessage = null;
        }
    }
}

/**
 * Show the API key manager modal
 */
export function showApiKeyManager() {
    const modal = document.getElementById('apiKeyManager');
    modal.style.display = 'flex';
    updateAllApiKeyStatuses();
}

/**
 * Hide the API key manager
 */
export function hideApiKeyManager() {
    const modal = document.getElementById('apiKeyManager');
    modal.style.display = 'none';
}

/**
 * Toggle visibility of API key field
 * @param {string} inputId - Input element ID
 * @param {string} iconId - Icon element ID
 */
export function toggleKeyVisibility(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);

    if (input.type === 'password') {
        input.type = 'text';
        icon.textContent = '👁️‍🗨️';
    } else {
        input.type = 'password';
        icon.textContent = '👁️';
    }
}

/**
 * Toggle visibility of API key in the modal
 */
export function toggleApiKeyVisibility() {
    const input = document.getElementById('apiKeyInput');
    const icon = document.getElementById('modalVisibilityIcon');

    if (input.type === 'password') {
        input.type = 'text';
        icon.textContent = '👁️‍🗨️';
    } else {
        input.type = 'password';
        icon.textContent = '👁️';
    }
}

/**
 * Update all API key status indicators
 */
export function updateAllApiKeyStatuses() {
    // Deepseek
    const deepseekKey = localStorage.getItem('apiKey_deepseek');
    const deepseekStatus = document.getElementById('deepseek-key-status');
    if (deepseekKey) {
        deepseekStatus.textContent = '已设置';
        deepseekStatus.style.color = '#28a745';
    } else {
        deepseekStatus.textContent = '未设置';
        deepseekStatus.style.color = '#dc3545';
    }
    
    // Qwen
    const qwenKey = localStorage.getItem('apiKey_qwen');
    const qwenStatus = document.getElementById('qwen-key-status');
    if (qwenKey) {
        qwenStatus.textContent = '已设置';
        qwenStatus.style.color = '#28a745';
    } else {
        qwenStatus.textContent = '未设置';
        qwenStatus.style.color = '#dc3545';
    }
    
    // Hunyuan
    const hunyuanKey = localStorage.getItem('apiKey_hunyuan');
    const hunyuanStatus = document.getElementById('hunyuan-key-status');
    if (hunyuanKey) {
        hunyuanStatus.textContent = '已设置';
        hunyuanStatus.style.color = '#28a745';
    } else {
        hunyuanStatus.textContent = '未设置';
        hunyuanStatus.style.color = '#dc3545';
    }
    
    // Update the main API key status button
    updateApiKeyStatus();
}

/**
 * Update the main API key status indicator
 */
export function updateApiKeyStatus() {
    const selectedModel = document.getElementById('model-selector').value;
    const { apiKeyStorageKey } = getApiKeyStorageKeyAndEndpoint(selectedModel);
    const apiKey = localStorage.getItem(apiKeyStorageKey);
    
    const statusElement = document.getElementById('apiKeyStatus');
    if (apiKey) {
        statusElement.textContent = '已设置';
        statusElement.style.color = '#28a745';
    } else {
        statusElement.textContent = '未设置';
        statusElement.style.color = '#dc3545';
    }
}

/**
 * Update a specific API key
 * @param {string} provider - The provider name ('deepseek', 'qwen', or 'hunyuan')
 */
export function updateApiKey(provider) {
    let inputId, storageKey;
    
    switch(provider) {
        case 'deepseek':
            inputId = 'deepseek-key-input';
            storageKey = 'apiKey_deepseek';
            break;
        case 'qwen':
            inputId = 'qwen-key-input';
            storageKey = 'apiKey_qwen';
            break;
        case 'hunyuan':
            inputId = 'hunyuan-key-input';
            storageKey = 'apiKey_hunyuan';
            break;
        default:
            return;
    }
    
    const input = document.getElementById(inputId);
    const apiKey = input.value.trim();
    
    if (apiKey) {
        localStorage.setItem(storageKey, apiKey);
        input.value = '';
        
        // Update status displays
        updateAllApiKeyStatuses();
        
        // Flash success message
        const statusId = `${provider}-key-status`;
        const statusElement = document.getElementById(statusId);
        const originalText = statusElement.textContent;
        const originalColor = statusElement.style.color;
        
        statusElement.textContent = '更新成功！';
        statusElement.style.color = '#28a745';
        
        setTimeout(() => {
            statusElement.textContent = '已设置';
            statusElement.style.color = '#28a745';
        }, 1000);
    } else {
        alert('请输入有效的 API Key');
    }
}

/**
 * Remove a specific API key
 * @param {string} provider - The provider name ('deepseek', 'qwen', or 'hunyuan')
 */
export function removeApiKey(provider) {
    let storageKey;
    
    switch(provider) {
        case 'deepseek':
            storageKey = 'apiKey_deepseek';
            break;
        case 'qwen':
            storageKey = 'apiKey_qwen';
            break;
        case 'hunyuan':
            storageKey = 'apiKey_hunyuan';
            break;
        default:
            return;
    }
    
    if (confirm(`确定要删除 ${provider.charAt(0).toUpperCase() + provider.slice(1)} API Key 吗？`)) {
        localStorage.removeItem(storageKey);
        
        // Clear the input field if it has content
        const inputId = `${provider}-key-input`;
        document.getElementById(inputId).value = '';
        
        // Update all status displays
        updateAllApiKeyStatuses();
        
        // Flash removed message
        const statusId = `${provider}-key-status`;
        const statusElement = document.getElementById(statusId);
        
        statusElement.textContent = '已删除';
        statusElement.style.color = '#dc3545';
    }
}