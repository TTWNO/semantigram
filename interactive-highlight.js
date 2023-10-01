const highlight_element = (ev) => {
  const element = ev.target;
  const x_row = element.getAttribute('data-row');
  const x_col = element.getAttribute('data-col');
  let elementType = "cell";
  let coordinates = [parseInt(x_col), parseInt(x_row)];
  let action = "highlight";

  if (element.classList.contains("highlight")) {
     action = "unhighlight"
  }

  if (x_col === null) {
    elementType = "row";
    coordinates = [parseInt(x_row)];
  }
  if (x_row === null) {
    elementType = "column";
    coordinates = [parseInt(x_col)];
  }
  
  console.log(JSON.stringify({position: {type: elementType, data: coordinates}, action: action}))
  highlightSocket.send(JSON.stringify({position: {type: elementType, data: coordinates}, action: action}))
}

document.querySelectorAll("[data-row],[data-col]")
  .forEach((item) => {
    item.addEventListener("click", highlight_element)
  })