const ws_proto = window.location.protocol === "https:" ? "wss" : "ws";
const hostname = window.location.hostname === "" ? "localhost" : window.location.hostname;
// message will be {'index': 0, 'action': 'highlight'}
const HighlightElement = Object.freeze({
    TABLE: "table",
    GRAPHBAR: "bar",
});
const fromTo = {'table': 'bar', 'bar': 'table'};
const websocketServer = ws_proto + "://" + hostname + ":3000/ws";
console.log("Connect to ", websocketServer);

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
    var children = tableItem.children;

		const is_enabled = !!children[3].children[0].checked;
		const log = document.querySelector("#a11y-log");
		if (is_enabled) {
			const text = "row " + index + " has been unselected<br/>";
			console.log(text);
			log.innerHTML += text;
		} else {
			const text = "row " + index + " has been selected<br/>";
			console.log(text);
			log.innerHTML += text;
		}

    barItem.classList.toggle("highlight");
    for (var i = 0; i < children.length; i++) {
        var tableChild = children[i];
        tableChild.classList.toggle("highlight");
    }
		// toggle checkbox
		children[3].children[0].checked = !children[3].children[0].checked;
};

function highlightItem(index, highlight) {
    highlightSocket.send(`{"index": ${index}, "action": "highlight"}`);    
};
