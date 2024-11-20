const exActive = document.querySelector("#ex-active");
const exConnect = document.querySelector("#exConnect");
const exActiveStyle = document.querySelector(".ex-active");
const exActiveStyleSpan = document.querySelector(".ex-active-span");
const body = document.querySelector(".container");

const myOrange = "rgb(240, 141, 27)";

if (exActive) {
  exActive.onclick = async (e) => {
    const checked = e.target.checked;
    if (checked) {
      const activeIcon = "/icons/dmc_icon_active-32.png";
      chrome.action.setIcon({ path: activeIcon });
      chrome.storage.sync.set({ ["active"]: checked });
      exActiveStyle.classList.add("ex-active-a");
      exActiveStyleSpan.classList.add("ex-active-span-a");
    } else {
      chrome.storage.sync.set({ ["active"]: checked });
      const noActiveIcon = "/icons/dmc_icon-32.png";
      chrome.action.setIcon({ path: noActiveIcon });
      exActiveStyleSpan.classList.remove("ex-active-span-a");
      exActiveStyleSpan.classList.remove("ex-active-span");
      exActiveStyleSpan.classList.add("ex-active-span-anim");
      exActiveStyle.classList.remove("ex-active-a");
    }
    let [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    chrome.tabs.sendMessage(tab.id, { type: "active", active: checked });
  };
}

chrome.storage.sync.get(["active"], async (result) => {
  console.log("app 0");
  exActive.checked = result.active;
  if (result.active) {
    const activeIcon = "/icons/dmc_icon_active-32.png";
    chrome.action.setIcon({ path: activeIcon });
    exActiveStyle.classList.add("ex-active-a");
    exActiveStyleSpan.classList.add("ex-active-span-a");
  } else {
    const noActiveIcon = "/icons/dmc_icon-32.png";
    chrome.action.setIcon({ path: noActiveIcon });
  }
});

chrome.storage.sync.get(["host"], async (result) => {
  const inputObj = async (func) => {
    const inputHost = document.createElement("input");
    inputHost.placeholder = "Введите адрес БД и нажмите Enter";
    inputHost.style.height = "22px";
    inputHost.style.width = "250px";
    inputHost.style.borderRadius = "6px";
    inputHost.style.background = "#ffffffc7";
    inputHost.style.border = "none";
    inputHost.onchange = () => {
      chrome.storage.sync.set({ ["host"]: inputHost.value });
      alert("Перезагрузите страницу, что бы изменения вступили в силу.");
      inputHost.remove();
      chrome.runtime.reload();
      func(inputObj, inputHost.value);
    };
    body.append(inputHost);
  };

  const labelObj = async (func, host) => {
    const labelHost = document.createElement("label");
    const spanHost = document.createElement("span");
    spanHost.style.color = myOrange;
    spanHost.textContent = host;
    labelHost.textContent = `IP-aдрес БД: `;
    labelHost.append(spanHost);

    labelHost.onclick = () => {
      func(labelObj);
      labelHost.remove();
    };
    body.append(labelHost);
  };
  if (result.host) {
    await labelObj(inputObj, result.host);
  } else {
    inputObj(labelObj);
  }
});

chrome.storage.sync.get(["port"], async (result) => {
  const inputObj = async (func) => {
    const inputPort = document.createElement("input");
    inputPort.placeholder = "Введите порт БД и нажмите Enter";
    inputPort.style.height = "22px";
    inputPort.style.width = "250px";
    inputPort.style.borderRadius = "6px";
    inputPort.style.background = "#ffffffc7";
    inputPort.style.border = "none";
    inputPort.onchange = () => {
      chrome.storage.sync.set({ ["port"]: inputPort.value });
      alert("Перезагрузите страницу, что бы изменения вступили в силу.");
      func(inputObj, inputPort.value);
      chrome.runtime.reload();
      inputPort.remove();
    };
    body.append(inputPort);
  };

  const labelObj = async (func, port) => {
    const labelPort = document.createElement("label");
    const spanPort = document.createElement("labspanel");
    spanPort.style.color = myOrange;
    spanPort.textContent = port;
    labelPort.textContent = `Порт БД: `;
    labelPort.append(spanPort);
    labelPort.onclick = () => {
      func(labelObj);
      setTimeout(() => {
        labelPort.remove();
      }, 200);
    };
    body.append(labelPort);
  };
  if (result.port) {
    await labelObj(inputObj, result.port);
  } else {
    inputObj(labelObj);
  }
});
let host;
let port;

exConnect.onclick = async () => {
  chrome.storage.sync.get(["host"], (result) => {
    host = result.host;
    console.log(result.host);
  });
  chrome.storage.sync.get(["port"], (result) => {
    port = result.port;
    console.log(result.port);
  });
  console.log(host, port);
  setTimeout(async () => {
    try {
      const res = await fetch(`http://${host}:${port}/api/v2/dmc_db_version`, {
        signal: AbortSignal.timeout(2000),
      });

      const result = await res.json();
      console.log(await result);
      if (result.success) {
        alert(
          `Связь с БД установлена. Версия БД: ${await result.data.response[0]
            .db_version}`
        );
        // } else {
        //   alert("Ошибка! Связь с БД не установлена!");
      }
      //
    } catch (e) {
      alert("Ошибка! Связь с БД не установлена!");
      console.error("err", e);
    }
  }, 500);
};
