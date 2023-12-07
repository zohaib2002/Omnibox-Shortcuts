chrome.omnibox.setDefaultSuggestion({
    description: "Type the shortcut text to acces the website"
});

function getShortcutPairs() {
    return new Promise((resolve) => {
        chrome.storage.local.get('keyValuePairs', function (result) {
            const shortcutPairs = result.keyValuePairs || {};
            resolve(shortcutPairs);
        });
    });
}

chrome.omnibox.onInputEntered.addListener(async function(shortcut) {

    // Store this on some online server
    const shortcutPairs = await getShortcutPairs();

    index = shortcut.indexOf('/')

    if (index == -1) {

        if (shortcut in shortcutPairs) {
            chrome.tabs.update({ url: shortcutPairs[shortcut] });
        }
        else {
            chrome.tabs.update({ url: "https://www.google.com/search?q=" + shortcut });
        }

    } else {

        let siteName = shortcut.substring(0, index);
        let resource = shortcut.substring(index);

        if (siteName in shortcutPairs) {
            chrome.tabs.update({ url: shortcutPairs[siteName] + resource });
        }
        else {
            chrome.tabs.update({ url: "https://www.google.com/search?q=" + siteName });
        }

    }

});
