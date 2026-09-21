/**
 * FACELOOK SETTINGS CONTROLLER
 */

document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("settings.html")) {
    const user = Auth.requireAuth();
    if (!user) return;

    const nameInput = document.getElementById("settingsNameInput");
    const usernameInput = document.getElementById("settingsUsernameInput");
    const emailInput = document.getElementById("settingsEmailInput");
    const bioInput = document.getElementById("settingsBioInput");
    const darkModeToggle = document.getElementById("darkModeToggle");

    if (nameInput) nameInput.value = user.name || "";
    if (usernameInput) usernameInput.value = user.username || "";
    if (emailInput) emailInput.value = user.email || "";
    if (bioInput) bioInput.value = user.bio || "";

    if (darkModeToggle) {
      darkModeToggle.checked = document.documentElement.getAttribute("data-theme") === "dark";
      darkModeToggle.addEventListener("change", () => {
        Utils.toggleTheme();
      });
    }

    const form = document.getElementById("accountSettingsForm");
    if (form) {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        user.name = nameInput.value.trim();
        user.username = usernameInput.value.trim();
        user.email = emailInput.value.trim();
        if (bioInput) user.bio = bioInput.value.trim();

        const users = FacelookConfig.getLocalCollection("users") || [];
        const idx = users.findIndex(u => u.id === user.id);
        if (idx !== -1) {
          users[idx] = { ...users[idx], ...user };
          FacelookConfig.setLocalCollection("users", users);
        }
        Auth.setCurrentUser(user);
        Utils.showToast("Settings updated successfully!");
      });
    }
  }
});
