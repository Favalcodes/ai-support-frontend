(function() {
  const config = window.getLync._config || {};

  // Create root container for the widget
  const container = document.createElement("div");
  container.id = "getlync-widget-container";
  container.style.position = "fixed";
  container.style.bottom = "20px";
  container.style.right = config.position === "bottom-left" ? "unset" : "20px";
  container.style.left  = config.position === "bottom-left" ? "20px" : "unset";
  container.style.zIndex = "999999";
  document.body.appendChild(container);

  // Load React + your bundle (if not already bundled)
  // If using Vite/Webpack you export a global function to mount React:

  function mountWidget() {
    if (window.renderGetLyncWidget) {
      window.renderGetLyncWidget({
        rootId: "getlync-widget-container",
        companyId: config.companyId,
        user: config.user,
        position: config.position
      });
      return;
    }

    // If render not yet ready, wait until loaded
    setTimeout(mountWidget, 50);
  }

  mountWidget();
})();
