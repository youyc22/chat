// message-display.js
// Handles message formatting and display

import { getProviderFromModel, getAvatarPath } from './api-client.js';
import { scrollToBottom } from './ui-utils.js';

// Format message text with styling
export function formatMessage(text) {
    if (!text) return '';

    // Process titles and line breaks
    let lines = text.split('\n');
    let formattedLines = lines.map(line => {
        // Process titles (**text**)
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

                // If starts with number (like "1.")
                if (/^\d+\./.test(line)) {
                    result += `<p class="section-title">${line}</p>`;
                }
                // If is a subtitle (starts with dash)
                else if (line.startsWith('-')) {
                    result += `<p class="subsection"><span class="bold-text">${line.replace(/^-/, '').trim()}</span></p>`;
                }
                // If is body text (contains colon)
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

    return sections.join('');
}

// Display a message in the chat
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
            const provider = getProviderFromModel(selectedModel);
            avatar.src = getAvatarPath(provider);
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

    // User messages display directly, bot messages need formatting
    messageContent.innerHTML = role === 'user' ? message : formatMessage(message);

    // Smooth scroll to bottom
    messageElement.scrollIntoView({ behavior: 'smooth' });
    return messageContent; // Return messageContent for updating in streaming
}