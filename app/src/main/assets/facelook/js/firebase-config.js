/**
 * FACELOOK - FIREBASE CONFIGURATION & HYBRID STORAGE ENGINE
 * Supports real Firebase Auth, Firestore, and Storage with automatic seamless fallback.
 */

// Replace these values with your actual Firebase project settings from the Firebase Console:
const firebaseConfig = {
  apiKey: "AIzaSyDummyKeyForFacelookDemoApplicationPlatform",
  authDomain: "facelook-social-app.firebaseapp.com",
  projectId: "facelook-social-app",
  storageBucket: "facelook-social-app.appspot.com",
  messagingSenderId: "193682508214",
  appId: "1:193682508214:web:635b42ea2c24417f8a3372"
};

// Check if Firebase is available in the window or module
let isFirebaseInitialized = false;
let fbAuth = null;
let fbDb = null;
let fbStorage = null;

try {
  if (typeof firebase !== 'undefined') {
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    fbAuth = firebase.auth();
    fbDb = firebase.firestore();
    fbStorage = firebase.storage();
    isFirebaseInitialized = true;
    console.log("Facelook: Firebase initialized successfully.");
  }
} catch (e) {
  console.warn("Facelook: Firebase live service unavailable, running in local persistence mode.", e);
}

// LOCAL PERSISTENT REPOSITORY (FALLBACK & SEED DATA)
const LOCAL_STORAGE_KEY_PREFIX = "facelook_data_";

function getLocalCollection(collectionName) {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_PREFIX + collectionName);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function setLocalCollection(collectionName, data) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_PREFIX + collectionName, JSON.stringify(data));
  } catch (e) {
    console.error("Storage save failed", e);
  }
}

// SEED SAMPLE INITIAL DATA IF EMPTY
function initializeDefaultData() {
  if (!getLocalCollection("users")) {
    const defaultUsers = [
      {
        id: "user_mark",
        name: "Mark Zuckerberg",
        username: "zuck",
        email: "zuck@facelook.com",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        cover: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80",
        bio: "Building the future of human connection at Facelook 🚀",
        work: "Founder & CEO at Facelook",
        lives: "Palo Alto, California",
        from: "White Plains, New York",
        role: "admin",
        verified: true,
        friendsCount: 1420,
        createdAt: Date.now() - 100000000
      },
      {
        id: "user_sarah",
        name: "Sarah Jenkins",
        username: "sarah_j",
        email: "sarah@gmail.com",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        cover: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&auto=format&fit=crop&q=80",
        bio: "Photographer, coffee enthusiast, and wanderlust traveler ☕📷",
        work: "Visual Designer at PixelCraft",
        lives: "San Francisco, CA",
        role: "user",
        verified: false,
        friendsCount: 684,
        createdAt: Date.now() - 50000000
      },
      {
        id: "user_alex",
        name: "Alex Rivera",
        username: "alex_code",
        email: "alex@tech.io",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        cover: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80",
        bio: "Full stack developer & open source contributor. Kotlin & JavaScript lover.",
        work: "Senior Engineer at CloudCorp",
        lives: "Austin, Texas",
        role: "user",
        verified: true,
        friendsCount: 912,
        createdAt: Date.now() - 40000000
      }
    ];
    setLocalCollection("users", defaultUsers);
  }

  if (!getLocalCollection("posts")) {
    const defaultPosts = [
      {
        id: "post_1",
        authorId: "user_mark",
        authorName: "Mark Zuckerberg",
        authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        content: "Excited to welcome everyone to Facelook! We built this platform from the ground up for seamless, responsive social connection across mobile, tablet, and desktop devices. What features would you like to see next? 🌐✨",
        mediaUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
        mediaType: "image",
        audience: "public",
        likesCount: 142,
        userReactions: { "user_alex": "love", "user_sarah": "like" },
        createdAt: Date.now() - 7200000,
        commentsCount: 12
      },
      {
        id: "post_2",
        authorId: "user_sarah",
        authorName: "Sarah Jenkins",
        authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        content: "Golden hour in the Pacific Northwest. There is nothing quite like breathing fresh pine air after a long week of design work 🌲🌅",
        mediaUrl: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
        mediaType: "image",
        audience: "public",
        likesCount: 88,
        userReactions: { "user_mark": "wow" },
        createdAt: Date.now() - 14400000,
        commentsCount: 5
      }
    ];
    setLocalCollection("posts", defaultPosts);
  }

  if (!getLocalCollection("stories")) {
    const defaultStories = [
      {
        id: "story_1",
        authorId: "user_mark",
        authorName: "Mark Zuckerberg",
        authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        mediaUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=500&auto=format&fit=crop&q=80",
        createdAt: Date.now() - 3600000,
        expiresAt: Date.now() + 82800000
      },
      {
        id: "story_2",
        authorId: "user_sarah",
        authorName: "Sarah Jenkins",
        authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        mediaUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&auto=format&fit=crop&q=80",
        createdAt: Date.now() - 7200000,
        expiresAt: Date.now() + 79200000
      }
    ];
    setLocalCollection("stories", defaultStories);
  }

  if (!getLocalCollection("comments")) {
    const defaultComments = [
      {
        id: "comment_1",
        postId: "post_1",
        authorId: "user_alex",
        authorName: "Alex Rivera",
        authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        text: "The responsive layout and dark mode look incredible!",
        createdAt: Date.now() - 3600000
      },
      {
        id: "comment_2",
        postId: "post_1",
        authorId: "user_sarah",
        authorName: "Sarah Jenkins",
        authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        text: "Loving the smooth popups and real-time chat feel 🙌",
        createdAt: Date.now() - 1800000
      }
    ];
    setLocalCollection("comments", defaultComments);
  }

  if (!getLocalCollection("conversations")) {
    const defaultConversations = [
      {
        id: "conv_1",
        participants: ["user_mark", "user_sarah"],
        participantNames: { "user_mark": "Mark Zuckerberg", "user_sarah": "Sarah Jenkins" },
        participantAvatars: {
          "user_mark": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          "user_sarah": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
        },
        lastMessage: "Hey Sarah! How is the new gallery post doing?",
        lastSenderId: "user_mark",
        updatedAt: Date.now() - 1200000,
        unread: false
      }
    ];
    setLocalCollection("conversations", defaultConversations);
  }

  if (!getLocalCollection("messages")) {
    const defaultMessages = [
      {
        id: "msg_1",
        conversationId: "conv_1",
        senderId: "user_mark",
        text: "Hey Sarah! How is the new gallery post doing?",
        createdAt: Date.now() - 1200000
      }
    ];
    setLocalCollection("messages", defaultMessages);
  }

  if (!getLocalCollection("notifications")) {
    const defaultNotifications = [
      {
        id: "notif_1",
        recipientId: "user_mark",
        senderName: "Sarah Jenkins",
        senderAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
        type: "reaction",
        text: "reacted to your post: 'Excited to welcome everyone...'",
        targetUrl: "post.html?id=post_1",
        read: false,
        createdAt: Date.now() - 3600000
      },
      {
        id: "notif_2",
        recipientId: "user_mark",
        senderName: "Alex Rivera",
        senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        type: "comment",
        text: "commented on your post: 'The responsive layout...'",
        targetUrl: "post.html?id=post_1",
        read: false,
        createdAt: Date.now() - 1800000
      }
    ];
    setLocalCollection("notifications", defaultNotifications);
  }
}

initializeDefaultData();

window.FacelookConfig = {
  firebaseConfig,
  isFirebaseInitialized,
  getLocalCollection,
  setLocalCollection
};
