// chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
//   const errorGroundFunc = async () => {
//     let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
//     chrome.scripting.executeScript({
//       target: { tabId: tab.id, allFrames: true },
//       function: () => {
//         alert(
//           "Нет подключения к БД. Возможные причины: 1. Проверьте настройки подключения к в плагине. 2. Выключен сервер DMC. 3. У сервера DMC нет доступа к локальной сети. Если все пункты проверены, обратитесь в техническую поддержку МАСТ"
//         );
//       },
//     });
//   };
//   const okGroundFunc = async () => {
//     try {
//       let [tab] = await chrome.tabs.query({
//         active: true,
//         currentWindow: true,
//       });
//       chrome.scripting.executeScript({
//         target: { tabId: tab.id, allFrames: true },
//         function: async () => {
//           let result;
//           chrome.runtime.onMessage.addListener(function (request) {
//             console.log(request);
//             const infoDMCContainer = document.createElement("ul");
//             infoDMCContainer.id = "infoDMCContainerID";
//             const liTaksID = document.createElement("li");
//             console.log("result", result);
//             liTaksID.textContent = `Задание в DMC ${request.data.taskid}`;

//             infoDMCContainer.append(liTaksID);

//             // //
//             _element.append(infoDMCContainer);

//             _element.style.background = "red";
//           });
//         },
//       });
//     } catch (e) {
//       console.error(e);
//     }
//   };
//   console.log("background.js");
//   console.log("message", message);
//   console.log("sender", sender);
//   try {
//     const res = await fetch(
//       `http://10.76.10.102:8125/api/v2/dm/dm?dm_id=${encodeURIComponent(
//         message.dm
//       )}`
//     );
//     const dm = await res.json();
//     console.log("dm ===> ", await dm);

//     // sessionStorage.setItem("resultDMC", JSON.stringify(dm));
//     okGroundFunc();
//     setTimeout(async () => {
//       let [tab] = await chrome.tabs.query({
//         active: true,
//         currentWindow: true,
//       });
//       chrome.tabs.sendMessage(tab.id, await dm);
//     }, 1000);
//   } catch (e) {
//     console.error("err => ", e);
//     errorGroundFunc();
//   }
// });
