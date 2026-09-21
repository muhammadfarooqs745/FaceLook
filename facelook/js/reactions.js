/**
 * FACELOOK REACTIONS ENGINE
 * Facebook-style reactions: Like, Love, Care, Haha, Wow, Sad, Angry
 */

const Reactions = {
  getReactionIcon(reaction) {
    switch (reaction) {
      case "love": return "❤️";
      case "care": return "🤗";
      case "haha": return "😂";
      case "wow": return "😮";
      case "sad": return "😢";
      case "angry": return "😡";
      default: return "👍";
    }
  },

  getReactionLabel(reaction) {
    if (!reaction) return "Like";
    return reaction.charAt(0).toUpperCase() + reaction.slice(1);
  },

  toggleLike(postId) {
    const user = Auth.requireAuth();
    if (!user) return;

    const posts = FacelookConfig.getLocalCollection("posts") || [];
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    if (!post.userReactions) post.userReactions = {};

    if (post.userReactions[user.id]) {
      delete post.userReactions[user.id];
      post.likesCount = Math.max(0, (post.likesCount || 1) - 1);
    } else {
      post.userReactions[user.id] = "like";
      post.likesCount = (post.likesCount || 0) + 1;
    }

    FacelookConfig.setLocalCollection("posts", posts);
    Posts.renderFeed();
  },

  setReaction(postId, reactionType) {
    const user = Auth.requireAuth();
    if (!user) return;

    const posts = FacelookConfig.getLocalCollection("posts") || [];
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    if (!post.userReactions) post.userReactions = {};

    const hadPrevious = !!post.userReactions[user.id];
    post.userReactions[user.id] = reactionType;
    if (!hadPrevious) {
      post.likesCount = (post.likesCount || 0) + 1;
    }

    FacelookConfig.setLocalCollection("posts", posts);
    Utils.showToast(`Reacted with ${this.getReactionIcon(reactionType)}`);
    Posts.renderFeed();
  }
};

window.Reactions = Reactions;
