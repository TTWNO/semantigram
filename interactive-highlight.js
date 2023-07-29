//const websocketServer = "ws://localhost:3000/ws";
//
//const highlightSocket = new WebSocket(
//    websocketServer,
//);

const highlight_table_focus = (ev) => {
  const item = ev.target;
  item.classList.toggle("highlight")
  console.log(ev)
}

const highlight_svg_click = (ev) => {
  const bar = ev.target;
  bar.classList.toggle("highlight")
  const id = Number(bar.id.replace("bar-", ""))
  highlightSocket.send(JSON.stringify({index: id, action: "highlight"}))
}

document.querySelectorAll("table tr")
  .forEach((item) => {
    item.addEventListener("click", highlight_table_focus)
  })

document.querySelectorAll("svg rect")
  .forEach((item) => {
    item.addEventListener("click", highlight_svg_click)
  })
