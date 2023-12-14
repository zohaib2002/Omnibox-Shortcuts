
var keyValuePairs;

document.addEventListener('DOMContentLoaded', function () {
  loadKeyValuePairs();

  const addButton = document.getElementById('addButton');
  addButton.addEventListener('click', addKeyValuePair);

  const importButton = document.getElementById('importButton');
  importButton.addEventListener('click', importShortcutsFromJSON);

  const exportButton = document.getElementById('exportButton');
  exportButton.addEventListener('click', exportShortcutsToJSON);

  const githubButton = document.getElementById('githubButton');
  githubButton.addEventListener('click', opnGithub);

  const keyInput = document.getElementById('keyInput');
  const valueInput = document.getElementById('valueInput');

  // Add event listener to handle Enter key press
  keyInput.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
      valueInput.focus();
    }
  });

  valueInput.addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
      addKeyValuePair();
    }
  });
});


// Function to open the github page
function opnGithub() {
  chrome.tabs.create({ url: "https://github.com/zohaib2002/Omnibox-Shortcuts" });
}


// Fumction to copy a given text into the clipboard
function copyToClipboard(text) {
  var textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}


// Function exports the enitre shortcuts map into the clipboard
function exportShortcutsToJSON() {
  var result = JSON.stringify(keyValuePairs);
  copyToClipboard(result);
  alert("Stringified JSON exported to Clipboard.");

}

// Function to import shortcuts from a JSON string
function importShortcutsFromJSON() {

  var jsonString = prompt("Paste the JSON String: ");

  if (jsonString) {
    
    try {
      var importedKeyValuePairs = JSON.parse(jsonString);

      for (const key in importedKeyValuePairs) {
        keyValuePairs[key] = importedKeyValuePairs[key];
      }

      chrome.storage.local.set({ 'keyValuePairs': keyValuePairs }, function() {
        alert("Shortcuts Imported Succesfully!");
        // Reload the popup
        window.close();
      });
    } catch (err) {
      alert("Import Failed");
      console.error(err);
    }

  } else {
    alert("Please paste a JSON string.")
  }

}


// Function to load the shortcuts and update the popup
function loadKeyValuePairs() {
  chrome.storage.local.get('keyValuePairs', function (result) {
    keyValuePairs = result.keyValuePairs || {};
    const table = document.getElementById('kvTable');

    Object.entries(keyValuePairs).forEach(([key, value]) => {
      appendRowToTable(table, key, value);
    });

  });
}


// Function to add a shortcut
function addKeyValuePair() {
  const keyInput = document.getElementById('keyInput');
  const valueInput = document.getElementById('valueInput');

  const key = keyInput.value.trim();
  let value = valueInput.value.trim();

  if (key && value && isAlphaNumeric(key)) {
    if (!value.includes('://')) {
        value = 'https://' + value;
    } 

    // Check if the key already exists
    if (key in keyValuePairs) {
      alert('Key already exists!');
      } else {
      keyValuePairs[key] = value

      chrome.storage.local.set({ 'keyValuePairs': keyValuePairs }, function () {
          const table = document.getElementById('kvTable');
          appendRowToTable(table, key, value);

          keyInput.value = '';
          valueInput.value = '';
          keyInput.focus();
      });
      }

  } else {
    alert('Key must be alphanumeric');
  }
}


// Regular expression to test if the string is alphanumeric
function isAlphaNumeric(str) {
  const regex = /^[a-zA-Z0-9]+$/;
  return regex.test(str);
}


// Function to add a row in the table with the shortcut and the URL
function appendRowToTable(table, key, value) {
  const row = table.insertRow(2);
  const keyCell = row.insertCell(0);
  const valueCell = row.insertCell(1);

  keyCell.textContent = key;
  // Create a link element
  const linkButton = document.createElement('button');
  linkButton.className = "url_link";

  // Set the link text content
  linkButton.textContent = value;

  linkButton.addEventListener('click', function () {
    chrome.tabs.create({ url: value });
  });

  // Append the link to valueCell
  valueCell.appendChild(linkButton);

  // Create and append the delete button
  const deleteButton = document.createElement('button');
  deleteButton.textContent = 'x';
  deleteButton.className = 'deleteButton';
  deleteButton.addEventListener('click', function () {
    deleteKeyValuePair(key);
    row.remove();
  });

  // Add delete button to the row
  const actionCell = row.insertCell(2);
  actionCell.appendChild(deleteButton);
}
  

// Function to delete a shortcut (only handles the keyValuePair object)
function deleteKeyValuePair(keyToDelete) {
  delete keyValuePairs[keyToDelete];
  chrome.storage.local.set({ 'keyValuePairs': keyValuePairs });
}
  