/**
 * FACELOOK AUTHENTICATION MANAGER
 * Handles active user session, auth state, login, signup, and logout.
 */

const Auth = {
  // Get currently logged in user
  getCurrentUser() {
    try {
      const raw = localStorage.getItem("facelook_active_user");
      if (raw) return JSON.parse(raw);
    } catch (e) {
      console.error(e);
    }
    // Default active user is Mark Zuckerberg for immediate interactive exploration
    const defaultUser = {
      id: "user_mark",
      name: "Mark Zuckerberg",
      username: "zuck",
      email: "zuck@facelook.com",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      role: "admin",
      verified: true
    };
    localStorage.setItem("facelook_active_user", JSON.stringify(defaultUser));
    return defaultUser;
  },

  // Set active user
  setCurrentUser(user) {
    if (!user) {
      localStorage.removeItem("facelook_active_user");
    } else {
      localStorage.setItem("facelook_active_user", JSON.stringify(user));
    }
  },

  // Switch to another demo user
  switchDemoUser(userId) {
    const users = FacelookConfig.getLocalCollection("users") || [];
    const found = users.find(u => u.id === userId);
    if (found) {
      this.setCurrentUser(found);
      Utils.showToast(`Logged in as ${found.name}`);
      setTimeout(() => window.location.reload(), 500);
    }
  },

  // Logout
  logout() {
    if (typeof firebase !== 'undefined' && firebase.auth) {
      try { firebase.auth().signOut(); } catch (e) {}
    }
    localStorage.removeItem("facelook_active_user");
    Utils.showToast("Logged out successfully");
    setTimeout(() => {
      window.location.href = "login.html";
    }, 600);
  },

  // Auth Guard: Require Login
  requireAuth() {
    const user = this.getCurrentUser();
    if (!user) {
      window.location.href = "login.html";
    }
    return user;
  }
};

window.Auth = Auth;
