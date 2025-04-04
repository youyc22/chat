// messages.js
// Message formatting and display

import { getModelAvatar } from './config.js';

/**
 * Format message text with Markdown-like syntax, including code blocks
 * @param {string} text - The raw message text
 * @returns {string} - Formatted HTML
 */
export function formatMessage(text) {
    if (!text) return '';

    // 首先处理代码块 (```language code ```)
    let codeBlockRegex = /```([a-zA-Z]*)\n([\s\S]*?)\n```/g;
    let codeBlocks = [];
    let codeBlockIndex = 0;
    
    // 替换代码块为占位符，保存代码块内容
    text = text.replace(codeBlockRegex, (match, language, code) => {
        codeBlocks.push({
            language: language.trim().toLowerCase(),
            code: code
        });
        return `__CODE_BLOCK_${codeBlockIndex++}__`;
    });

    // 处理行内代码 (`code`)
    let inlineCodeRegex = /`([^`]+)`/g;
    let inlineCodes = [];
    let inlineCodeIndex = 0;
    
    text = text.replace(inlineCodeRegex, (match, code) => {
        inlineCodes.push(code);
        return `__INLINE_CODE_${inlineCodeIndex++}__`;
    });

    // Process titles and line breaks
    let lines = text.split('\n');
    let formattedLines = lines.map(line => {
        // Process bold text (**text**)
        line = line.replace(/\*\*(.*?)\*\*/g, '<span class="bold-text">$1</span>');
        return line;
    });

    // Replace ### with line breaks and ensure each section is a paragraph
    let processedText = formattedLines.join('\n');
    let sections = processedText
        .split('###')
        .filter(section => section.trim())
        .map(section => {
            // Remove excess line breaks and spaces
            let lines = section.split('\n').filter(line => line.trim());

            if (lines.length === 0) return '';

            // Process each section
            let result = '';
            let currentIndex = 0;

            while (currentIndex < lines.length) {
                let line = lines[currentIndex].trim();

                // 检查是否有代码块占位符
                if (line.startsWith('__CODE_BLOCK_')) {
                    // 不处理，会在最后统一替换
                    result += `<p>${line}</p>`;
                }
                // If it starts with a number (e.g. "1.")
                else if (/^\d+\./.test(line)) {
                    result += `<p class="section-title">${line}</p>`;
                }
                // If it's a subtitle (starts with dash)
                else if (line.startsWith('-')) {
                    result += `<p class="subsection"><span class="bold-text">${line.replace(/^-/, '').trim()}</span></p>`;
                }
                // If it's body text (line with colon)
                else if (line.includes(':')) {
                    let [subtitle, content] = line.split(':').map(part => part.trim());
                    result += `<p><span class="subtitle">${subtitle}</span>: ${content}</p>`;
                }
                // Regular text
                else {
                    result += `<p>${line}</p>`;
                }
                currentIndex++;
            }
            return result;
        });

    let formattedHtml = sections.join('');
    
    // 恢复代码块，使用格式化的HTML
    codeBlocks.forEach((block, index) => {
        const language = block.language || 'plaintext';
        const code = escapeHtml(block.code);
        const formattedCode = `
            <div class="code-block">
                <div class="code-header">
                    <span class="code-language">${language}</span>
                    <button class="copy-code-btn" onclick="copyCodeToClipboard(this)">复制</button>
                </div>
                <pre class="code-content language-${language}"><code>${code}</code></pre>
            </div>
        `;
        formattedHtml = formattedHtml.replace(`<p>__CODE_BLOCK_${index}__</p>`, formattedCode);
    });
    
    // 恢复行内代码
    inlineCodes.forEach((code, index) => {
        const escapedCode = escapeHtml(code);
        formattedHtml = formattedHtml.replace(`__INLINE_CODE_${index}__`, `<code class="inline-code">${escapedCode}</code>`);
    });

    return formattedHtml;
}

/**
 * 转义HTML特殊字符，防止XSS攻击
 * @param {string} text - 需要转义的文本
 * @returns {string} - 转义后的文本
 */
function escapeHtml(text) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/**
 * Display a message in the chat interface
 * @param {string} role - 'user' or 'bot'
 * @param {string} message - The message content
 * @param {HTMLElement} messageContentElement - Optional existing message element to update
 * @returns {HTMLElement} - The message content element
 */
export function displayMessage(role, message, messageContentElement = null) {
    const messagesContainer = document.getElementById('messages');
    let messageElement;
    let messageContent;

    if (!messageContentElement) {
        messageElement = document.createElement('div');
        messageElement.className = `message ${role}`;

        const avatar = document.createElement('img');
        if (role === 'user') {
            avatar.src = 'images/yyc.png'; // User avatar remains the same
        } else { // Bot avatar changes based on model
            const selectedModel = document.getElementById('model-selector').value;
            avatar.src = getModelAvatar(selectedModel);
        }

        messageContent = document.createElement('div');
        messageContent.className = 'message-content';

        messageElement.appendChild(avatar);
        messageElement.appendChild(messageContent);
        messagesContainer.appendChild(messageElement);
    } else {
        messageContent = messageContentElement;
        messageElement = messageContentElement.parentElement; // Get the parent message element
    }

    // User messages displayed directly, bot messages need formatting
    messageContent.innerHTML = role === 'user' ? message : formatMessage(message);

    // Smooth scroll to bottom
    messageElement.scrollIntoView({ behavior: 'smooth' });
    return messageContent; // Return messageContent for updating in streaming
}

/**
 * Scroll the messages container to the bottom
 * @param {HTMLElement} element - The element to scroll
 * @param {boolean} smooth - Whether to use smooth scrolling
 */
export function scrollToBottom(element, smooth = true) {
    // Get messages container
    const container = document.querySelector('.messages');
    if (!container) return;

    // Calculate needed scroll position
    const scrollTop = container.scrollHeight - container.clientHeight;

    // Use smooth or instant scrolling
    container.scrollTo({
        top: scrollTop,
        behavior: smooth ? 'smooth' : 'auto'
    });
}