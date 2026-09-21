/**
 * FACELOOK UTILITY FUNCTIONS
 * Formatting, XSS sanitization, Toast triggers, and helper utilities.
 */

const Utils = {
  // Escape HTML to prevent XSS
  escapeHtml(str) {
    if (!str) return "";
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  },

  // Relative Time Formatter (e.g. 5m, 2h, 3d, Just now)
  formatTimeAgo(timestamp) {
    if (!timestamp) return "Just now";
    const now = Date.now();
    const diff = Math.floor((now - timestamp) / 1000);

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;

    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  },

  // Show Toast Notification
  showToast(message, type = "success") {
    let container = document.getElementById("toastContainer");
    if (!container) {
      container = document.createElement("div");
      container.id = "toastContainer";
      container.className = "toast-container";
      document.body.appendChild(container);
    }

    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    
    let icon = "✓";
    if (type === "error") icon = "✕";
    if (type === "warning") icon = "⚠";

    toast.innerHTML = `
      <span style="font-weight:bold; font-size:16px;">${icon}</span>
      <span style="flex:1;">${this.escapeHtml(message)}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(-10px)";
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  },

  // Theme Management (Light / Dark)
  initTheme() {
    const savedTheme = localStorage.getItem("facelook_theme") || "light";
    document.documentElement.setAttribute("data-theme", savedTheme);
  },

  toggleTheme() {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("facelook_theme", next);
    this.showToast(`Switched to ${next} mode`, "info");
    return next;
  },

  // Parse URL Parameters
  getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }
};

// Initialize theme immediately on script load
Utils.initTheme();

window.Utils = Utils;
