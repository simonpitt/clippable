// File: background.js
// This script runs in the background and handles the extension's logic.

// Create the context menu item when the extension is installed.
// It will only show up when text is selected.
chrome.runtime.onInstalled.addListener(createClippableMenuItem);
function createClippableMenuItem() {
  chrome.contextMenus.create({
    id: "sendToClippable",
    title: "Send to Clippable",
    contexts: ["selection"]
  });
}

// Add a listener for when the context menu item is clicked.
chrome.contextMenus.onClicked.addListener(handleClippableClick);
function handleClippableClick(info, tab) {
  // Check if the clicked item is our "Send to Clippable" menu item.
  if (info.menuItemId === "sendToClippable") {
    // Execute a script on the current page to get the selected text.
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: getSelectedText,
    }, handleScriptResult);
  }
}

// A function to be injected into the page to get the selected text.
function getSelectedText() {
  return window.getSelection().toString();
}

// The callback function that receives the result from the executed script.
function handleScriptResult(injectionResults) {
  // The result is an array, get the first element.
  const selectedText = injectionResults[0].result;

  if (selectedText) {
    // Encode the text to be safe in a URL.
    const encodedText = encodeURIComponent(selectedText);
    const url = `https://clippable-app.web.app/?clip=${encodedText}`;

    // Create a new tab with the Clippable URL.
    chrome.tabs.create({ url: url });
  } else {
    // Handle the case where no text was selected, although this is unlikely given the context.
    console.log("No text was selected.");
  }
}

// Recommended: Place icon files (icon16.png, icon48.png, icon128.png)
// in the same directory as these files.
