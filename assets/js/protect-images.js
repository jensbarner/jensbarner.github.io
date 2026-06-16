<script>
document.addEventListener("contextmenu", e => {
  if (e.target.tagName === "IMG") {
    e.preventDefault();
  }
});

document.addEventListener("contextmenu", (event) => {
  if (event.target.tagName === "IMG") {
    event.preventDefault();
  }
});

document.addEventListener("dragstart", (event) => {
  if (event.target.tagName === "IMG") {
    event.preventDefault();
  }
});
</script>


