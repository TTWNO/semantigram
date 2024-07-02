const ws_proto = window.location.protocol === "https:" ? "wss" : "ws";
const hostname = window.location.hostname === "" || "localhost" ? "localhost:3000" : window.location.hostname;
// highlight / unhighlight
const ElementState = Object.freeze({
    HIGHLIGHTED: "highlight",
    FOCUSED: "focus",
    NONE: "",
});
const Action = Object.freeze({
    HIGHLIGHT: "highlight",
    UNHIGHLIGHT: "unhighlight",
    FOCUS: "focus",
    UNFOCUS: "unfocus",
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
    } else if (action === Action.FOCUS) {
        const text = `${coordinates} have been focused\n`;
        console.log(text)
        log.innerHTML = text;
        highlightItems.forEach((item) => {
            item.classList.add(ElementState.FOCUSED);
        });
    } else if (action === Action.UNFOCUS) {
        const text = `${coordinates} have been unfocused\n`;
        console.log(text)
        log.innerHTML = text;
        highlightItems.forEach((item) => {
            item.classList.remove(ElementState.FOCUSED);
        });
    }
};
