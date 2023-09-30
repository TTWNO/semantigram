const ws_proto = window.location.protocol === "https:" ? "wss" : "ws";
const hostname = window.location.hostname === "" ? "localhost:3000" : window.location.hostname;
// highlight / unhighlight
const ElementState = Object.freeze({
    HIGHLIGHTED: "highlight",
    HOVERED: "hovered",
    NONE: "",
});

const fromTo = { 'table': 'bar', 'bar': 'table' };
const websocketServer = ws_proto + "://" + hostname + "/ws";
console.log("Connect to ", websocketServer);

const highlightSocket = new WebSocket(
    websocketServer,
);

highlightSocket.onopen = (event) => {
    let username = (Math.random() + 1).toString(36).substring(7);
    // send message with username
    highlightSocket.send(username);
};

highlightSocket.onmessage = (event) => {
    // {"position": {"type": "row", "data": [2]}, "action": "highlight"} // [null, 2]
    // {"position": {"type": "column", "data": [2]}, "action": "highlight"} // [2, null]
    // {"position": {"type": "cell", "data": [0,2]}, "action": "highlight"}

    console.log(event.data);

    const datas = JSON.parse(event.data);
    const type = datas["position"]["type"];
    const coordinates = datas["position"]["data"]
    const action = datas["action"]

    let selector;
    let highlightItems;
    switch (type) {
        case "row":
              selector = `[data-row="${coordinates}"]`;
              break;
          case "column":
              selector = `[data-col="${coordinates}"]`;
              break;
          case "cell":
              selector = `[data-col="${coordinates[0]}"][data-row="${coordinates[1]}"], [data-col="${coordinates[0]}"].highlight:not([data-row]), [data-row="${coordinates[1]}"].highlight:not([data-col])`;
              break;
          default:
              break;
      }
      console.log(selector);
      highlightItems = document.querySelectorAll(selector);
      console.log(highlightItems);

    const log = document.querySelector("#a11y-log");
    if (action === "highlight") {
        const text = `${coordinates} have been selected\n`;
        console.log(text);
        log.innerHTML = text;
        highlightItems.forEach((item) => {
          item.classList.add(ElementState.HIGHLIGHTED);
        });
    } else if (action === "unhighlight") {
        const text = `${coordinates} have been unselected\n`;
        console.log(text);
        log.innerHTML = text;
        highlightItems.forEach((item) => {
          item.classList.remove(ElementState.HIGHLIGHTED);
        });
    }

};

function highlightItem(index, highlight) {
    highlightSocket.send(`{"index": ${index}, "action": ${ElementState.HIGHLIGHTED}}`);
};
