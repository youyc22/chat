// 格式化消息文本
function formatMessage(text) {
    if (!text) return '';
    
    // 处理标题和换行
    let lines = text.split('\n');
    let formattedLines = lines.map(line => {
        // 处理标题（**文本**）
        line = line.replace(/\*\*(.*?)\*\*/g, '<span class="bold-text">$1</span>');
        return line;
    });
    
    // 将 ### 替换为换行，并确保每个部分都是一个段落
    let processedText = formattedLines.join('\n');
    let sections = processedText
        .split('###')
        .filter(section => section.trim())
        .map(section => {
            // 移除多余的换行和空格
            let lines = section.split('\n').filter(line => line.trim());
            
            if (lines.length === 0) return '';
            
            // 处理每个部分
            let result = '';
            let currentIndex = 0;
            
            while (currentIndex < lines.length) {
                let line = lines[currentIndex].trim();
                
                // 如果是数字开头（如 "1.")
                if (/^\d+\./.test(line)) {
                    result += `<p class="section-title">${line}</p>`;
                }
                // 如果是小标题（以破折号开头）
                else if (line.startsWith('-')) {
                    result += `<p class="subsection"><span class="bold-text">${line.replace(/^-/, '').trim()}</span></p>`;
                }
                // 如果是正文（包含冒号的行）
                else if (line.includes(':')) {
                    let [subtitle, content] = line.split(':').map(part => part.trim());
                    result += `<p><span class="subtitle">${subtitle}</span>: ${content}</p>`;
                }
                // 普通文本
                else {
                    result += `<p>${line}</p>`;
                }
                currentIndex++;
            }
            return result;
        });
    
    return sections.join('');
}

// 显示消息
function displayMessage(role, message) {
    const messagesContainer = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${role}`;
    
    const avatar = document.createElement('img');
    avatar.src = role === 'user' ? 'yyc.png' : 'saki1.jpg';
    avatar.alt = role === 'user' ? 'User' : 'Bot';

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    // 用户消息直接显示，机器人消息需要格式化
    messageContent.innerHTML = role === 'user' ? message : formatMessage(message);

    messageElement.appendChild(avatar);
    messageElement.appendChild(messageContent);
    messagesContainer.appendChild(messageElement);
    
    // 平滑滚动到底部
    messageElement.scrollIntoView({ behavior: 'smooth' });
}

function sendMessage() {
    const inputElement = document.getElementById('chat-input');
    const modelSelector = document.getElementById('model-selector');
    const message = inputElement.value;
    const selectedModel = modelSelector.value;
    
    if (!message.trim()) return;

    displayMessage('user', message);
    inputElement.value = '';

    // Show loading animation
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
        loadingElement.style.display = 'block';
    }

    const apiKey = 'sk-0456c3e480af4d24ac6ab2f688fa7515';
    const endpoint = 'https://api.deepseek.com/chat/completions';

    const payload = {
        model: selectedModel,
        messages: [
            { role: "system", content: "You are a helpful assistant" },
            { role: "user", content: message }
        ],
        stream: true
    };

    // Create temporary elements for streaming content
    const messagesContainer = document.getElementById('messages');
    const messageElement = document.createElement('div');
    messageElement.className = 'message bot';
    
    const avatar = document.createElement('img');
    avatar.src = 'bot-avatar.png';
    avatar.alt = 'Bot';

    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    // Create separate elements for reasoning and final content
    const reasoningElement = document.createElement('div');
    reasoningElement.className = 'reasoning-content';
    const contentElement = document.createElement('div');
    contentElement.className = 'final-content';

    messageContent.appendChild(reasoningElement);
    messageContent.appendChild(contentElement);
    messageElement.appendChild(avatar);
    messageElement.appendChild(messageContent);
    messagesContainer.appendChild(messageElement);

    let reasoningContent = '';
    let finalContent = '';

    fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload)
    })
    .then(response => {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        return new ReadableStream({
            start(controller) {
                function push() {
                    reader.read().then(({done, value}) => {
                        if (done) {
                            controller.close();
                            return;
                        }

                        const chunk = decoder.decode(value);
                        const lines = chunk.split('\n');
                        
                        lines.forEach(line => {
                            if (line.startsWith('data: ')) {
                                try {
                                    const data = JSON.parse(line.slice(6));
                                    if (data.choices && data.choices.length > 0) {
                                        const delta = data.choices[0].delta;
                                        
                                        if (delta.reasoning_content) {
                                            reasoningContent += delta.reasoning_content;
                                            reasoningElement.innerHTML = formatMessage(reasoningContent);
                                        } else if (delta.content) {
                                            finalContent += delta.content;
                                            contentElement.innerHTML = formatMessage(finalContent);
                                        }
                                    }
                                } catch (e) {
                                    console.error('Error parsing chunk:', e);
                                }
                            }
                        });

                        messageElement.scrollIntoView({ behavior: 'smooth' });
                        controller.enqueue(value);
                        push();
                    });
                }
                push();
            }
        });
    })
    .then(() => {
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    })
    .catch(error => {
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
        contentElement.innerHTML = formatMessage('出错了，请稍后再试。');
        console.error('Error:', error);
    });
}

// 添加主题切换功能
function toggleTheme() {
    document.body.classList.toggle('dark-mode');
    const chatContainer = document.querySelector('.chat-container');
    const messages = document.querySelector('.messages');
    
    // 同时切换容器的深色模式
    chatContainer.classList.toggle('dark-mode');
    messages.classList.toggle('dark-mode');
    
    // 保存主题设置
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
}

// 页面加载时检查主题设置
document.addEventListener('DOMContentLoaded', () => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        document.querySelector('.chat-container').classList.add('dark-mode');
        document.querySelector('.messages').classList.add('dark-mode');
    }
    
    // 保存选择的模型
    const savedModel = localStorage.getItem('selectedModel');
    if (savedModel) {
        document.getElementById('model-selector').value = savedModel;
    }
});

// 添加下拉菜单功能
function toggleDropdown(event) {
    event.preventDefault();
    document.getElementById('dropdownMenu').classList.toggle('show');
}

// 点击其他地方关闭下拉菜单
window.onclick = function(event) {
    if (!event.target.matches('.dropdown button')) {
        const dropdowns = document.getElementsByClassName('dropdown-content');
        for (const dropdown of dropdowns) {
            if (dropdown.classList.contains('show')) {
                dropdown.classList.remove('show');
            }
        }
    }
}

// 保存选择的模型
document.getElementById('model-selector').addEventListener('change', function(event) {
    localStorage.setItem('selectedModel', event.target.value);
});

// 添加回车发送功能
document.getElementById('chat-input').addEventListener('keypress', function(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
});