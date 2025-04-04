// theme.js
// Theme toggling functionality

/**
 * Toggle between light and dark theme
 */
export function toggleTheme() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    document.body.classList.toggle('dark-mode');
    document.querySelector('.chat-container').classList.toggle('dark-mode');
    document.querySelector('.messages').classList.toggle('dark-mode');
    document.querySelector('.settings-bar').classList.toggle('dark-mode');

    // Update checkbox state
    document.getElementById('themeToggle').checked = !isDarkMode;

    // Save theme setting
    localStorage.setItem('darkMode', !isDarkMode);
}

/**
 * Initialize theme based on saved preference
 */
export function initTheme() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
        document.querySelector('.chat-container').classList.add('dark-mode');
        document.querySelector('.messages').classList.add('dark-mode');
        document.querySelector('.settings-bar').classList.add('dark-mode');
        document.getElementById('themeToggle').checked = true;
    }
}