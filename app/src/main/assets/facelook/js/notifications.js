/**
 * FACELOOK NOTIFICATIONS CONTROLLER
 */

const Notifications = {
  renderNotifications() {
    const list = document.getElementById("notificationsList");
    if (!list) return;

    const notifs = FacelookConfig.getLocalCollection("notifications") || [];
    if (notifs.length === 0) {
      list.innerHTML = `<div class="p-16 text-muted text-center">No notifications yet.</div>`;
      return;
    }

    list.innerHTML = notifs.map(n => `
      <div class="dropdown-item" style="align-items:flex-start; ${!n.read ? 'background:var(--primary-light);' : ''}" onclick="Notifications.markAsRead('${n.id}')">
        <img src="${n.senderAvatar}" class="user-avatar" style="width:36px; height:36px;">
        <div style="flex:1;">
          <div><strong>${Utils.escapeHtml(n.senderName)}</strong> ${Utils.escapeHtml(n.text)}</div>
          <div style="font-size:11px; color:var(--text-muted); margin-top:2px;">${Utils.formatTimeAgo(n.createdAt)}</div>
        </div>
      </div>
    `).join("");
  },

  markAsRead(notifId) {
    const notifs = FacelookConfig.getLocalCollection("notifications") || [];
    const notif = notifs.find(n => n.id === notifId);
    if (notif) {
      notif.read = true;
      FacelookConfig.setLocalCollection("notifications", notifs);
      this.updateBadge();
    }
  },

  markAllAsRead() {
    const notifs = FacelookConfig.getLocalCollection("notifications") || [];
    notifs.forEach(n => n.read = true);
    FacelookConfig.setLocalCollection("notifications", notifs);
    this.updateBadge();
    this.renderNotifications();
    Utils.showToast("All notifications marked as read.");
  },

  updateBadge() {
    const notifs = FacelookConfig.getLocalCollection("notifications") || [];
    const unreadCount = notifs.filter(n => !n.read).length;
    const badge = document.getElementById("notifBadge");
    if (badge) {
      badge.textContent = unreadCount > 0 ? unreadCount : "";
      badge.style.display = unreadCount > 0 ? "flex" : "none";
    }
  }
};

window.Notifications = Notifications;
