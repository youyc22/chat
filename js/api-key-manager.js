// api-key-manager.js
// Handles API key management, storage, and modal displays

import { API_CONFIG } from './config.js';
import { getApiKeyStorageKeyAndEndpoint, getProviderFromModel, getProviderDisplayName, sendMessage } from './api-client.js';

// Display the API key management modal
export function showApiKeyManager() {
    const modal = document.getElementById('apiKeyManager');
    modal.style.display = 'flex';
    updateAllApiKeyStatuses();
}

// Hide the API key management modal
export function hideApiKeyManager() {
    const modal = document.getElementById('apiKeyManager');
    modal.style.display = 'none';
}

// Show the API key modal (when user tries to send a message without a key)
export function showApiKeyModal() {
    const modal = document.getElementById('apiKeyModal');
    modal.style.display = 'flex';
    
    // Update the model name in the message
    const selectedModel = document.getElementById('model-selector').value;
    const provider = getProviderFromModel(selectedModel);
    const modelDisplayName = getProviderDisplayName(provider);
    
    document.getElementById('apiKeyModelName').textContent = `请输入 ${modelDisplayName} API Key 以继续`;
    
    // Focus on the input field
    document.getElementById('apiKeyInput').focus();
}

// Hide the API key modal
export function hideApiKeyModal() {
    const modal = document.getElementById('apiKeyModal');
    modal.style.display = 'none';
    document.getElementById('apiKeyInput').value = '';
}

// Toggle visibility of the API key input in the management modal
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

// Toggle visibility of the API key input in the quick modal
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

// Submit the API key from the modal
export function submitApiKey() {
    const apiKey = document.getElementById('apiKeyInput').value.trim();
    if (apiKey) {
        // Get the appropriate storage key based on the selected model
        const selectedModel = document.getElementById('model-selector').value;
        const { apiKeyStorageKey } = getApiKeyStorageKeyAndEndpoint(selectedModel);
        
        // Save the API key
        localStorage.setItem(apiKeyStorageKey, apiKey);
        hideApiKeyModal();
        
        // If there was a pending message, send it now
        if (window.pendingMessage) {
            sendMessage(window.pendingMessage);
            window.pendingMessage = null;
        }
        
        // Update API key status displays
        updateApiKeyStatus();
    } else {
        alert('请输入有效的 API Key');
    }
}

// Update status indicators for all API keys
export function updateAllApiKeyStatuses() {
    // Deepseek
    const deepseekKey = localStorage.getItem(API_CONFIG.deepseek.storageKey);
    const deepseekStatus = document.getElementById('deepseek-key-status');
    if (deepseekStatus) {
        if (deepseekKey) {
            deepseekStatus.textContent = '已设置';
            deepseekStatus.style.color = '#28a745';
        } else {
            deepseekStatus.textContent = '未设置';
            deepseekStatus.style.color = '#dc3545';
        }
    }
    
    // Qwen
    const qwenKey = localStorage.getItem(API_CONFIG.qwen.storageKey);
    const qwenStatus = document.getElementById('qwen-key-status');
    if (qwenStatus) {
        if (qwenKey) {
            qwenStatus.textContent = '已设置';
            qwenStatus.style.color = '#28a745';
        } else {
            qwenStatus.textContent = '未设置';
            qwenStatus.style.color = '#dc3545';
        }
    }
    
    // Hunyuan
    const hunyuanKey = localStorage.getItem(API_CONFIG.hunyuan.storageKey);
    const hunyuanStatus = document.getElementById('hunyuan-key-status');
    if (hunyuanStatus) {
        if (hunyuanKey) {
            hunyuanStatus.textContent = '已设置';
            hunyuanStatus.style.color = '#28a745';
        } else {
            hunyuanStatus.textContent = '未设置';
            hunyuanStatus.style.color = '#dc3545';
        }
    }
    
    // Update the main API key status button
    updateApiKeyStatus();
}

// Update a specific API key
export function updateApiKey(provider) {
    let inputId, storageKey;
    
    switch(provider) {
        case 'deepseek':
            inputId = 'deepseek-key-input';
            storageKey = API_CONFIG.deepseek.storageKey;
            break;
        case 'qwen':
            inputId = 'qwen-key-input';
            storageKey = API_CONFIG.qwen.storageKey;
            break;
        case 'hunyuan':
            inputId = 'hunyuan-key-input';
            storageKey = API_CONFIG.hunyuan.storageKey;
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

// Remove a specific API key
export function removeApiKey(provider) {
    let storageKey;
    
    switch(provider) {
        case 'deepseek':
            storageKey = API_CONFIG.deepseek.storageKey;
            break;
        case 'qwen':
            storageKey = API_CONFIG.qwen.storageKey;
            break;
        case 'hunyuan':
            storageKey = API_CONFIG.hunyuan.storageKey;
            break;
        default:
            return;
    }
    
    if (confirm(`确定要删除 ${getProviderDisplayName(provider)} API Key 吗？`)) {
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

// Update the main API key status button based on the currently selected model
export function updateApiKeyStatus() {
    const statusButton = document.getElementById('apiKeyStatus');
    if (!statusButton) return;
    
    const selectedModel = document.getElementById('model-selector').value;
    const { apiKeyStorageKey } = getApiKeyStorageKeyAndEndpoint(selectedModel);
    const apiKey = localStorage.getItem(apiKeyStorageKey);

    const provider = getProviderFromModel(selectedModel);
    const modelDisplayName = getProviderDisplayName(provider);
    
    if (apiKey) {
        statusButton.innerHTML = `<span class="key-icon">🔑</span> API Key ✓`;
        statusButton.classList.remove('key-missing');
        statusButton.classList.add('key-present');
    } else {
        statusButton.innerHTML = `<span class="key-icon">🔑</span> API Key ✗`;
        statusButton.classList.remove('key-present');
        statusButton.classList.add('key-missing');
    }
}