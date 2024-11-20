chrome.runtime.onInstalled.addListener(async (details) => {
  console.log(details);
  if (details.reason !== "update") {
    const url = chrome.runtime.getURL("html/hello.html");
    const tab = await chrome.tabs.create({ url });
  }
  chrome.storage.sync.set({ ["active"]: false });
});

let host = "";
chrome.storage.sync.get(["host"], (result) => {
  host = result.host;
});
let port = "";
chrome.storage.sync.get(["port"], (result) => {
  port = result.port;
});

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  console.log("app.js", host, port);
  console.log("message", message);
  console.log("sender", sender);
  try {
    const res = await fetch(
      `http://${host}:${port}/api/v2/dm/dm?dm_id=${encodeURIComponent(
        message.dm
      )}`
    );

    const dm = await res.json();
    console.log("dm ====> ", await dm);

    if (
      (await dm.data.aggregate) !== null &&
      (await dm.data.aggregate) !== "" &&
      (await dm.data.aggregate) !== undefined
    ) {
      console.log(dm.data.aggregate);
      const resAggr = await fetch(
        `http://${host}:${port}/api/v2/aggregate/unit_id?unit_id=${encodeURIComponent(
          dm.data.aggregate
        )}`
      );
      const dataAggr = await resAggr.json();
      const aggregate_group = [];
      aggregate_group.push({
        unit_id: dataAggr.data.unit_id,
        level: dataAggr.data.level,
        emission_date: new Date(dataAggr.data.emission_date).toLocaleString(),
        status: dataAggr.data.status,
      });
      if (
        dataAggr.data.parent_id !== null &&
        dataAggr.data.parent_id !== "" &&
        dataAggr.data.parent_id !== undefined
      ) {
        const parentAggr = await fetch(
          `http://${host}:${port}/api/v2/aggregate/unit_id?unit_id=${encodeURIComponent(
            dataAggr.data.parent_id
          )}`
        );
        const dataParent = await parentAggr.json();
        aggregate_group.push({
          unit_id: dataParent.data.unit_id,
          level: dataParent.data.level,
          emission_date: new Date(
            dataParent.data.emission_date
          ).toLocaleString(),
          status: dataParent.data.status,
        });
      }
      dm.data.aggregate = aggregate_group;
    } else {
      dm.data.aggregate = "Не в агрегате";
    }
    let [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    chrome.tabs.sendMessage(tab.id, await dm);
  } catch (e) {
    console.error("err => ", e);
  }
});
