let host = "";
chrome.storage.sync.get(["host"], (result) => {
  host = result.host;
});

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  console.log("app.js", host);
  console.log("message", message);
  console.log("sender", sender);
  try {
    const res = await fetch(
      `http://${host}:8025/api/v2/dm/dm?dm_id=${encodeURIComponent(message.dm)}`
    );

    const dm = await res.json();
    console.log("dm ===> ", await dm);
    let [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    chrome.tabs.sendMessage(tab.id, await dm);
  } catch (e) {
    console.error("err => ", e);
  }
});
