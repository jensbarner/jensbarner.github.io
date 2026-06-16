async function loadIncludes() {

  const includes = document.querySelectorAll("[data-include]");

  for (const element of includes) {

    const file = element.getAttribute("data-include");

    const response = await fetch(file);

    if (response.ok) {
      element.innerHTML = await response.text();
    }

  }
}

loadIncludes();
