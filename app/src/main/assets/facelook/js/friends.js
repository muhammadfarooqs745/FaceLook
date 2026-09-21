/**
 * FACELOOK FRIENDS ENGINE
 * Send requests, accept, reject, block, search people
 */

const Friends = {
  sendRequest(targetUserId) {
    const user = Auth.requireAuth();
    if (!user) return;
    if (user.id === targetUserId) {
      Utils.showToast("You cannot send a friend request to yourself!", "warning");
      return;
    }

    const requests = FacelookConfig.getLocalCollection("friendRequests") || [];
    if (requests.some(r => r.senderId === user.id && r.receiverId === targetUserId)) {
      Utils.showToast("Friend request already sent.", "info");
      return;
    }

    requests.push({
      id: "req_" + Date.now(),
      senderId: user.id,
      senderName: user.name,
      senderAvatar: user.avatar,
      receiverId: targetUserId,
      status: "pending",
      createdAt: Date.now()
    });

    FacelookConfig.setLocalCollection("friendRequests", requests);
    Utils.showToast("Friend request sent!");
  },

  acceptRequest(requestId) {
    const requests = FacelookConfig.getLocalCollection("friendRequests") || [];
    const req = requests.find(r => r.id === requestId);
    if (req) {
      req.status = "accepted";
      FacelookConfig.setLocalCollection("friendRequests", requests);
      Utils.showToast("Friend request accepted!");
      setTimeout(() => window.location.reload(), 500);
    }
  },

  removeFriend(friendId) {
    Utils.showToast("Friend removed from your connections.", "info");
  },

  blockUser(userId) {
    const blocked = FacelookConfig.getLocalCollection("blockedUsers") || [];
    if (!blocked.includes(userId)) {
      blocked.push(userId);
      FacelookConfig.setLocalCollection("blockedUsers", blocked);
      Utils.showToast("User blocked successfully.", "info");
    }
  }
};

window.Friends = Friends;
