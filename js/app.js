// const injection = document.querySelector("#injection");

// СЛУШАТЕЛЬ нажатия на кнопку проверить
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  console.log("app.js");
  console.log("message", message);
  console.log("sender", sender);

  // if (message.type === "getDM") {
  try {
    const testDM = {
      taskid: "1370101",
      dm: "010101010101",
      status: "10",
    };
    // const res = await fetch(`http://10.76.10.102:8125/api/v2/dm/dm?dm_id=${encodeURIComponent(message.dm)}`);

    // const dm = await res.json();
    // console.log("dm ===> ", await dm);
    console.log("testDM ==>", testDM);
    setTimeout(async () => {
      let [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });
      const data2 = {
        data: testDM,
        type: "injectionRow",
      };
      chrome.tabs.sendMessage(tab.id, data2);
      // chrome.runtime.sendMessage(data2);
    }, 1000);
  } catch (e) {
    console.error("err => ", e);
  }
  // }
  // if (message.type === "injectionRow") {
  //   console.log(" 22222 СЛУШАТЕЛЬ записи информации в строку ЦРПТ ===>", message);
  // }
});

// СЛУШАТЕЛЬ записи информации в строку ЦРПТ

// chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
//   console.log("СЛУШАТЕЛЬ записи информации в строку ЦРПТ ===>", message);
//   if (message.type !== "injectionRow") {
//     return;
//   }
//   console.log(" 22222 СЛУШАТЕЛЬ записи информации в строку ЦРПТ ===>", message);
//   //   // chrome.scripting.executeScript({
//   //   //   target: { tabId: tab.id, allFrames: true },
//   //   //   function: async () => {},
//   //   // });

//   //   // const _element = document.querySelector("#myRowCidContainerID");
//   //   // const infoDMCContainer = document.createElement("ul");
//   //   // infoDMCContainer.id = "infoDMCContainerID";
//   //   // const liTaksID = document.createElement("li");
//   //   // console.log("result", result);
//   //   // liTaksID.textContent = `Задание в DMC ${message.data.taskid}`;

//   //   // infoDMCContainer.append(liTaksID);

//   //   // // //
//   //   // _element.append(infoDMCContainer);

//   //   // _element.style.background = "red";
// });

//
// try {
//   let [tab] = await chrome.tabs.query({
//     active: true,
//     currentWindow: true,
//   });
//   chrome.scripting.executeScript({
//     target: { tabId: tab.id, allFrames: true },
//     function: async () => {
//       let result;
//       chrome.runtime.onMessage.addListener(function (request) {
//         console.log(request);
//         const _element = document.querySelector("#myRowCidContainerID");
//         const infoDMCContainer = document.createElement("ul");
//         infoDMCContainer.id = "infoDMCContainerID";
//         const liTaksID = document.createElement("li");
//         console.log("result", result);
//         liTaksID.textContent = `Задание в DMC ${request.data.taskid}`;

//         infoDMCContainer.append(liTaksID);

//         // //
//         _element.append(infoDMCContainer);

//         _element.style.background = "red";
//       });
//     },
//   });
// } catch (e) {
//   console.error(e);
// }
//

// скрипт запуска нажатия на кнопку
injection.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  chrome.scripting.executeScript({
    target: { tabId: tab.id, allFrames: true },
    files: ["start_content.js"],
  });
});
