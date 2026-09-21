/**
 * FACELOOK COMMENTS CONTROLLER
 */

const Comments = {
  focusCommentInput(postId) {
    const input = document.getElementById(`comment-input-${postId}`);
    if (input) {
      input.focus();
      input.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  },

  handleKey(e, postId) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      this.addComment(postId);
    }
  },

  addComment(postId) {
    const user = Auth.requireAuth();
    if (!user) return;

    const input = document.getElementById(`comment-input-${postId}`);
    if (!input) return;

    const text = input.value.trim();
    if (!text) return;

    const comments = FacelookConfig.getLocalCollection("comments") || [];
    const newComment = {
      id: "comment_" + Date.now(),
      postId: postId,
      authorId: user.id,
      authorName: user.name,
      authorAvatar: user.avatar,
      text: text,
      createdAt: Date.now()
    };

    comments.push(newComment);
    FacelookConfig.setLocalCollection("comments", comments);

    input.value = "";
    
    // Append to list dynamically
    const list = document.getElementById(`comments-list-${postId}`);
    if (list) {
      list.insertAdjacentHTML("beforeend", this.renderCommentItem(newComment));
    }
    Utils.showToast("Comment posted!");
  },

  renderCommentItem(comment) {
    return `
      <div class="comment-item" id="comment-${comment.id}">
        <img src="${comment.authorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}" class="user-avatar" style="width:32px; height:32px;">
        <div>
          <div class="comment-bubble">
            <a href="profile.html?id=${comment.authorId}" class="comment-author">${Utils.escapeHtml(comment.authorName)}</a>
            <div class="comment-text">${Utils.escapeHtml(comment.text)}</div>
          </div>
          <div class="comment-actions">
            <span>Like</span>
            <span>Reply</span>
            <span>${Utils.formatTimeAgo(comment.createdAt)}</span>
          </div>
        </div>
      </div>
    `;
  }
};

window.Comments = Comments;
