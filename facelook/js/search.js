/**
 * FACELOOK SEARCH CONTROLLER
 */

const Search = {
  performSearch(query, filter = "all") {
    const q = query.trim().toLowerCase();
    if (!q) return [];

    const users = FacelookConfig.getLocalCollection("users") || [];
    const posts = FacelookConfig.getLocalCollection("posts") || [];

    const matchedUsers = users.filter(u => 
      u.name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q)
    );

    const matchedPosts = posts.filter(p =>
      p.content.toLowerCase().includes(q) || p.authorName.toLowerCase().includes(q)
    );

    return { users: matchedUsers, posts: matchedPosts };
  }
};

window.Search = Search;
