//const websocketServer = "ws://localhost:3000/ws";
//
//const highlightSocket = new WebSocket(
//    websocketServer,
//);

const highlight_table_checkbox = (ev) => {
	ev.target.checked = !ev.target.checked;
  let action = "highlight"
  let clickedItem = ev.target;
  item = clickedItem.parentElement.parentElement;

  const index = item.id.replace('table-', '');

  highlightSocket.send(JSON.stringify({index: Number(index), action: action}));
	ev.preventDefault();
	ev.stopPropagation();
	return false;
}

const highlight_table_focus = (ev) => {
  let action = "highlight"
  let clickedItem = ev.target;
  item = clickedItem.parentElement;

  const index = item.id.replace('table-', '');

  highlightSocket.send(JSON.stringify({index: Number(index), action: action}));    
}

const highlight_svg_click = (ev) => {
  const bar = ev.target;
  
  const id = Number(bar.id.replace("bar-", ""))
  highlightSocket.send(JSON.stringify({index: id, action: "highlight"}))
}

document.querySelectorAll('input[type="checkbox"]')
	.forEach((item) => {
		item.addEventListener("change", highlight_table_checkbox)
	})

document.querySelectorAll("table td.highlightable")
  .forEach((item) => {
    item.addEventListener("focus", highlight_table_focus)
    item.addEventListener("click", highlight_table_focus)
  })

document.querySelectorAll("svg rect")
  .forEach((item) => {
    item.addEventListener("click", highlight_svg_click)
  })
