let isWatching = false;
let searchTerm = "";
let notificationMessage = "Page Watcher detected text";
let checkInterval: number | null = null;

console.log("Content script loaded");

chrome.runtime.onMessage.addListener((message) => {
  console.log("Received message:", message);
  if (message.type === "START_WATCHING") {
    searchTerm = message.searchTerm;
    notificationMessage =
      message.notificationMessage || "Page Watcher detected text";
    isWatching = true;

    // Start checking every second
    checkInterval = window.setInterval(() => {
      console.log("Checking for text...");
      if (document.body.innerText.includes(searchTerm)) {
        console.log("Text found!");
        chrome.runtime.sendMessage({
          type: "TEXT_FOUND",
          notificationMessage:
            message.notificationMessage || "Page Watcher detected text",
        });
        console.log("Sending notification");

        // Update storage state to stopped
        chrome.runtime.sendMessage({
          type: "UPDATE_STATE",
          state: {
            isWatching: false,
            searchTerm: searchTerm,
            notificationMessage: message.notificationMessage || "Page Watcher detected text"
          }
        });

        console.log("Stopping checkInterval");
        // Stop checking once text is found
        if (checkInterval !== null) {
          clearInterval(checkInterval);
          checkInterval = null;
        }
        isWatching = false;
      }
    }, 1000);
  } else if (message.type === "STOP_WATCHING") {
    console.log("Stopping watching");
    isWatching = false;
    if (checkInterval !== null) {
      clearInterval(checkInterval);
      checkInterval = null;
    }
  }
});
