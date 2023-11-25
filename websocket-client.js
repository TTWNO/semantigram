const ws_proto = window.location.protocol === "https:" ? "wss" : "ws";
const hostname = window.location.hostname === "" ? "localhost:3000" : window.location.hostname;
// highlight / unhighlight
const ElementState = Object.freeze({
    HIGHLIGHTED: "highlight",
    HOVERED: "hovered",
    NONE: "",
});
const Action = Object.freeze({
    HIGHLIGHT: "highlight",
    UNHIGHLIGHT: "unhighlight",
})

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
    // table
    // {"position": {"type": "row", "data": [2]}, "action": "highlight"} // [null, 2]
    // {"position": {"type": "column", "data": [2]}, "action": "highlight"} // [2, null]
    // {"position": {"type": "cell", "data": [0,2]}, "action": "highlight"}

    // binary tree
    // {"position": {"type": "node", "data": [1]}, "action": "highlight"}
    // {"position": {"type": "link", "data": [1,2]}, "action": "highlight"}

    console.log(event.data);

    const datas = JSON.parse(event.data);
    const type = datas["position"]["type"];
    const coordinates = datas["position"]["data"]
    const action = datas["action"]

    console.log(type);
    console.log(coordinates);

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
          case "node":
              selector = `[data-id="${coordinates[0]}"]`;
              break;
          case "link":
              selector = `[data-parent-id="${coordinates[0]}"][data-id="${coordinates[1]}"]`
              break;
          default:
              break;
      }
      console.log(selector);
      highlightItems = document.querySelectorAll(selector);
      console.log(highlightItems);

    const log = document.querySelector("#a11y-log");
    if (action === Action.HIGHLIGHT) {
        const text = `${coordinates} have been selected\n`;
        console.log(text);
        log.innerHTML = text;
        highlightItems.forEach((item) => {
          item.classList.add(ElementState.HIGHLIGHTED);
          item.checked = true;
        });
    } else if (action === Action.UNHIGHLIGHT) {
        const text = `${coordinates} have been unselected\n`;
        console.log(text);
        log.innerHTML = text;
        highlightItems.forEach((item) => {
          item.classList.remove(ElementState.HIGHLIGHTED);
          item.checked = false;
        });
    }

};
