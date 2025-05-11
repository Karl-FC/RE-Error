// content_scripts/reloader.js
console.log("RE-Error content script loaded.");

const STORAGE_KEY_IS_ENABLED = 'reErrorIsGloballyEnabled'; // Match background
let isExtensionEnabled = false;

function runOrStopReloader() {
    if (isExtensionEnabled) {
        console.log("RE-Error is NOW ENABLED for this page. (Logic to be implemented)");
        // TODO: Implement actual reloading logic here
    } else {
        console.log("RE-Error is NOW DISABLED for this page. (Stopping any timers/logic)");
        // TODO: Clear any existing timers or listeners if the reloader was active
    }
}

browser.storage.local.get(STORAGE_KEY_IS_ENABLED).then(result => {
    isExtensionEnabled = !!result[STORAGE_KEY_IS_ENABLED];
    runOrStopReloader();
});

browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.command === "reErrorUpdateState") { // Match background command
        isExtensionEnabled = message.isEnabled;
        console.log(`RE-Error content script received updateState: ${isExtensionEnabled}`);
        runOrStopReloader();
    }
});