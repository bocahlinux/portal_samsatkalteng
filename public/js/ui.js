(() => {
  const key = "portal_ui";
  const state = JSON.parse(localStorage.getItem(key) || "{}");

  const apply = () => {
    document.body.classList.toggle("ui-contrast", !!state.contrast);
    document.body.classList.remove("ui-font-lg", "ui-font-xl");
    if (state.font === "lg") document.body.classList.add("ui-font-lg");
    if (state.font === "xl") document.body.classList.add("ui-font-xl");
  };

  const save = () => localStorage.setItem(key, JSON.stringify(state));

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-ui]");
    if (!btn) return;

    const action = btn.getAttribute("data-ui");
    if (action === "contrast") state.contrast = !state.contrast;

    if (action === "font+") {
      state.font = state.font === "lg" ? "xl" : "lg";
    }
    if (action === "font-") {
      state.font = state.font === "xl" ? "lg" : "";
    }

    save();
    apply();
  });

  apply();
})();