/**
 * FACELOOK PROFILE CONTROLLER
 */

document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("profile.html")) {
    const userId = Utils.getUrlParam("id") || (Auth.getCurrentUser() ? Auth.getCurrentUser().id : "user_mark");
    const users = FacelookConfig.getLocalCollection("users") || [];
    const user = users.find(u => u.id === userId) || users[0];
    const currentUser = Auth.getCurrentUser();
    const isOwner = currentUser && currentUser.id === user.id;

    // Set Profile Header Data
    const nameEl = document.getElementById("profileName");
    const usernameEl = document.getElementById("profileUsername");
    const avatarEl = document.getElementById("profileAvatar");
    const coverEl = document.getElementById("profileCover");
    const friendsCountEl = document.getElementById("profileFriendsCount");
    const bioEl = document.getElementById("profileBio");
    const workEl = document.getElementById("profileWork");
    const livesEl = document.getElementById("profileLives");

    if (nameEl) nameEl.textContent = user.name;
    if (usernameEl) usernameEl.textContent = "@" + user.username;
    if (avatarEl) avatarEl.src = user.avatar;
    if (coverEl && user.cover) coverEl.src = user.cover;
    if (friendsCountEl) friendsCountEl.textContent = `${user.friendsCount || 0} friends`;
    if (bioEl) bioEl.textContent = user.bio || "No bio yet.";
    if (workEl) workEl.textContent = user.work || "Works at Facelook Community";
    if (livesEl) livesEl.textContent = user.lives || "Earth";

    // Action buttons (Edit Profile or Add Friend / Message)
    const actionContainer = document.getElementById("profileActions");
    if (actionContainer) {
      if (isOwner) {
        actionContainer.innerHTML = `
          <button class="btn btn-secondary" onclick="window.location.href='edit-profile.html'">✏️ Edit Profile</button>
          <button class="btn btn-primary" onclick="App.openModal('modalCreateStory')">+ Add to Story</button>
        `;
      } else {
        actionContainer.innerHTML = `
          <button class="btn btn-primary" onclick="Friends.sendRequest('${user.id}')">👤+ Add Friend</button>
          <button class="btn btn-secondary" onclick="window.location.href='messages.html'">💬 Message</button>
        `;
      }
    }

    // Render User Posts
    const userPosts = (FacelookConfig.getLocalCollection("posts") || []).filter(p => p.authorId === user.id);
    const feedContainer = document.getElementById("profilePostsFeed");
    if (feedContainer) {
      if (userPosts.length === 0) {
        feedContainer.innerHTML = `<div class="card p-16 text-center text-muted">No posts shared yet.</div>`;
      } else {
        feedContainer.innerHTML = userPosts.map(p => Posts.renderPostCard(p, currentUser)).join("");
      }
    }
  }
});
