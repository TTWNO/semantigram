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
    console.log(event.data);
    // send message with username

};
  
highlightSocket.onclose = (event) => {
    console.warn(event.data);
};

highlightSocket.onmessage = (event) => {
    console.log(event.data);
};

function highlightItem(index, highlight, from) {
    const sourceItemId = from+"-"+index;
    console.log(sourceItemId);

    let sourceItem = document.getElementById(from+"-"+index);

    switch (from) {
        case HighlightElement.GRAPHBAR:
            sourceItem.setAttribute("fill", "red");
            //highlightSocket.send("{'index': '%s', 'action': '%s'}".format(index, 'highlight'));
            break;       
        case HighlightElement.TABLE:
            sourceItem.setAttribute("style", "color: red;");
            break;
    }
    
};
