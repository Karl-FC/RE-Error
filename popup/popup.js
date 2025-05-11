// popup/popup.js
const toggleSwitch = document.getElementById('toggleEnabled');
const KEY_IS_ENABLED = 'reErrorIsGloballyEnabled'; // Use a unique key

// Load the current state when the popup opens
browser.storage.local.get(KEY_IS_ENABLED).then(result => {
    toggleSwitch.checked = !!result[KEY_IS_ENABLED];
});

// Save the state when the toggle changes
toggleSwitch.addEventListener('change', () => {
    const isEnabled = toggleSwitch.checked;
    browser.storage.local.set({ [KEY_IS_ENABLED]: isEnabled });
    updateBrowserAction(isEnabled);
});

function updateBrowserAction(isEnabled) {
    if (isEnabled) {
        browser.browserAction.setIcon({
            path: {
                "16": "../icons/re-error-enabled-16.png",
                "32": "../icons/re-error-enabled-32.png"
            }
        });
        browser.browserAction.setTitle({ title: "RE-Error (Enabled)" });
    } else {
        browser.browserAction.setIcon({
            path: {
                "16": "../icons/re-error-disabled-16.png",
                "32": "../icons/re-error-disabled-32.png"
            }
        });
        browser.browserAction.setTitle({ title: "RE-Error (Disabled)" });
    }
}

// Also set initial browser action on popup load
browser.storage.local.get(KEY_IS_ENABLED).then(result => {
    updateBrowserAction(!!result[KEY_IS_ENABLED]);
});