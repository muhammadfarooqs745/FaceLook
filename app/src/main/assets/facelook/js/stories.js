/**
 * FACELOOK STORIES ENGINE
 * 24-hour disappearing stories, progress bar animation, viewer modal
 */

const Stories = {
  activeStoryIndex: 0,
  storyTimer: null,

  renderStories(containerId = "storiesContainer") {
    const container = document.getElementById(containerId);
    if (!container) return;

    const user = Auth.getCurrentUser();
    const stories = (FacelookConfig.getLocalCollection("stories") || []).filter(s => s.expiresAt > Date.now());

    let html = `
      <!-- CREATE STORY CARD -->
      <div class="story-card story-create-card" onclick="App.openModal('modalCreateStory')">
        <img src="${user ? user.avatar : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}" class="story-create-thumb" alt="Your avatar">
        <div class="story-create-btn">+</div>
        <div class="story-create-text">Create Story</div>
      </div>
    `;

    stories.forEach((story, idx) => {
      html += `
        <div class="story-card" onclick="Stories.openStoryViewer(${idx})">
          <img src="${story.mediaUrl}" class="story-bg-media" alt="Story preview">
          <img src="${story.authorAvatar}" class="story-author-avatar" alt="${Utils.escapeHtml(story.authorName)}">
          <span class="story-author-name">${Utils.escapeHtml(story.authorName)}</span>
        </div>
      `;
    });

    container.innerHTML = html;
  },

  openStoryViewer(index) {
    const stories = (FacelookConfig.getLocalCollection("stories") || []).filter(s => s.expiresAt > Date.now());
    if (!stories[index]) return;

    this.activeStoryIndex = index;
    const story = stories[index];

    let modal = document.getElementById("storyViewerModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "storyViewerModal";
      modal.className = "story-viewer-modal";
      modal.innerHTML = `
        <div class="story-viewer-box">
          <div class="story-progress-bar-container">
            <div class="story-progress-bar"><div id="storyProgressFill" class="story-progress-fill"></div></div>
          </div>
          <div class="story-viewer-header">
            <div style="display:flex; align-items:center; gap:8px;">
              <img id="storyViewerAvatar" class="user-avatar" style="width:36px; height:36px;">
              <strong id="storyViewerName"></strong>
            </div>
            <button class="modal-close-btn" style="color:white; background:rgba(255,255,255,0.2);" onclick="Stories.closeStoryViewer()">✕</button>
          </div>
          <img id="storyViewerImage" style="width:100%; height:100%; object-fit:cover;" alt="Story view">
        </div>
      `;
      document.body.appendChild(modal);
    }

    document.getElementById("storyViewerAvatar").src = story.authorAvatar;
    document.getElementById("storyViewerName").textContent = story.authorName;
    document.getElementById("storyViewerImage").src = story.mediaUrl;

    const fill = document.getElementById("storyProgressFill");
    fill.style.width = "0%";

    modal.classList.add("active");

    // Animate progress bar over 5 seconds
    clearInterval(this.storyTimer);
    let progress = 0;
    this.storyTimer = setInterval(() => {
      progress += 2;
      fill.style.width = progress + "%";
      if (progress >= 100) {
        clearInterval(this.storyTimer);
        if (this.activeStoryIndex < stories.length - 1) {
          this.openStoryViewer(this.activeStoryIndex + 1);
        } else {
          this.closeStoryViewer();
        }
      }
    }, 100);
  },

  closeStoryViewer() {
    clearInterval(this.storyTimer);
    const modal = document.getElementById("storyViewerModal");
    if (modal) modal.classList.remove("active");
  },

  createStory(mediaUrl) {
    const user = Auth.requireAuth();
    if (!user) return;

    if (!mediaUrl) {
      Utils.showToast("Please provide or upload a photo/video for your story.", "warning");
      return;
    }

    const stories = FacelookConfig.getLocalCollection("stories") || [];
    const newStory = {
      id: "story_" + Date.now(),
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar,
      mediaUrl: mediaUrl,
      createdAt: Date.now(),
      expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
    };

    stories.unshift(newStory);
    FacelookConfig.setLocalCollection("stories", stories);
    Utils.showToast("Story shared with your friends!");
    this.renderStories();
  }
};

window.Stories = Stories;
