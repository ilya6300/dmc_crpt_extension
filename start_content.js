const body = document.querySelector("body");
const __crptBlue = "rgb(52, 116, 211)";
const __mainBlue = "#2196f3";
const __error = "#df2727";

let injection;
chrome.storage.sync.get(["active"], (result) => {
  console.log(result, result.active);
  if (result.active) {
    console.log(1);
    injection = true;
  } else {
    console.log(2);
    injection = false;
  }
});
const redesignPortal = body.querySelector("#redesign-portal");
redesignPortal.onmousemove = async (e) => {
  if (!injection) {
    return;
  }
  if (e.target.dataset.column === "cis") {
    const rowCidContainer = e.target;
    const rowCid = rowCidContainer.querySelector("div").querySelector("div");
    const elementCisID = rowCid.querySelectorAll("div")[0].querySelector("a");
    rowCid.id = "myRowCidContainerList";
    const checkCountRowCid = document.querySelectorAll(
      "#myRowCidContainerList"
    );
    // console.log("checkCountRowCid.length", checkCountRowCid.length);
    if (checkCountRowCid.length !== 1) {
      checkCountRowCid.forEach((row) => {
        // console.log("row", row);
        row.id = "";
      });
      rowCid.id = "myRowCidContainerList";
    }
    if (elementCisID.textContent !== "Код") {
      rowCidContainer.id = "myRowCidContainerID";
    }
    rowCidContainer.onmousemove = async () => {
      if (rowCidContainer.classList.contains("row_cis_id")) {
        return;
      }
      console.log("rowCidContainer.onmouseleave");
      rowCidContainer.classList.add("row_cis_id");
      console.log(elementCisID.textContent);
      const data = {
        dm: elementCisID.textContent,
        type: "getDM",
      };
      const btnCheckApi = await checkBtnDM(data);
      rowCidContainer.append(btnCheckApi);

      rowCidContainer.onmouseleave = () => {
        try {
          console.log("rowCidContainer.onmouseleave ID до", rowCidContainer.id);
          rowCidContainer.id = "";
          console.log(
            "rowCidContainer.onmouseleave ID после",
            rowCidContainer.id
          );

          rowCidContainer.classList.remove("row_cis_id");
          btnCheckApi.remove();
          const _elementInfo = document.querySelector("#infoDMCContainerID");
          if (rowCid !== null) {
            rowCid.style.height = "auto";
            rowCid.style.zIndex = "1";
            rowCid.style.boxShadow = "none";
            rowCid.style.borderRadius = "0";
            rowCid.style.background = "none";
            rowCid.style.position = "relative;";
            rowCid.style.width = "none";
            rowCid.id = "";
            if (_elementInfo !== null) {
              _elementInfo.remove();
            }
          }
        } catch (e) {
          console.error("error ===> rowCidContainer.onmouseleave", e);
        }
      };
    };
  }
};

const status_dm = [
  {
    name: "EMITTED",
    status: 10,
    info: "Эмитирован (Загружен из ЧЗ)",
    color: "rgb(240, 141, 27)",
  },
  {
    name: "PRINTED",
    status: 20,
    info: "Распечатан",
    color: "rgb(240, 141, 27)",
  },
  {
    name: "VERIFIED",
    status: 30,
    info: "Верифицирован (Сериализован)",
    color: "rgb(240, 141, 27)",
  },
  {
    name: "EXPORTED",
    status: 40,
    info: "Выгружен во внешнюю систему",
    color: "rgb(240, 141, 27)",
  },
  {
    name: "DISCARDED",
    status: 50,
    info: "Отбракован",
    color: __error,
  },
  {
    name: "APPLIED",
    status: 60,
    info: "Нанесён (Отчёт о нанесении принят ЧЗ)",
    color: "rgb(240, 141, 27)",
  },
  {
    name: "AGGREGATED",
    status: 70,
    info: "Код агрегирован",
    color: "rgb(0, 153, 51)",
  },
  {
    name: "INTRODUCED",
    status: 80,
    info: "Введён в оборот",
    color: "rgb(0, 153, 51)",
  },
  {
    name: "WRITTEN_OFF",
    status: 90,
    info: "Списан",
    color: "rgb(122, 129, 155)",
  },
  {
    name: "RETIRED",
    status: 100,
    info: "Выбыл",
    color: "rgb(122, 129, 155)",
  },
  {
    name: "DISAGGREGATION",
    status: 110,
    info: "Разагрегирован",
    color: "rgb(0, 153, 51)",
  },
];

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  try {
    console.log("start_scripting.js");
    console.log("message", message);
    console.log("sender", sender);
    // const _rowElement = document.querySelector("#myRowCidContainerID");
    const _element = document.querySelector("#myRowCidContainerList");
    const btnCheckApi = document.querySelector("#dmc_id_btn");
    btnCheckApi.remove();
    const infoDMCContainer = document.createElement("ul");
    infoDMCContainer.id = "infoDMCContainerID";
    infoDMCContainer.style.padding = "0";
    infoDMCContainer.style.margin = "15px 0";
    infoDMCContainer.style.lineHeight = "170%";
    infoDMCContainer.style.listStyle = "none";
    const liTitle = document.createElement("li");
    liTitle.textContent = `Справка из БД по коду - ${message.data.dm}`;
    // const liDM = document.createElement("li");
    // liDM.textContent = `КМ: ${message.data.dm}`;
    const liTaks = document.createElement("li");
    liTaks.textContent = `Номер задания в DMC: ${message.data.taskid}`;
    const liStatus = document.createElement("li");
    const searchStatus = status_dm.find(
      (s) => s.status === message.data.status
    );
    if (searchStatus) {
      const spanStatus = document.createElement("span");
      spanStatus.textContent = searchStatus.info;
      spanStatus.style.color = searchStatus.color;
      liStatus.innerHTML = `Статус в DMC: <span style="color: ${searchStatus.color}">${searchStatus.info}</span>`;
      // liStatus.innerHTML = `Статус в DMC ${spanStatus}`;
    }
    infoDMCContainer.append(liTitle, liTaks, liStatus);
    _element.append(infoDMCContainer);
    _element.style.height = "150px";
    _element.style.zIndex = "800";
    _element.style.position = "absolute";
    _element.style.width = "50%";
    _element.style.boxShadow = "0 0 6px 1px rgb(52, 116, 211)";
    _element.style.borderRadius = "12px";
    _element.style.background = "#f3f6f9";
    _element.style.padding = "5px 10px";
  } catch (e) {
    console.error(e);
  }
});

const checkBtnDM = async (data) => {
  const btn = document.createElement("span");
  btn.classList.add("btn_api_check");
  btn.textContent = "Проверить код в DMC";
  btn.id = "dmc_id_btn";
  btn.style.cursor = "pointer";
  btn.style.fontSize = "0.8rem;";
  btn.style.color = __crptBlue;
  btn.style.transition = "color 0.2s ease-in";

  btn.onclick = () => {
    chrome.runtime.sendMessage(data);
  };
  btn.onmouseover = () => {
    btn.style.color = __mainBlue;
  };
  btn.onmouseout = () => {
    btn.style.color = __crptBlue;
  };
  return btn;
};
