alt.on('createSnackbar', (variant, text) => {
  let classes = "snackbar " + variant;

  document.getElementById("wrapper").innerHTML += 
    "<div class=\"" + classes + "\">" + text + "</div>";
});

alt.on('removeSnackbar', () => {
  document.getElementById("wrapper").innerHTML = "";
});
