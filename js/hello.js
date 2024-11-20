const setSettingBD = document.querySelector("#setSettingBD");
const checkConnect = document.querySelector("#checkConnect");
const resultCheck = document.querySelector("#resultCheck");
const addresBD = document.querySelector("#addresBD");
const portBD = document.querySelector("#portBD");

setSettingBD.onclick = async () => {
  chrome.storage.sync.set({ ["port"]: portBD.value });
  chrome.storage.sync.set({ ["host"]: addresBD.value });
  chrome.runtime.reload();
};

let host;
chrome.storage.sync.get(["host"], (result) => {
  if (result.host !== undefined) {
    addresBD.value = result.host;
    console.log(result.host);
  }
});
let port;
chrome.storage.sync.get(["port"], (result) => {
  if (result.port !== undefined) {
    portBD.value = result.port;
    console.log(result.port);
  }
});

checkConnect.onclick = async () => {
  try {
    resultCheck.textContent = "Пытаемся установить связь с БД...";
    const res = await fetch(
      `http://${addresBD.value}:${portBD.value}/api/v2/dmc_db_version`,
      { signal: AbortSignal.timeout(2000) }
    );

    const result = await res.json();
    console.log(result);
    if (result.success) {
      resultCheck.textContent = `Связь с БД установлена. Версия БД: ${await result
        .data.response[0].db_version}`;
    } else {
      resultCheck.textContent = "Ошибка! Связь с БД не установлена!";
    }
  } catch (e) {
    resultCheck.textContent = "Ошибка! Связь с БД не установлена!";
    console.error("err", e);
  }
};
