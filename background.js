// background.js

const KEY_IS_ENABLED = 'reErrorIsGloballyEnabled'; // Use a unique key

function updateBrowserActionState() {
    browser.storage.local.get(KEY_IS_ENABLED).then(result => {
        const isEnabled = !!result[KEY_IS_ENABLED];
        if (isEnabled) {
            browser.browserAction.setIcon({
                path: {
                    "16": "icons/re-error-enabled-16.png",
                    "32": "icons/re-error-enabled-32.png"
                }
            });
            browser.browserAction.setTitle({ title: "RE-Error (Enabled)" });
        } else {
            browser.browserAction.setIcon({
                path: {
                    "16": "icons/re-error-disabled-16.png",
                    "32": "icons/re-error-disabled-32.png"
                }
            });
            browser.browserAction.setTitle({ title: "RE-Error (Disabled)" });
        }
    }).catch(error => {
        console.error("RE-Error: Error getting stored state in background:", error);
    });
}

updateBrowserActionState();

browser.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'local' && changes[KEY_IS_ENABLED]) {
        updateBrowserActionState();
        notifyContentScripts(changes[KEY_IS_ENABLED].newValue);
    }
});

function notifyContentScripts(isEnabled) {
    browser.tabs.query({}).then(tabs => {
        for (let tab of tabs) {
            if (tab.id && tab.url && (tab.url.startsWith('http:') || tab.url.startsWith('https:'))) {
                browser.tabs.sendMessage(tab.id, {
                    command: "reErrorUpdateState", // Use a unique command
                    isEnabled: isEnabled
                }).catch(error => {
                    // console.log(`RE-Error: Could not send message to tab ${tab.id}: ${error.message}`);
                });
            }
        }
    }).catch(error => {
        console.error("RE-Error: Error querying tabs:", error);
    });
}

browser.runtime.onInstalled.addListener(async (details) => {
    if (details.reason === "install") {
        await browser.storage.local.set({ [KEY_IS_ENABLED]: false });
        updateBrowserActionState();
        console.log("RE-Error installed. Defaulting to disabled.");
    }
});