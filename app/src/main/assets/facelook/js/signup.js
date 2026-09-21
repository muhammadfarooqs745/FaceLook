/**
 * FACELOOK SIGNUP CONTROLLER
 */

document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.getElementById("signupForm");
  const passwordInput = document.getElementById("passwordInput");
  const strengthBar = document.getElementById("strengthBar");
  const strengthText = document.getElementById("strengthText");

  // Password strength meter
  if (passwordInput && strengthBar) {
    passwordInput.addEventListener("input", () => {
      const val = passwordInput.value;
      let score = 0;
      if (val.length >= 6) score += 25;
      if (val.length >= 8) score += 25;
      if (/[A-Z]/.test(val)) score += 25;
      if (/[0-9!@#$%^&*]/.test(val)) score += 25;

      strengthBar.style.width = score + "%";
      if (score <= 25) {
        strengthBar.style.backgroundColor = "var(--danger)";
        strengthText.textContent = "Weak password";
      } else if (score <= 75) {
        strengthBar.style.backgroundColor = "var(--warning)";
        strengthText.textContent = "Moderate password";
      } else {
        strengthBar.style.backgroundColor = "var(--success)";
        strengthText.textContent = "Strong password";
      }
    });
  }

  // Handle Signup
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const firstName = document.getElementById("firstNameInput").value.trim();
      const lastName = document.getElementById("lastNameInput").value.trim();
      const username = document.getElementById("usernameInput").value.trim().toLowerCase();
      const email = document.getElementById("emailInput").value.trim().toLowerCase();
      const password = passwordInput.value;

      if (!firstName || !lastName || !username || !email || !password) {
        Utils.showToast("Please fill in all required fields.", "error");
        return;
      }

      const users = FacelookConfig.getLocalCollection("users") || [];
      if (users.some(u => u.email === email)) {
        Utils.showToast("An account with this email already exists.", "error");
        return;
      }

      if (users.some(u => u.username === username)) {
        Utils.showToast("This username is already taken.", "error");
        return;
      }

      const newUser = {
        id: "user_" + Date.now(),
        name: `${firstName} ${lastName}`,
        username: username,
        email: email,
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        cover: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80",
        bio: `Hi, I am ${firstName} and I just joined Facelook!`,
        work: "Member at Facelook",
        lives: "Earth",
        role: "user",
        friendsCount: 0,
        createdAt: Date.now()
      };

      users.push(newUser);
      FacelookConfig.setLocalCollection("users", users);
      Auth.setCurrentUser(newUser);

      // Trigger Signup Success Popup
      if (window.App && window.App.openModal) {
        window.App.openModal("modalSignupSuccess");
      } else {
        Utils.showToast("Account created successfully!");
        setTimeout(() => window.location.href = "index.html", 1000);
      }
    });
  }
});
