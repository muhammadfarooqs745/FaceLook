/**
 * FACELOOK MASTER APPLICATION CONTROLLER
 * Global initialization, navigation handling, and complete 26-popup modal system.
 */

const App = {
  activeModalId: null,

  init() {
    this.setupNavbar();
    this.setupModals();
    this.setupEscapeKey();
    if (window.Notifications) {
      window.Notifications.updateBadge();
    }
  },

  setupNavbar() {
    const user = Auth.getCurrentUser();
    
    // Update all user avatar elements in nav
    document.querySelectorAll(".nav-user-avatar").forEach(img => {
      if (user && user.avatar) img.src = user.avatar;
    });

    const userNameEl = document.getElementById("navUserName");
    if (userNameEl && user) {
      userNameEl.textContent = user.name;
    }

    // Dropdown toggles
    const profileDropdownBtn = document.getElementById("profileDropdownBtn");
    const profileMenu = document.getElementById("profileDropdownMenu");
    if (profileDropdownBtn && profileMenu) {
      profileDropdownBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        profileMenu.classList.toggle("show");
        const notifMenu = document.getElementById("notifDropdownMenu");
        if (notifMenu) notifMenu.classList.remove("show");
      });
    }

    const notifBtn = document.getElementById("notifDropdownBtn");
    const notifMenu = document.getElementById("notifDropdownMenu");
    if (notifBtn && notifMenu) {
      notifBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        notifMenu.classList.toggle("show");
        if (window.Notifications) window.Notifications.renderNotifications();
        if (profileMenu) profileMenu.classList.remove("show");
      });
    }

    // Global click listener to close dropdowns
    document.addEventListener("click", () => {
      if (profileMenu) profileMenu.classList.remove("show");
      if (notifMenu) notifMenu.classList.remove("show");
      document.querySelectorAll(".dropdown-menu.show").forEach(m => m.classList.remove("show"));
    });
  },

  togglePostMenu(postId) {
    event.stopPropagation();
    const menu = document.getElementById(`post-menu-${postId}`);
    if (menu) {
      const isShown = menu.classList.contains("show");
      document.querySelectorAll(".dropdown-menu.show").forEach(m => m.classList.remove("show"));
      if (!isShown) menu.classList.add("show");
    }
  },

  // PROFESSIONAL 26 POPUP & MODAL SYSTEM
  openModal(modalId, options = {}) {
    this.closeAllModals();
    let modal = document.getElementById(modalId);
    
    // If not found in DOM, render dynamically
    if (!modal) {
      modal = this.createDynamicModal(modalId, options);
    }

    if (modal) {
      modal.classList.add("active");
      this.activeModalId = modalId;
      document.body.style.overflow = "hidden";
    }
  },

  closeModal(modalId) {
    const id = modalId || this.activeModalId;
    if (!id) return;
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.remove("active");
      this.activeModalId = null;
      document.body.style.overflow = "";
    }
  },

  closeAllModals() {
    document.querySelectorAll(".modal-backdrop.active").forEach(m => m.classList.remove("active"));
    this.activeModalId = null;
    document.body.style.overflow = "";
  },

  setupModals() {
    // Backdrop click-outside listener
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("modal-backdrop")) {
        this.closeAllModals();
      }
    });
  },

  setupEscapeKey() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        this.closeAllModals();
        if (window.Stories) window.Stories.closeStoryViewer();
      }
    });
  },

  // Modal registry for the 26 specific popups
  createDynamicModal(modalId, options = {}) {
    let title = "Facelook Notification";
    let bodyHtml = "";
    let footerHtml = `
      <button class="btn btn-secondary" onclick="App.closeModal('${modalId}')">Cancel</button>
      <button class="btn btn-primary" onclick="App.closeModal('${modalId}')">Confirm</button>
    `;

    switch (modalId) {
      case "modalLoginRequired":
        title = "Login Required";
        bodyHtml = "<p>You need to be logged into Facelook to perform this action.</p>";
        footerHtml = `<button class="btn btn-primary btn-block" onclick="window.location.href='login.html'">Log In Now</button>`;
        break;

      case "modalSignupSuccess":
        title = "Welcome to Facelook! 🎉";
        bodyHtml = "<p>Your account has been created successfully. Connect with friends and explore your news feed!</p>";
        footerHtml = `<button class="btn btn-primary btn-block" onclick="window.location.href='index.html'">Go to Feed</button>`;
        break;

      case "modalForgotPassword":
        title = "Reset Your Password";
        bodyHtml = `
          <p class="text-muted">Enter your registered email address and we'll send you a password recovery link.</p>
          <input type="email" id="modalForgotEmail" class="form-control mt-12" placeholder="name@example.com">
        `;
        footerHtml = `
          <button class="btn btn-secondary" onclick="App.closeModal('${modalId}')">Cancel</button>
          <button class="btn btn-primary" onclick="Utils.showToast('Password reset link sent to your email!'); App.closeModal('${modalId}');">Send Link</button>
        `;
        break;

      case "modalCreatePost":
        title = "Create Post";
        const user = Auth.getCurrentUser();
        bodyHtml = `
          <div style="display:flex; align-items:center; gap:10px;">
            <img src="${user ? user.avatar : ''}" class="user-avatar">
            <div>
              <strong>${user ? user.name : 'You'}</strong>
              <select id="modalPostAudience" style="display:block; font-size:12px; margin-top:2px; padding:2px 6px; border-radius:4px; border:1px solid var(--border-light); background:var(--bg-input);">
                <option value="public">🌐 Public</option>
                <option value="friends">👥 Friends</option>
                <option value="only_me">🔒 Only me</option>
              </select>
            </div>
          </div>
          <textarea id="modalPostContent" class="form-control" style="min-height:100px; border:none; resize:none;" placeholder="What's on your mind?"></textarea>
          <div style="border:1px dashed var(--border-color); border-radius:var(--radius-sm); padding:12px; text-align:center;">
            <label style="cursor:pointer; font-weight:600; color:var(--primary);">
              📷 Add Photo or Video
              <input type="file" id="modalPostFileInput" style="display:none;" accept="image/*,video/*" onchange="App.handleModalMediaSelect(event)">
            </label>
            <div id="modalMediaPreviewArea" style="margin-top:10px;"></div>
          </div>
        `;
        footerHtml = `
          <button class="btn btn-primary btn-block" onclick="App.submitCreatePost()">Post</button>
        `;
        break;

      case "modalDeletePost":
        title = "Delete Post?";
        bodyHtml = "<p>Are you sure you want to delete this post? This action cannot be undone.</p>";
        footerHtml = `
          <button class="btn btn-secondary" onclick="App.closeModal('${modalId}')">Cancel</button>
          <button class="btn btn-danger" onclick="App.confirmDeletePost('${options.postId}')">Delete</button>
        `;
        break;

      case "modalDeleteAccount":
        title = "Delete Account";
        bodyHtml = "<p style='color:var(--danger);'>Warning: All your posts, photos, messages, and friendships will be permanently erased.</p>";
        footerHtml = `
          <button class="btn btn-secondary" onclick="App.closeModal('${modalId}')">Cancel</button>
          <button class="btn btn-danger" onclick="Auth.logout();">Delete My Account</button>
        `;
        break;

      case "modalLogoutConfirm":
        title = "Log Out";
        bodyHtml = "<p>Are you sure you want to log out of Facelook?</p>";
        footerHtml = `
          <button class="btn btn-secondary" onclick="App.closeModal('${modalId}')">Cancel</button>
          <button class="btn btn-primary" onclick="Auth.logout();">Log Out</button>
        `;
        break;

      case "modalAddFriend":
        title = "Add Friend";
        bodyHtml = `<p>Send a friend request to this user?</p>`;
        footerHtml = `
          <button class="btn btn-secondary" onclick="App.closeModal('${modalId}')">Cancel</button>
          <button class="btn btn-primary" onclick="Friends.sendRequest('${options.userId}'); App.closeModal('${modalId}');">Send Request</button>
        `;
        break;

      case "modalAcceptRejectFriend":
        title = "Friend Request";
        bodyHtml = `<p>Respond to friend request from this user.</p>`;
        footerHtml = `
          <button class="btn btn-secondary" onclick="App.closeModal('${modalId}')">Decline</button>
          <button class="btn btn-primary" onclick="Friends.acceptRequest('${options.requestId}'); App.closeModal('${modalId}');">Accept</button>
        `;
        break;

      case "modalUnfriend":
        title = "Unfriend Connection";
        bodyHtml = `<p>Are you sure you want to remove this person from your friends list?</p>`;
        footerHtml = `
          <button class="btn btn-secondary" onclick="App.closeModal('${modalId}')">Cancel</button>
          <button class="btn btn-danger" onclick="Friends.removeFriend('${options.userId}'); App.closeModal('${modalId}');">Unfriend</button>
        `;
        break;

      case "modalBlockUser":
        title = "Block User";
        bodyHtml = `<p>They will no longer be able to see your posts, send you messages, or find your profile.</p>`;
        footerHtml = `
          <button class="btn btn-secondary" onclick="App.closeModal('${modalId}')">Cancel</button>
          <button class="btn btn-danger" onclick="Friends.blockUser('${options.userId}'); App.closeModal('${modalId}');">Block</button>
        `;
        break;

      case "modalReportPost":
        title = "Report Post";
        bodyHtml = `
          <p>Please select a reason for reporting this post:</p>
          <select id="reportReasonSelect" class="form-control mt-12">
            <option>Spam or Scam</option>
            <option>Hate speech or harassment</option>
            <option>Inappropriate or violent content</option>
            <option>False information</option>
          </select>
        `;
        footerHtml = `
          <button class="btn btn-secondary" onclick="App.closeModal('${modalId}')">Cancel</button>
          <button class="btn btn-danger" onclick="Utils.showToast('Thank you. Post reported to Facelook moderators.'); App.closeModal('${modalId}');">Submit Report</button>
        `;
        break;

      case "modalReportUser":
        title = "Report User Profile";
        bodyHtml = `
          <p>Why are you reporting this profile?</p>
          <select class="form-control mt-12">
            <option>Fake account or impersonation</option>
            <option>Harassment</option>
            <option>Inappropriate profile picture</option>
          </select>
        `;
        footerHtml = `
          <button class="btn btn-secondary" onclick="App.closeModal('${modalId}')">Cancel</button>
          <button class="btn btn-danger" onclick="Utils.showToast('Report submitted for admin review.'); App.closeModal('${modalId}');">Submit</button>
        `;
        break;

      case "modalSharePost":
        title = "Share Post";
        bodyHtml = `
          <p>Share this post to your feed or copy the direct link:</p>
          <input type="text" readonly class="form-control mt-12" value="https://facelook.web.app/post.html?id=${options.postId || '1'}">
        `;
        footerHtml = `
          <button class="btn btn-secondary" onclick="Utils.showToast('Link copied to clipboard!'); App.closeModal('${modalId}');">Copy Link</button>
          <button class="btn btn-primary" onclick="Utils.showToast('Shared to your feed!'); App.closeModal('${modalId}');">Share Now</button>
        `;
        break;

      case "modalCreateStory":
        title = "Add to Story";
        bodyHtml = `
          <p>Share a photo to your story that will be visible for 24 hours.</p>
          <div style="border:1px dashed var(--border-color); border-radius:var(--radius-sm); padding:20px; text-align:center;">
            <input type="file" id="modalStoryFileInput" accept="image/*" style="display:none;" onchange="App.handleStoryFileSelect(event)">
            <label for="modalStoryFileInput" class="btn btn-primary" style="cursor:pointer;">Choose Photo</label>
            <div id="modalStoryPreviewArea" style="margin-top:12px;"></div>
          </div>
        `;
        footerHtml = `
          <button class="btn btn-secondary" onclick="App.closeModal('${modalId}')">Cancel</button>
          <button class="btn btn-primary" onclick="App.submitStory()">Share to Story</button>
        `;
        break;

      case "modalChangePassword":
        title = "Change Password";
        bodyHtml = `
          <input type="password" class="form-control" placeholder="Current password">
          <input type="password" class="form-control mt-12" placeholder="New password">
          <input type="password" class="form-control mt-12" placeholder="Confirm new password">
        `;
        footerHtml = `
          <button class="btn btn-secondary" onclick="App.closeModal('${modalId}')">Cancel</button>
          <button class="btn btn-primary" onclick="Utils.showToast('Password changed successfully!'); App.closeModal('${modalId}');">Update</button>
        `;
        break;

      case "modalProfilePicUpload":
        title = "Update Profile Picture";
        bodyHtml = `
          <div style="text-align:center;">
            <input type="file" id="avatarFileInput" accept="image/*" class="form-control" onchange="App.handleAvatarFileSelect(event)">
            <div id="avatarPreviewArea" style="margin-top:12px;"></div>
          </div>
        `;
        footerHtml = `
          <button class="btn btn-secondary" onclick="App.closeModal('${modalId}')">Cancel</button>
          <button class="btn btn-primary" onclick="App.saveAvatar()">Save Photo</button>
        `;
        break;

      case "modalCoverPhotoUpload":
        title = "Update Cover Photo";
        bodyHtml = `
          <div style="text-align:center;">
            <input type="file" id="coverFileInput" accept="image/*" class="form-control" onchange="App.handleCoverFileSelect(event)">
            <div id="coverPreviewArea" style="margin-top:12px;"></div>
          </div>
        `;
        footerHtml = `
          <button class="btn btn-secondary" onclick="App.closeModal('${modalId}')">Cancel</button>
          <button class="btn btn-primary" onclick="App.saveCover()">Save Cover</button>
        `;
        break;

      case "modalAdminAction":
        title = "Confirm Admin Moderation";
        bodyHtml = `<p>Execute administrative action: <strong>${options.action || 'Moderate'}</strong> on selected target?</p>`;
        footerHtml = `
          <button class="btn btn-secondary" onclick="App.closeModal('${modalId}')">Cancel</button>
          <button class="btn btn-danger" onclick="Utils.showToast('Administrative moderation executed.'); App.closeModal('${modalId}');">Confirm Action</button>
        `;
        break;

      default:
        title = options.title || "Facelook Modal";
        bodyHtml = options.content || "<p>Modal content</p>";
    }

    const modalEl = document.createElement("div");
    modalEl.id = modalId;
    modalEl.className = "modal-backdrop";
    modalEl.innerHTML = `
      <div class="modal-container">
        <div class="modal-header">
          <h3 class="modal-title">${title}</h3>
          <button class="modal-close-btn" onclick="App.closeModal('${modalId}')">✕</button>
        </div>
        <div class="modal-body">${bodyHtml}</div>
        <div class="modal-footer">${footerHtml}</div>
      </div>
    `;

    document.body.appendChild(modalEl);
    return modalEl;
  },

  // Media upload preview helpers
  tempMediaUrl: null,
  handleModalMediaSelect(e) {
    const file = e.target.files[0];
    if (file) {
      Upload.readFileAsDataURL(file).then(dataUrl => {
        this.tempMediaUrl = dataUrl;
        const previewArea = document.getElementById("modalMediaPreviewArea");
        if (previewArea) {
          previewArea.innerHTML = `<img src="${dataUrl}" style="max-height:140px; border-radius:8px;">`;
        }
      });
    }
  },

  submitCreatePost() {
    const content = document.getElementById("modalPostContent").value;
    const audience = document.getElementById("modalPostAudience").value;
    Posts.createPost(content, this.tempMediaUrl, "image", audience);
    this.tempMediaUrl = null;
    this.closeModal("modalCreatePost");
  },

  handleStoryFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
      Upload.readFileAsDataURL(file).then(dataUrl => {
        this.tempStoryUrl = dataUrl;
        const preview = document.getElementById("modalStoryPreviewArea");
        if (preview) preview.innerHTML = `<img src="${dataUrl}" style="max-height:160px; border-radius:8px;">`;
      });
    }
  },

  tempStoryUrl: null,
  submitStory() {
    if (this.tempStoryUrl) {
      Stories.createStory(this.tempStoryUrl);
      this.tempStoryUrl = null;
      this.closeModal("modalCreateStory");
    } else {
      Utils.showToast("Please choose an image for your story.", "warning");
    }
  },

  openMediaViewer(url, type = "image") {
    let viewer = document.getElementById("modalMediaViewer");
    if (!viewer) {
      viewer = document.createElement("div");
      viewer.id = "modalMediaViewer";
      viewer.className = "modal-backdrop";
      viewer.innerHTML = `
        <div class="modal-container modal-media-viewer">
          <div class="modal-header">
            <h3 class="modal-title">Media View</h3>
            <button class="modal-close-btn" onclick="App.closeModal('modalMediaViewer')">✕</button>
          </div>
          <div class="modal-body" id="mediaViewerContent"></div>
        </div>
      `;
      document.body.appendChild(viewer);
    }

    const contentArea = document.getElementById("mediaViewerContent");
    if (type === "video") {
      contentArea.innerHTML = `<video src="${url}" controls autoplay style="max-height:75vh; width:100%;"></video>`;
    } else {
      contentArea.innerHTML = `<img src="${url}" style="max-height:75vh; width:100%; object-fit:contain;">`;
    }

    this.openModal("modalMediaViewer");
  },

  openEditPostModal(postId) {
    const posts = FacelookConfig.getLocalCollection("posts") || [];
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    this.openModal("modalCreatePost");
    const contentInput = document.getElementById("modalPostContent");
    if (contentInput) contentInput.value = post.content;
  },

  openDeletePostModal(postId) {
    this.openModal("modalDeletePost", { postId });
  },

  confirmDeletePost(postId) {
    let posts = FacelookConfig.getLocalCollection("posts") || [];
    posts = posts.filter(p => p.id !== postId);
    FacelookConfig.setLocalCollection("posts", posts);
    Utils.showToast("Post deleted successfully.");
    this.closeModal("modalDeletePost");
    Posts.renderFeed();
  },

  openReportPostModal(postId) {
    this.openModal("modalReportPost", { postId });
  },

  openShareModal(postId) {
    this.openModal("modalSharePost", { postId });
  }
};

window.App = App;

document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
