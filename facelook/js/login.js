/**
 * FACELOOK LOGIN CONTROLLER
 */

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const emailInput = document.getElementById("emailInput");
  const passwordInput = document.getElementById("passwordInput");
  const togglePassBtn = document.getElementById("togglePasswordBtn");

  // Toggle Password Visibility
  if (togglePassBtn && passwordInput) {
    togglePassBtn.addEventListener("click", () => {
      const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
      passwordInput.setAttribute("type", type);
      togglePassBtn.textContent = type === "password" ? "👁️" : "🙈";
    });
  }

  // Handle Form Submission
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = emailInput.value.trim().toLowerCase();
      const pass = passwordInput.value;

      if (!email || !pass) {
        Utils.showToast("Please enter both email and password.", "error");
        return;
      }

      // Check users collection
      const users = FacelookConfig.getLocalCollection("users") || [];
      const user = users.find(u => u.email.toLowerCase() === email || u.username.toLowerCase() === email);

      if (user) {
        Auth.setCurrentUser(user);
        Utils.showToast(`Welcome back, ${user.name}!`);
        setTimeout(() => {
          window.location.href = "index.html";
        }, 800);
      } else {
        // Automatically create account for demonstration if email is valid
        const newUser = {
          id: "user_" + Date.now(),
          name: email.split("@")[0].toUpperCase(),
          username: email.split("@")[0],
          email: email,
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
          cover: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80",
          bio: "Just joined Facelook!",
          role: "user",
          friendsCount: 0,
          createdAt: Date.now()
        };
        users.push(newUser);
        FacelookConfig.setLocalCollection("users", users);
        Auth.setCurrentUser(newUser);
        Utils.showToast(`Welcome to Facelook, ${newUser.name}!`);
        setTimeout(() => {
          window.location.href = "index.html";
        }, 800);
      }
    });
  }
});
