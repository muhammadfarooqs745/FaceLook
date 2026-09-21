/**
 * FACELOOK ADMIN AUTHENTICATION
 */

const AdminAuth = {
  checkAdmin() {
    const user = Auth.getCurrentUser();
    if (!user || user.role !== "admin") {
      Utils.showToast("Admin access denied. Redirecting...", "error");
      setTimeout(() => {
        window.location.href = "admin-login.html";
      }, 1000);
      return false;
    }
    return true;
  },

  adminLogin(email, password) {
    const users = FacelookConfig.getLocalCollection("users") || [];
    const admin = users.find(u => u.email === email && u.role === "admin");
    if (admin) {
      Auth.setCurrentUser(admin);
      Utils.showToast("Admin authenticated successfully!");
      setTimeout(() => window.location.href = "dashboard.html", 800);
      return true;
    } else {
      Utils.showToast("Invalid credentials or unauthorized administrative role.", "error");
      return false;
    }
  }
};

window.AdminAuth = AdminAuth;
