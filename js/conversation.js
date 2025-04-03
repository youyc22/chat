// conversation.js
// Handles conversation history and related functionality

// Global conversation history array
export let conversationHistory = [];

// Save the current conversation to a file
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
    
    // Create and trigger download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    
    // Add link to document and click
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
}

// Clear the conversation history
export function clearConversation() {
    if (conversationHistory.length === 0) {
        return;
    }
    
    if (confirm('确定要清空当前对话吗？')) {
        conversationHistory = [];
        const messagesContainer = document.getElementById('messages');
        messagesContainer.innerHTML = '';
    }
}