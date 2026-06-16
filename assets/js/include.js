async function loadIncludes() {
  const includes = document.querySelectorAll("[data-include]");

  for (const element of includes) {
    const file = element.getAttribute("data-include");

    try {
      const response = await fetch(file);

      if (!response.ok) {
        console.warn(`Include konnte nicht geladen werden: ${file}`);
        continue;
      }

      element.innerHTML = await response.text();
    } catch (error) {
      console.warn(`Include-Fehler bei ${file}:`, error);
    }
  }
}

loadIncludes();