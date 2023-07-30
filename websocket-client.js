// message will be {'index': 0, 'action': 'highlight'}
const HighlightElement = Object.freeze({
    TABLE: "table",
    GRAPHBAR: "bar",
});
const fromTo = {'table': 'bar', 'bar': 'table'};
const websocketServer = "ws://a11y.tait.tech:3000/ws";

const highlightSocket = new WebSocket(
    websocketServer,
);

highlightSocket.onopen = (event) => {
    let username = (Math.random() + 1).toString(36).substring(7);
    // send message with username
    highlightSocket.send(username)
};

highlightSocket.onmessage = (event) => {
    console.log(event.data);
    const datas = JSON.parse(event.data);
    const index = datas["index"];

    console.log(HighlightElement.GRAPHBAR+"-"+index);
    let barItem = document.getElementById(HighlightElement.GRAPHBAR+"-"+index);
    let tableItem = document.getElementById(HighlightElement.TABLE+"-"+index);

    barItem.classList.toggle("highlight");
    var children = tableItem.children;
    for (var i = 0; i < children.length; i++) {
        var tableChild = children[i];
        tableChild.classList.toggle("highlight");
    }
		// toggle checkbox
		children[3].checked = !children[3].checked;
};

function highlightItem(index, highlight) {
    highlightSocket.send(`{"index": ${index}, "action": "highlight"}`);    
};
