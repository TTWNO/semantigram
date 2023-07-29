//const websocketServer = "ws://localhost:3000/ws";
//
//const highlightSocket = new WebSocket(
//    websocketServer,
//);

const highlight_table_focus = (ev) => {
  let action = "highlight"
  let clickedItem = ev.target;
  item = clickedItem.parentElement;

  const index = item.id.replace('table-', '');

  highlightSocket.send(`{"index": ${index}, "action": "${action}"}`);    
}

const highlight_svg_click = (ev) => {
  const bar = ev.target;
  bar.classList.toggle("highlight")
  const id = Number(bar.id.replace("bar-", ""))
  highlightSocket.send(JSON.stringify({index: id, action: "highlight"}))
}

document.querySelectorAll("table tr")
  .forEach((item) => {
    // console.log(item)
    item.addEventListener("focus", highlight_table_focus)
    item.addEventListener("click", highlight_table_focus)
  })

document.querySelectorAll("svg rect")
  .forEach((item) => {
    item.addEventListener("click", highlight_svg_click)
  })
