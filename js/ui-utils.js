// ui-utils.js
// UI utility functions for the chat application

import { UI_CONFIG } from './config.js';

// Toggle between light and dark theme
export function toggleTheme() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    // Toggle dark mode on body and main elements
    document.body.classList.toggle('dark-mode');
    document.querySelector('.chat-container').classList.toggle('dark-mode');
    document.querySelector('.messages').classList.toggle('dark-mode');
    document.querySelector('.settings-bar').classList.toggle('dark-mode');

    // Update checkbox state
    document.getElementById('themeToggle').checked = !isDarkMode;

    // Save theme setting to localStorage
    localStorage.setItem(UI_CONFIG.darkModeStorageKey, !isDarkMode);
}

// Smooth scroll to the bottom of the container
export function scrollToBottom(element, smooth = true) {
    // Get the messages container
    const container = document.querySelector('.messages');
    if (!container) return;

    // Calculate scroll position
    const scrollTop = container.scrollHeight - container.clientHeight;

    // Use smooth scroll or instant scroll
    container.scrollTo({
        top: scrollTop,
        behavior: smooth ? 'smooth' : 'auto'
    });
}

// Load saved theme settings
export function loadThemeSettings() {
    const isDarkMode = localStorage.getItem(UI_CONFIG.darkModeStorageKey) === 'true';
    
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        document.querySelector('.chat-container').classList.add('dark-mode');
        document.querySelector('.messages').classList.add('dark-mode');
        document.querySelector('.settings-bar').classList.add('dark-mode');
        document.getElementById('themeToggle').checked = true;
    }
}

// Toggle dropdown menu visibility
export function toggleDropdown(event) {
    event.preventDefault();
    document.getElementById('dropdownMenu').classList.toggle('show');
}

// Close dropdowns when clicking outside
export function setupClickOutsideHandler() {
    window.onclick = function(event) {
        // Close dropdown menus
        if (!event.target.matches('.dropdown button')) {
            const dropdowns = document.getElementsByClassName('dropdown-content');
            for (const dropdown of dropdowns) {
                if (dropdown.classList.contains('show')) {
                    dropdown.classList.remove('show');
                }
            }
        }
        
        // Close modals when clicking outside
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    };
}