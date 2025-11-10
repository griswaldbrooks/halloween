// Keyboard Controller
// Maps keyboard shortcuts to action names

/**
 * Keyboard action mappings
 */
const KEYBOARD_ACTIONS = {
    'h': 'toggleControls',
    'f': 'toggleFullscreen',
    'r': 'resetSpiders',
    ' ': 'togglePause'
};

/**
 * Get action name for a keyboard key
 * @param {string} key - Key pressed
 * @returns {string|null} Action name or null if not mapped
 */
function getKeyboardAction(key) {
    const normalizedKey = key.toLowerCase();
    return KEYBOARD_ACTIONS[normalizedKey] || null;
}

/**
 * Get all keyboard shortcuts
 * @returns {Array<{key: string, action: string}>} Array of shortcut definitions
 */
function getAllShortcuts() {
    return Object.entries(KEYBOARD_ACTIONS).map(([key, action]) => ({
        key: key === ' ' ? 'Space' : key.toUpperCase(),
        action
    }));
}

// Node.js export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        KEYBOARD_ACTIONS,
        getKeyboardAction,
        getAllShortcuts
    };
}

// Browser export
if (typeof window !== 'undefined') {
    window.KeyboardController = {
        KEYBOARD_ACTIONS,
        getKeyboardAction,
        getAllShortcuts
    };
}
