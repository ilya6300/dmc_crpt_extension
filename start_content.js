// const head = document.querySelector("head");
const body = document.querySelector("body");
const __crptBlue = "rgb(52, 116, 211)";
const __mainBlue = "#2196f3";

const checkBtnDM = async (data) => {
  const btn = document.createElement("span");
  btn.classList.add("btn_api_check");
  btn.textContent = "Проверить марку";
  btn.id = "dmc_id_btn";
  btn.style.cursor = "pointer";
  btn.style.fontSize = "0.8rem;";
  btn.style.color = __crptBlue;
  btn.style.transition = "color 0.2s ease-in";

  btn.onclick = async () => {
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

const redesignPortal = body.querySelector("#redesign-portal");

redesignPortal.onmousemove = async (e) => {
  if (e.target.dataset.column === "cis") {
    const rowCidContainer = e.target;
    rowCidContainer.id = "myRowCidContainerID";
    const rowCid = rowCidContainer.querySelector("div").querySelector("div");
    const elementCisID = rowCid.querySelectorAll("div")[0].querySelector("a");
    // const elementCisID = rowCidContainer.querySelector("a");
    rowCidContainer.onmousemove = async () => {
      if (rowCidContainer.classList.contains("row_cis_id")) {
        return;
      }
      rowCidContainer.onmouseleave = () => {
        rowCidContainer.classList.remove("row_cis_id");
        btnCheckApi.remove();
        rowCidContainer.id = "";
        const _elementInfo = document.querySelector("#infoDMCContainerID");
        _elementInfo.remove();
      };

      rowCidContainer.classList.add("row_cis_id");
      console.log(elementCisID.textContent);
      const data = {
        dm: elementCisID.textContent,
        // element: rowCidContainer,
        type: "getDM",
      };
      const btnCheckApi = await checkBtnDM(data);
      rowCidContainer.append(btnCheckApi);
    };

    // console.log("thisElement", thisElement);
  }
};
