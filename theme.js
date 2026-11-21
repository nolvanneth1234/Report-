(() => {
  const storageKey = "vanneth-portfolio-theme";
  const themes = new Set(["paper", "dark", "ocean", "rose"]);
  const themeColors = {
    paper: "#f5f2e9",
    dark: "#151b18",
    ocean: "#edf4f4",
    rose: "#f8efed",
  };

  let activeTheme = "paper";
  try {
    const savedTheme = window.localStorage.getItem(storageKey);
    if (themes.has(savedTheme)) activeTheme = savedTheme;
  } catch {
    // A blocked or unavailable localStorage should not prevent theme switching.
  }

  function applyTheme(theme, save = true) {
    if (!themes.has(theme)) return;
    activeTheme = theme;
    document.documentElement.dataset.theme = theme;

    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.setAttribute("content", themeColors[theme]);

    document.querySelectorAll("[data-theme-choice]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.themeChoice === theme));
    });

    if (save) {
      const status = document.getElementById("theme-status");
      try {
        window.localStorage.setItem(storageKey, theme);
        if (status) status.textContent = "បានរក្សាទុករូបរាងនេះក្នុង browser របស់អ្នក។";
      } catch {
        if (status) status.textContent = "បានប្ដូររូបរាងសម្រាប់ការមើលនេះ ប៉ុន្តែ browser មិនអនុញ្ញាតឲ្យរក្សាទុកទេ។";
      }
    }
  }

  // Apply before the stylesheet is loaded to avoid flashing the default palette.
  applyTheme(activeTheme, false);

  document.addEventListener("DOMContentLoaded", () => {
    applyTheme(activeTheme, false);
    document.querySelectorAll("[data-theme-choice]").forEach((button) => {
      button.addEventListener("click", () => applyTheme(button.dataset.themeChoice));
    });
  });
})();
