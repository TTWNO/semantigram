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

const highlight_element_binary = (ev) => {
  const element = ev.target;
  const id = element.getAttribute('data-id');
  const parent_id = element.getAttribute('data-parent-id');
  const child_id = element.getAttribute('data-child-id');
  let action = "highlight";

  if (element.classList.contains("highlight")) {
     action = "unhighlight"
  }

  if (id !== null) {
    console.log(JSON.stringify({position: {type: "node", data: [parseInt(id)]}, action: action}));
    highlightSocket.send(JSON.stringify({position: {type: "node", data: [parseInt(id)]}, action: action}));
  }
  if (parent_id !== null && child_id !== null) {
    console.log(JSON.stringify({position: {type: "link", data: [parseInt(parent_id), parseInt(child_id)]}, action: action}))
    highlightSocket.send(JSON.stringify({position: {type: "link", data: [parseInt(parent_id), parseInt(child_id)]}, action: action}))
  }
}

document.querySelectorAll("[data-row],[data-col]")
  .forEach((item) => {
    item.addEventListener("click", highlight_element)
  })

document.querySelectorAll("[data-id],[data-parent-id]")
  .forEach((item) => {
    item.addEventListener("click", highlight_element_binary)
  })