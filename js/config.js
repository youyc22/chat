// config.js
// Configuration and model settings

/**
 * Get API key storage key and endpoint based on selected model
 * @param {string} selectedModel - The selected model name
 * @returns {Object} - Object containing apiKeyStorageKey and endpoint
 */
export function getApiKeyStorageKeyAndEndpoint(selectedModel) {
    let apiKeyStorageKey = 'apiKey_deepseek';
    let endpoint = 'https://api.deepseek.com/chat/completions'; // Default to deepseek

    if (selectedModel.startsWith('qwen') || selectedModel.startsWith('qwq')) {
        apiKeyStorageKey = 'apiKey_qwen';
        endpoint = 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions';
    } else if (selectedModel.startsWith('deepseek')) {
        apiKeyStorageKey = 'apiKey_deepseek';
        endpoint = 'https://api.deepseek.com/chat/completions';
    } else if (selectedModel.startsWith('hunyuan')) {
        apiKeyStorageKey = 'apiKey_hunyuan';
        endpoint = 'https://api.hunyuan.cloud.tencent.com/v1/chat/completions';
    }

    return { apiKeyStorageKey, endpoint };
}

/**
 * Get model avatar based on selected model
 * @param {string} selectedModel - The selected model name
 * @returns {string} - Path to avatar image
 */
export function getModelAvatar(selectedModel) {
    if (selectedModel.startsWith('qwen') || selectedModel.startsWith('qwq')) {
        return 'images/qwen.png';
    } else if (selectedModel.startsWith('deepseek')) {
        return 'images/deepseek.png';
    } else if (selectedModel.startsWith('hunyuan')) {
        return 'images/hunyuan.png';
    }
    
    // Default
    return 'images/deepseek.png';
}

// System prompt used for all conversations
export const SYSTEM_PROMPT = "You are a helpful assistant.";