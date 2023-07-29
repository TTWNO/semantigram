const highlight_table_focus = (ev) => {
  const item = ev.target;
  item.classList.toggle("highlight")
  console.log(ev)
}

document.querySelectorAll(".highlightable")
  .forEach((item) => {
    console.log(item)
    item.addEventListener("focus", highlight_table_focus)
    item.addEventListener("click", highlight_table_focus)
  })
