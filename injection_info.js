chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  console.log("start_scripting.js");
  console.log("message", message);
  console.log("sender", sender);
  const _element = document.querySelector("#myRowCidContainerID");
  const infoDMCContainer = document.createElement("ul");
  infoDMCContainer.id = "infoDMCContainerID";
  const liTaksID = document.createElement("li");
  liTaksID.textContent = `Задание в DMC ${message.data.taskid}`;
  infoDMCContainer.append(liTaksID);
  _element.append(infoDMCContainer);
  //   _element.style.background = "red";
});
