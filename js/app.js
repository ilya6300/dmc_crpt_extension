const exActive = document.querySelector("#ex-active");
const hostBD = document.querySelector("#hostBD");
const body = document.querySelector("body");

chrome.storage.sync.get(["active"], (result) => {
  exActive.checked = result.active;
  console.log(exActive.checked);
  if (result.active) {
    chrome.action.setBadgeText({ text: "ON" });
    // const extensionEnable = async () => {
    //   let [tab] = await chrome.tabs.query({
    //     active: true,
    //     currentWindow: true,
    //   });
    //   chrome.scripting.executeScript({
    //     target: { tabId: tab.id, allFrames: true },
    //     files: ["start_content.js"],
    //   });
    // };
    // extensionEnable();
  }
  // if (exActive.checked) {

  // }
});
chrome.storage.sync.get(["host"], (result) => {
  console.log(result.host);
  if (result.host) {
    console.log("ok!");
    const labelHost = document.createElement("label");
    labelHost.textContent = result.host;
    labelHost.onclick = () => {
      const inputHost = document.createElement("input");
      inputHost.placeholder = "Введите адрес БД";
      labelHost.remove();
      body.append(inputHost);
    };
    body.append(labelHost);
  } else {
    const inputHost = document.createElement("input");
    inputHost.placeholder = "Введите адрес БД";
    body.append(inputHost);
    inputHost.onchange = () => {
      console.log(inputHost.value);
      chrome.storage.sync.set({ ["host"]: inputHost.value });
    };
  }
});

if (exActive) {
  exActive.onclick = async (e) => {
    const checked = e.target.checked;
    console.log(checked);
    chrome.action.setBadgeText({ text: checked ? "ON" : "" });
    chrome.storage.sync.set({ ["active"]: checked });
    // if (checked) {
    //   extensionEnable();
    // }
  };
}

// const extensionEnable = async () => {
//   let [tab] = await chrome.tabs.query({
//     active: true,
//     currentWindow: true,
//   });
//   chrome.scripting.executeScript({
//     target: { tabId: tab.id, allFrames: true },
//     files: ["start_content.js"],
//   });
// };
// extensionEnable();

// скрипт запуска нажатия на кнопку
// injection.addEventListener("click", async () => {
//   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//   chrome.scripting.executeScript({
//     target: { tabId: tab.id, allFrames: true },
//     files: ["start_content.js"],
//   });
// });
