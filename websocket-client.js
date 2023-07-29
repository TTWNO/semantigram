// message will be {'index': 0, 'action': 'highlight'}
const HighlightElement = Object.freeze({
    TABLE: "table",
    GRAPHBAR: "bar",
});
const fromTo = {'table': 'bar', 'bar': 'table'};
const websocketServer = "ws://localhost:3000/ws";

const highlightSocket = new WebSocket(
    websocketServer,
);

highlightSocket.onopen = (event) => {
    let username = (Math.random() + 1).toString(36).substring(7);
    // send message with username
    highlightSocket.send(username)
};
  
highlightSocket.onclose = (event) => {
    console.warn(event.data);
};

highlightSocket.onmessage = (event) => {
    console.log(event.data);
    const datas = JSON.parse(event.data);
    const index = datas["index"];

    console.log(HighlightElement.GRAPHBAR+"-"+index);
    let barItem = document.getElementById(HighlightElement.GRAPHBAR+"-"+index);
    let tableItem = document.getElementById(HighlightElement.TABLE+"-"+index);

    barItem.setAttribute("fill", "red");
    tableItem.setAttribute("style", "color: red;");
};

function highlightItem(index, highlight) {
    highlightSocket.send(`{"index": ${index}, "action": "highlight"}`.toString());    
};
