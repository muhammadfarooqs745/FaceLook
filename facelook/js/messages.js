/**
 * FACELOOK MESSENGER CONTROLLER
 */

const Messages = {
  activeConversationId: "conv_1",

  init() {
    this.renderConversationList();
    this.loadActiveConversation();
  },

  renderConversationList() {
    const container = document.getElementById("conversationsList");
    if (!container) return;

    const user = Auth.getCurrentUser();
    const conversations = FacelookConfig.getLocalCollection("conversations") || [];

    if (conversations.length === 0) {
      container.innerHTML = `<div class="p-16 text-muted text-center">No messages yet.</div>`;
      return;
    }

    container.innerHTML = conversations.map(c => {
      const otherId = c.participants.find(p => p !== user.id) || c.participants[0];
      const otherName = c.participantNames ? c.participantNames[otherId] : "Friend";
      const otherAvatar = c.participantAvatars ? c.participantAvatars[otherId] : "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150";

      return `
        <div class="conversation-item ${c.id === this.activeConversationId ? 'active' : ''} ${c.unread ? 'unread' : ''}" onclick="Messages.selectConversation('${c.id}')">
          <div class="conversation-avatar-box">
            <img src="${otherAvatar}" class="user-avatar" alt="${Utils.escapeHtml(otherName)}">
            <div class="online-dot"></div>
          </div>
          <div class="conversation-info">
            <div class="conversation-name">
              <span>${Utils.escapeHtml(otherName)}</span>
              <span class="conversation-time">${Utils.formatTimeAgo(c.updatedAt)}</span>
            </div>
            <div class="conversation-snippet">${Utils.escapeHtml(c.lastMessage || 'Sent an attachment')}</div>
          </div>
        </div>
      `;
    }).join("");
  },

  selectConversation(convId) {
    this.activeConversationId = convId;
    this.renderConversationList();
    this.loadActiveConversation();
  },

  loadActiveConversation() {
    const chatContainer = document.getElementById("chatMessages");
    const nameEl = document.getElementById("chatHeaderName");
    if (!chatContainer) return;

    const user = Auth.getCurrentUser();
    const conversations = FacelookConfig.getLocalCollection("conversations") || [];
    const conv = conversations.find(c => c.id === this.activeConversationId);
    
    if (conv && nameEl) {
      const otherId = conv.participants.find(p => p !== user.id) || conv.participants[0];
      nameEl.textContent = conv.participantNames ? conv.participantNames[otherId] : "Facelook Friend";
    }

    const messages = (FacelookConfig.getLocalCollection("messages") || []).filter(m => m.conversationId === this.activeConversationId);

    chatContainer.innerHTML = messages.map(m => {
      const isSent = m.senderId === user.id;
      return `
        <div class="chat-message-row ${isSent ? 'sent' : 'received'}">
          <div class="chat-bubble">
            ${m.text ? Utils.escapeHtml(m.text) : ''}
            ${m.mediaUrl ? `<img src="${m.mediaUrl}" alt="Media">` : ''}
          </div>
        </div>
      `;
    }).join("");

    chatContainer.scrollTop = chatContainer.scrollHeight;
  },

  sendMessage() {
    const input = document.getElementById("chatInputField");
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    const user = Auth.getCurrentUser();
    const messages = FacelookConfig.getLocalCollection("messages") || [];
    const newMsg = {
      id: "msg_" + Date.now(),
      conversationId: this.activeConversationId,
      senderId: user.id,
      text: text,
      createdAt: Date.now()
    };

    messages.push(newMsg);
    FacelookConfig.setLocalCollection("messages", messages);

    // Update conversation snippet
    const conversations = FacelookConfig.getLocalCollection("conversations") || [];
    const conv = conversations.find(c => c.id === this.activeConversationId);
    if (conv) {
      conv.lastMessage = text;
      conv.updatedAt = Date.now();
      FacelookConfig.setLocalCollection("conversations", conversations);
    }

    input.value = "";
    this.loadActiveConversation();
    this.renderConversationList();

    // Auto-reply simulation for interactive experience
    setTimeout(() => {
      const replies = [
        "Sounds great! Looking forward to it 😊",
        "Haha totally agree with you on that!",
        "Thanks for sharing, checking it out now 👍",
        "Awesome! Facelook is super responsive."
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      messages.push({
        id: "msg_" + Date.now(),
        conversationId: this.activeConversationId,
        senderId: "user_sarah",
        text: randomReply,
        createdAt: Date.now()
      });
      FacelookConfig.setLocalCollection("messages", messages);
      this.loadActiveConversation();
      this.renderConversationList();
    }, 1500);
  }
};

window.Messages = Messages;
