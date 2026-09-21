/**
 * FACELOOK POSTS & FEED CONTROLLER
 */

const Posts = {
  // Render Feed
  renderFeed(containerId = "feedContainer") {
    const container = document.getElementById(containerId);
    if (!container) return;

    const posts = FacelookConfig.getLocalCollection("posts") || [];
    const currentUser = Auth.getCurrentUser();

    if (posts.length === 0) {
      container.innerHTML = `
        <div class="card p-16 text-center text-muted">
          <h3>No posts in your feed yet</h3>
          <p class="mt-12">Be the first to share an update, photo, or thought with friends!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = posts.map(post => this.renderPostCard(post, currentUser)).join("");
  },

  renderPostCard(post, currentUser) {
    const isOwner = currentUser && post.authorId === currentUser.id;
    const userReaction = post.userReactions && currentUser ? post.userReactions[currentUser.id] : null;

    let mediaHtml = "";
    if (post.mediaUrl) {
      if (post.mediaType === "video") {
        mediaHtml = `
          <div class="post-media-container">
            <video src="${post.mediaUrl}" controls playsinline></video>
          </div>
        `;
      } else {
        mediaHtml = `
          <div class="post-media-container" onclick="App.openMediaViewer('${post.mediaUrl}', 'image')">
            <img src="${post.mediaUrl}" alt="Post image" loading="lazy">
          </div>
        `;
      }
    }

    const comments = (FacelookConfig.getLocalCollection("comments") || []).filter(c => c.postId === post.id);

    return `
      <article class="feed-post" id="post-${post.id}">
        <header class="post-header">
          <div class="post-author-info">
            <img src="${post.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}" class="user-avatar" alt="${Utils.escapeHtml(post.authorName)}">
            <div>
              <a href="profile.html?id=${post.authorId}" class="post-author-name">${Utils.escapeHtml(post.authorName)}</a>
              <div class="post-metadata">
                <span>${Utils.formatTimeAgo(post.createdAt)}</span>
                <span>•</span>
                <span>${post.audience === 'public' ? '🌐 Public' : post.audience === 'friends' ? '👥 Friends' : '🔒 Only me'}</span>
              </div>
            </div>
          </div>
          <div style="position:relative;">
            <button class="post-options-btn" onclick="App.togglePostMenu('${post.id}')" aria-label="Post options">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="5" cy="12" r="2"></circle>
                <circle cx="12" cy="12" r="2"></circle>
                <circle cx="19" cy="12" r="2"></circle>
              </svg>
            </button>
            <div id="post-menu-${post.id}" class="dropdown-menu">
              ${isOwner ? `
                <div class="dropdown-item" onclick="App.openEditPostModal('${post.id}')">✏️ Edit Post</div>
                <div class="dropdown-item" style="color:var(--danger);" onclick="App.openDeletePostModal('${post.id}')">🗑️ Delete Post</div>
              ` : `
                <div class="dropdown-item" onclick="Posts.savePost('${post.id}')">🔖 Save Post</div>
                <div class="dropdown-item" style="color:var(--danger);" onclick="App.openReportPostModal('${post.id}')">🚩 Report Post</div>
              `}
            </div>
          </div>
        </header>

        <div class="post-caption">${Utils.escapeHtml(post.content)}</div>
        ${mediaHtml}

        <div class="post-stats">
          <div class="reactions-count">
            <span id="post-reaction-count-${post.id}">👍 ❤️ ${post.likesCount || 0}</span>
          </div>
          <div class="comments-shares-count">
            <span>${comments.length} comments</span>
            <span>1 share</span>
          </div>
        </div>

        <div class="post-actions">
          <button class="post-action-btn ${userReaction ? 'active-' + userReaction : ''}" id="react-btn-${post.id}" onclick="Reactions.toggleLike('${post.id}')">
            <!-- HOVER REACTION DOCK -->
            <div class="reaction-dock">
              <span class="reaction-dock-item" onclick="event.stopPropagation(); Reactions.setReaction('${post.id}', 'like')">👍</span>
              <span class="reaction-dock-item" onclick="event.stopPropagation(); Reactions.setReaction('${post.id}', 'love')">❤️</span>
              <span class="reaction-dock-item" onclick="event.stopPropagation(); Reactions.setReaction('${post.id}', 'care')">🤗</span>
              <span class="reaction-dock-item" onclick="event.stopPropagation(); Reactions.setReaction('${post.id}', 'haha')">😂</span>
              <span class="reaction-dock-item" onclick="event.stopPropagation(); Reactions.setReaction('${post.id}', 'wow')">😮</span>
              <span class="reaction-dock-item" onclick="event.stopPropagation(); Reactions.setReaction('${post.id}', 'sad')">😢</span>
              <span class="reaction-dock-item" onclick="event.stopPropagation(); Reactions.setReaction('${post.id}', 'angry')">😡</span>
            </div>
            <span>${Reactions.getReactionIcon(userReaction)}</span>
            <span>${Reactions.getReactionLabel(userReaction)}</span>
          </button>

          <button class="post-action-btn" onclick="Comments.focusCommentInput('${post.id}')">
            <span>💬</span>
            <span>Comment</span>
          </button>

          <button class="post-action-btn" onclick="App.openShareModal('${post.id}')">
            <span>↗️</span>
            <span>Share</span>
          </button>
        </div>

        <!-- COMMENTS AREA -->
        <section class="post-comments-area">
          <div class="comment-input-row">
            <img src="${currentUser ? currentUser.avatar : 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}" class="user-avatar" style="width:32px; height:32px;">
            <div class="comment-input-box">
              <textarea id="comment-input-${post.id}" placeholder="Write a comment..." onkeydown="Comments.handleKey(event, '${post.id}')"></textarea>
              <div class="comment-submit-btn" onclick="Comments.addComment('${post.id}')">Send</div>
            </div>
          </div>
          <div class="comments-list" id="comments-list-${post.id}">
            ${comments.map(c => Comments.renderCommentItem(c)).join("")}
          </div>
        </section>
      </article>
    `;
  },

  // Create New Post
  createPost(content, mediaUrl, mediaType = "image", audience = "public") {
    const user = Auth.requireAuth();
    if (!user) return;

    if (!content.trim() && !mediaUrl) {
      Utils.showToast("Post content or media is required", "warning");
      return;
    }

    const posts = FacelookConfig.getLocalCollection("posts") || [];
    const newPost = {
      id: "post_" + Date.now(),
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar,
      content: content.trim(),
      mediaUrl: mediaUrl || null,
      mediaType: mediaType,
      audience: audience,
      likesCount: 0,
      userReactions: {},
      createdAt: Date.now(),
      commentsCount: 0
    };

    posts.unshift(newPost);
    FacelookConfig.setLocalCollection("posts", posts);
    Utils.showToast("Your post has been published!");
    this.renderFeed();
  },

  // Save Post
  savePost(postId) {
    const user = Auth.getCurrentUser();
    if (!user) return;
    const saved = FacelookConfig.getLocalCollection("savedPosts") || [];
    if (!saved.some(s => s.postId === postId && s.userId === user.id)) {
      saved.push({ id: "save_" + Date.now(), postId, userId: user.id, savedAt: Date.now() });
      FacelookConfig.setLocalCollection("savedPosts", saved);
      Utils.showToast("Post saved to your bookmarks!");
    } else {
      Utils.showToast("Post is already in your saved items.");
    }
  }
};

window.Posts = Posts;
