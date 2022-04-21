alt.on('createSnackbar', (id, variant, text) => {
  let classes = "snackbar " + variant;
  if (id == 'timer') {
    id = Date.now();
    setTimeout(() => {
      document.getElementById(id).remove();
    }, 5000)
  }

  let newSnackbar = document.createElement("div");
  newSnackbar.setAttribute('id', id);
  newSnackbar.setAttribute('class', classes);
  newSnackbar.innerText = text;
  document.getElementById("wrapper").prepend(newSnackbar)
});

alt.on('removeSnackbar', (id) => {
  document.getElementById(id).remove();
});
