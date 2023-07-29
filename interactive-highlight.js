const highlight_table_focus = (ev) => {
  let action = "highlight"
  let clickedItem = ev.target;
  item = clickedItem.parentElement;

  const index = item.id.replace('table-', '');

  highlightSocket.send(`{"index": ${index}, "action": "${action}"}`);    
}

document.querySelectorAll(".highlightable")
  .forEach((item) => {
    // console.log(item)
    item.addEventListener("focus", highlight_table_focus)
    item.addEventListener("click", highlight_table_focus)
  })
