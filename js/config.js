// config.js
// Configuration constants and settings for the application

// API endpoints and storage keys for different models
const API_CONFIG = {
    deepseek: {
        endpoint: 'https://api.deepseek.com/chat/completions',
        storageKey: 'apiKey_deepseek',
        avatarPath: 'images/deepseek.png',
        displayName: 'Deepseek'
    },
    qwen: {
        endpoint: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
        storageKey: 'apiKey_qwen',
        avatarPath: 'images/qwen.png',
        displayName: 'Qwen'
    },
    hunyuan: {
        endpoint: 'https://api.hunyuan.cloud.tencent.com/v1/chat/completions',
        storageKey: 'apiKey_hunyuan',
        avatarPath: 'images/hunyuan.png',
        displayName: 'Hunyuan'
    }
};

// System message to be included in all conversations
const SYSTEM_MESSAGE = { role: "system", content: "You are a helpful assistant." };

// Settings for UI
const UI_CONFIG = {
    darkModeStorageKey: 'darkMode',
    selectedModelStorageKey: 'selectedModel',
    defaultModel: 'deepseek-chat'
};

// Export the configurations
export { API_CONFIG, SYSTEM_MESSAGE, UI_CONFIG };