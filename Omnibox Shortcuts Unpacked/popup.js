document.addEventListener('DOMContentLoaded', function () {
    loadKeyValuePairs();
  
    const addButton = document.getElementById('addButton');
    addButton.addEventListener('click', addKeyValuePair);
  
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
  

  // Function to load the shortcuts
  function loadKeyValuePairs() {
    chrome.storage.local.get('keyValuePairs', function (result) {
      const keyValuePairs = result.keyValuePairs || {};
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
    const value = valueInput.value.trim();
  
    if (key && value && isAlphaNumeric(key)) {
        if (value.includes('://')) {
            chrome.storage.local.get('keyValuePairs', function (result) {
                const keyValuePairs = result.keyValuePairs || {};
        
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
            });
        } else {
            alert("Please do not forget to add protocol name (https://, ftp://, etc)")
        }
    } else {
      alert('Invalid key (should be alphanumeric) or empty value!');
    }
  }
  
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
    const link = document.createElement('a');
    link.className = "url_link";
    link.href = value;

    // Set the link text content
    link.textContent = value;

    // Append the link to valueCell
    valueCell.appendChild(link);
  
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
  
  function deleteKeyValuePair(keyToDelete) {
    chrome.storage.local.get('keyValuePairs', function (result) {
      const keyValuePairs = result.keyValuePairs || {};
      delete keyValuePairs[keyToDelete];
  
      chrome.storage.local.set({ 'keyValuePairs': keyValuePairs });
    });
  }
  