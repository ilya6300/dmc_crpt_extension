const __crptBlue = "rgb(52, 116, 211)";
const __mainBlue = "#2196f3";
const __error = "#df2727";
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

window.onload = () => {
  const body = document.querySelector("body");
  let injection;
  chrome.storage.sync.get(["active"], (result) => {
    console.log('chrome.storage.sync.get(["active"]');
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
      const targetParent = e.target.parentElement;
      targetParent.parentElement.parentElement.style.maxHeight = "none";
      targetParent.parentElement.parentElement.style.minHeight = "80vh";
      // targetParent.parentElement.parentElement.style.background = "red";
      const rowCid = rowCidContainer.querySelector("div").querySelector("div");

      const elementCisID = rowCid.querySelectorAll("div")[0].querySelector("a");
      rowCid.id = "myRowCidContainerList";
      const checkCountRowCid = document.querySelectorAll(
        "#myRowCidContainerList"
      );
      if (checkCountRowCid.length !== 1) {
        checkCountRowCid.forEach((row) => {
          row.id = "";
        });
        rowCid.id = "myRowCidContainerList";
      }
      if (elementCisID.textContent !== "Код") {
        rowCidContainer.id = "myRowCidContainerID";
      }
      rowCidContainer.onmousemove = async () => {
        if (!injection) {
          return;
        }
        if (rowCidContainer.classList.contains("row_cis_id")) {
          return;
        }
        rowCidContainer.classList.add("row_cis_id");
        const data = {
          dm: elementCisID.textContent,
          type: "getDM",
        };

        const btnCheckApi = await checkBtnDM(data);
        rowCidContainer.append(btnCheckApi);

        rowCidContainer.onmouseleave = () => {
          if (!injection) {
            return;
          }
          try {
            btnCheckApi.remove();
            rowCidContainer.id = "";
            rowCidContainer.classList.remove("row_cis_id");
            const _elementInfo = document.querySelector("#infoDMCContainerID");
            if (rowCid !== null) {
              rowCid.style.height = "auto";
              rowCid.style.zIndex = "1";
              rowCid.style.boxShadow = "none";
              rowCid.style.borderRadius = "0";
              rowCid.style.background = "none";
              rowCid.style.position = "relative;";
              rowCid.style.width = "none";
              rowCid.style.padding = "0";
              rowCid.id = "";
              rowCid.style.zIndex = "1";
              rowCid.style.position = "relative";
              rowCid.style.padding = "none";
              rowCid.style.minWidth = "none";

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

  chrome.runtime.onMessage.addListener(
    async (message, sender, sendResponse) => {
      console.log("start_scripting.js");
      console.log("message", message, message.active);
      console.log("sender", sender);
      if (message.type === "active") {
        return (injection = message.active);
      }
      if (message.data.dm === undefined) {
        return alert("КМ не найдена в БД");
      }
      try {
        if (!injection) {
          return;
        }
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
        const liTaks = document.createElement("li");
        liTaks.textContent = `Номер задания в DMC: ${message.data.taskid}`;
        const liDateScan = document.createElement("li");

        liDateScan.textContent = `Дата сканирования в DMC: ${new Date(
          message.data.scandate
        ).toLocaleString()}`;
        const liStatus = document.createElement("li");
        const searchStatus = status_dm.find(
          (s) => s.status === message.data.status
        );
        if (searchStatus) {
          const spanStatus = document.createElement("span");
          spanStatus.textContent = searchStatus.info;
          spanStatus.style.color = searchStatus.color;
          liStatus.innerHTML = `Статус в DMC: <span style="color: ${searchStatus.color}">${searchStatus.info}</span>`;
        }
        infoDMCContainer.append(liTitle, liTaks, liStatus, liDateScan);
        if (message.data.aggregate !== "Не в агрегате") {
          message.data.aggregate.forEach((lvl) => {
            const containerAggr = document.createElement("ul");
            containerAggr.style.border = "1px solid #0000001f";
            containerAggr.style.borderRadius = "6px";
            containerAggr.style.listStyle = "none";
            containerAggr.style.margin = "10px 0";
            containerAggr.style.padding = "2px 5px";

            const liAggrCode = document.createElement("li");
            liAggrCode.textContent = `Код агрегата: ${lvl.unit_id}`;

            const liAggrLvl = document.createElement("li");
            liAggrLvl.textContent = `Уровень агрегата: ${lvl.level}`;

            const liAggrDate = document.createElement("li");
            liAggrDate.textContent = `Документ эмиссии агрегата: ${lvl.emission_date}`;
            const aggrStatus = document.createElement("li");
            const searchStatus = status_dm.find((s) => s.status === lvl.status);
            if (searchStatus) {
              const spanStatus = document.createElement("span");
              spanStatus.textContent = searchStatus.info;
              spanStatus.style.color = searchStatus.color;
              aggrStatus.innerHTML = `Статус в DMC: <span style="color: ${searchStatus.color}">${searchStatus.info}</span>`;
            }
            containerAggr.append(liAggrLvl, liAggrCode, liAggrDate, aggrStatus);
            infoDMCContainer.append(containerAggr);
          });
        } else {
          const liAggregate = document.createElement("li");
          liAggregate.textContent = `Код агрегата: ${message.data.aggregate}`;
          infoDMCContainer.append(liAggregate);
        }
        _element.style.zIndex = "800";
        _element.style.position = "absolute";
        _element.style.minWidth = "50vw";
        _element.style.boxShadow = "0 0 6px 1px rgb(52, 116, 211)";
        _element.style.borderRadius = "12px";
        _element.style.background = "#f3f6f9";
        _element.style.padding = "15px 30px";
        _element.append(infoDMCContainer);
      } catch (e) {
        console.error(e);
      }
    }
  );

  const checkBtnDM = async (data) => {
    if (!injection) {
      return;
    }
    const btn = document.createElement("span");
    btn.classList.add("btn_api_check");
    console.log(111);
    btn.textContent = "Проверить код в DMC";
    btn.id = "dmc_id_btn";
    btn.style.cursor = "pointer";
    btn.style.fontSize = "0.8rem;";
    btn.style.color = __crptBlue;
    btn.style.transition = "color 0.2s ease-in";
    console.log(222);
    btn.onclick = () => {
      console.log(injection);
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
};
