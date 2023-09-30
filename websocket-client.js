const ws_proto = window.location.protocol === "https:" ? "wss" : "ws";
const hostname = window.location.hostname === "" ? "localhost:3000" : window.location.hostname;
// highlight / unhighlight
const HighlightElement = Object.freeze({
    HTML: "table",
    GRAPHIC: "bar",
});
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

    switch (type) {
        case "row":
            break;
        case "column":
            break;
        case "cell":
            break;
        default:
            break;
    }

    console.log(HighlightElement.GRAPHIC + "-" + index);

    let typeItem;
    let barItem = document.getElementById(HighlightElement.GRAPHIC + "-" + index);
    let tableItem = document.getElementById(HighlightElement.HTML + "-" + index);
    var children = tableItem.children;

    const is_enabled = !!children[3].children[0].checked;
    const log = document.querySelector("#a11y-log");
    if (is_enabled) {
        const text = "row " + index + " has been unselected\n";
        console.log(text);
        log.innerHTML = text;
    } else {
        const text = "row " + index + " has been selected\n";
        console.log(text);
        log.innerHTML = text;
    }

    barItem.classList.toggle(ElementState.HIGHLIGHTED);
    for (var i = 0; i < children.length; i++) {
        var tableChild = children[i];
        tableChild.classList.toggle(ElementState.HIGHLIGHTED);
    }

    // toggle checkbox
    children[3].children[0].checked = !children[3].children[0].checked;
};

function highlightItem(index, highlight) {
    highlightSocket.send(`{"index": ${index}, "action": ${ElementState.HIGHLIGHTED}}`);
};
