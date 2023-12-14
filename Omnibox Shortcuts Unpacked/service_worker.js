chrome.omnibox.setDefaultSuggestion({
    description: "Type the shortcut text to access the website"
});


// Function to retrive the shortcut pairs
function getShortcutPairs() {
    return new Promise((resolve) => {
        chrome.storage.local.get('keyValuePairs', function (result) {
            const shortcutPairs = result.keyValuePairs || {};
            resolve(shortcutPairs);
        });
    });
}


// Handles suggestion while typing in the omnibox
chrome.omnibox.onInputChanged.addListener(async function(text, suggest) {

  var shortcutPairs = await getShortcutPairs();
    
  const suggestions = [];

  for (const key in shortcutPairs) {
    if (key.includes(text) || text.includes(key) || key == text) {
      suggestions.push({
        content: shortcutPairs[key],
        description: key + " - " +shortcutPairs[key]
      });
    }
  }

  suggest(suggestions);
});


// Handles navigating to the mapped URL
chrome.omnibox.onInputEntered.addListener(async function(shortcut) {

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
        // Incase there is the presence of a path or URL parameters in the shortcut text

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
