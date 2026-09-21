/**
 * FACELOOK ADMIN DASHBOARD CONTROLLER
 */

document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("/admin/")) {
    // If on admin-login.html, handle login form
    const adminLoginForm = document.getElementById("adminLoginForm");
    if (adminLoginForm) {
      adminLoginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("adminEmailInput").value.trim();
        const pass = document.getElementById("adminPasswordInput").value;
        AdminAuth.adminLogin(email, pass);
      });
      return;
    }

    // Require admin access on dashboard pages
    if (!AdminAuth.checkAdmin()) return;

    // Load Metrics
    const users = FacelookConfig.getLocalCollection("users") || [];
    const posts = FacelookConfig.getLocalCollection("posts") || [];
    const comments = FacelookConfig.getLocalCollection("comments") || [];
    const reports = FacelookConfig.getLocalCollection("reports") || [];

    const totalUsersEl = document.getElementById("adminTotalUsers");
    const totalPostsEl = document.getElementById("adminTotalPosts");
    const totalCommentsEl = document.getElementById("adminTotalComments");
    const totalReportsEl = document.getElementById("adminTotalReports");

    if (totalUsersEl) totalUsersEl.textContent = users.length;
    if (totalPostsEl) totalPostsEl.textContent = posts.length;
    if (totalCommentsEl) totalCommentsEl.textContent = comments.length;
    if (totalReportsEl) totalReportsEl.textContent = reports.length;

    // Populate Users Table if present
    const usersTableBody = document.getElementById("adminUsersTableBody");
    if (usersTableBody) {
      usersTableBody.innerHTML = users.map(u => `
        <tr>
          <td>
            <div style="display:flex; align-items:center; gap:10px;">
              <img src="${u.avatar}" class="user-avatar" style="width:32px; height:32px;">
              <div>
                <strong>${Utils.escapeHtml(u.name)}</strong>
                <div style="font-size:12px; color:var(--text-secondary);">@${Utils.escapeHtml(u.username)}</div>
              </div>
            </div>
          </td>
          <td>${Utils.escapeHtml(u.email)}</td>
          <td><span class="badge ${u.role === 'admin' ? 'badge-primary' : 'badge-success'}">${u.role}</span></td>
          <td><span class="status-pill active">Active</span></td>
          <td>
            <button class="btn btn-sm btn-outline" onclick="App.openModal('modalAdminAction', {action:'Suspend User', target:'${u.id}'})">Action</button>
          </td>
        </tr>
      `).join("");
    }
  }
});
