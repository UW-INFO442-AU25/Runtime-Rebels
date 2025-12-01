import React, { useState, useEffect } from "react";
import { Calendar, Send, Trash2, X, Inbox as InboxIcon, Mail } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import { ref, onValue } from "firebase/database";
import { auth, db } from "../firebase";
import {
  subscribeToInbox,
  subscribeToSent,
  sendMessage,
  markAsRead,
  deleteMessage,
} from "../services/messageService";
import "../index.css";

export default function Inbox() {
  const [currentUser, setCurrentUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState("inbox");
  const [showCompose, setShowCompose] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [composeData, setComposeData] = useState({
    recipientId: "",
    subject: "",
    body: "",
  });
  const [sending, setSending] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (!user) {
        setLoading(false);
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    const usersRef = ref(db, "users");
    const unsub = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const usersList = Object.entries(data).map(([uid, userData]) => ({
          uid,
          name: userData.name || userData.email || "Unknown User",
          email: userData.email,
        }));
        setAllUsers(usersList);
      }
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    setLoading(true);
    const unsub = subscribeToInbox(currentUser.uid, (msgs) => {
      setMessages(msgs);
      setLoading(false);
      if (msgs.length > 0 && selected === null) {
        setSelected(0);
      }
    });

    return unsub;
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;

    const unsub = subscribeToSent(currentUser.uid, (msgs) => {
      setSentMessages(msgs);
    });

    return unsub;
  }, [currentUser]);

  const displayedMessages = view === "inbox" ? messages : sentMessages;
  const selectedMessage = displayedMessages[selected];

  const handleSelectMessage = async (index) => {
    setSelected(index);
    const msg = displayedMessages[index];

    if (view === "inbox" && !msg.read) {
      try {
        await markAsRead(msg.id);
      } catch (err) {
        console.error("Error marking as read:", err);
      }
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!composeData.recipientId || !composeData.subject || !composeData.body) {
      alert("Please fill in all fields");
      return;
    }

    setSending(true);
    try {
      const recipient = allUsers.find((u) => u.uid === composeData.recipientId);
      await sendMessage({
        senderId: currentUser.uid,
        senderName: currentUser.displayName || currentUser.email,
        recipientId: composeData.recipientId,
        recipientName: recipient?.name || "Unknown",
        subject: composeData.subject,
        body: composeData.body,
      });

      setComposeData({ recipientId: "", subject: "", body: "" });
      setShowCompose(false);
    } catch (err) {
      console.error("Error sending message:", err);
      alert("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (messageId) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    try {
      await deleteMessage(messageId);
      setSelected(null);
    } catch (err) {
      console.error("Error deleting message:", err);
    }
  };

  const formatTime = (date) => {
    if (!date) return "";
    const now = new Date();
    const msgDate = new Date(date);

    if (msgDate.toDateString() === now.toDateString()) {
      return msgDate.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    }

    if (msgDate.getFullYear() === now.getFullYear()) {
      return msgDate.toLocaleDateString([], { month: "short", day: "numeric" });
    }

    return msgDate.toLocaleDateString();
  };

  if (!currentUser) {
    return (
      <div className="inbox-page">
        <div className="inbox-empty" role="status" aria-live="polite">
          <p>
            Please <a href="/login">log in</a> to view your inbox.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="inbox-page"
      aria-label="Messaging inbox page"
    >
      {/* === SIDEBAR === */}
      <aside
        className="inbox-sidebar"
        aria-labelledby="inbox-heading"
      >
        <div className="inbox-header">
          <h2 id="inbox-heading">Inbox</h2>
          <button
            className="inbox-btn"
            onClick={() => setShowCompose(true)}
            aria-label="Compose new message"
          >
            New Mail
          </button>
        </div>

        <input
          className="inbox-search"
          type="text"
          placeholder="Search"
          aria-label="Search messages"
        />

        <div
          className="inbox-tabs"
          role="group"
          aria-label="Inbox and sent message views"
        >
          <button
            className={`inbox-tab ${view === "inbox" ? "active" : ""}`}
            onClick={() => {
              setView("inbox");
              setSelected(0);
            }}
            aria-pressed={view === "inbox"}
          >
            <InboxIcon size={16} /> Inbox ({messages.filter((m) => !m.read).length})
          </button>
          <button
            className={`inbox-tab ${view === "sent" ? "active" : ""}`}
            onClick={() => {
              setView("sent");
              setSelected(0);
            }}
            aria-pressed={view === "sent"}
          >
            <Send size={16} /> Sent
          </button>
        </div>

        {loading ? (
          <p className="inbox-loading" role="status" aria-live="polite">
            Loading messages...
          </p>
        ) : displayedMessages.length === 0 ? (
          <p className="inbox-empty-list" role="status" aria-live="polite">
            No messages yet.
          </p>
        ) : (
          <ul
            className="inbox-list"
            aria-label={view === "inbox" ? "Inbox messages" : "Sent messages"}
          >
            {displayedMessages.map((msg, i) => (
              <li
                key={msg.id}
                className={`inbox-item ${selected === i ? "active" : ""} ${
                  !msg.read && view === "inbox" ? "unread" : ""
                }`}
                onClick={() => handleSelectMessage(i)}
                aria-current={selected === i ? "true" : undefined}
                aria-label={
                  view === "inbox"
                    ? `${msg.read ? "" : "Unread message. "}From ${msg.senderName}. Subject: ${msg.subject}.`
                    : `To ${msg.recipientName}. Subject: ${msg.subject}.`
                }
              >
                <div className="inbox-avatar">
                  {(view === "inbox" ? msg.senderName : msg.recipientName)?.[0]?.toUpperCase() || "?"}
                </div>
                <div className="inbox-info">
                  <div className="inbox-top">
                    <span className="inbox-sender">
                      {view === "inbox" ? msg.senderName : `To: ${msg.recipientName}`}
                    </span>
                    <span className="inbox-time">{formatTime(msg.createdAt)}</span>
                  </div>
                  <p className="inbox-subject">{msg.subject}</p>
                  <p className="inbox-preview">{msg.body?.slice(0, 50)}...</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </aside>

      {/* === MAIN PANEL === */}
      <main
        className="inbox-content"
        aria-label="Message content"
      >
        {selectedMessage ? (
          <div
            className="inbox-message"
            role="group"
            aria-labelledby="message-subject"
          >
            <div className="inbox-message-header">
              <h3 id="message-subject">{selectedMessage.subject}</h3>
              <button
                className="inbox-delete-btn"
                onClick={() => handleDelete(selectedMessage.id)}
                title="Delete message"
                aria-label="Delete this message"
              >
                <Trash2 size={18} />
              </button>
            </div>
            <p className="inbox-message-meta">
              {view === "inbox" ? (
                <>
                  From: <strong>{selectedMessage.senderName}</strong>
                </>
              ) : (
                <>
                  To: <strong>{selectedMessage.recipientName}</strong>
                </>
              )}
              {" · "}
              {selectedMessage.createdAt?.toLocaleString()}
            </p>
            <div className="inbox-message-body">
              <p>{selectedMessage.body}</p>
            </div>
          </div>
        ) : (
          <div
            className="inbox-no-selection"
            role="status"
            aria-live="polite"
          >
            <Mail size={48} aria-hidden="true" />
            <p>Select a message to read</p>
          </div>
        )}
      </main>

      {showCompose && (
        <div
          className="inbox-modal-overlay"
          onClick={() => setShowCompose(false)}
        >
          <div
            className="inbox-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="compose-dialog-title"
          >
            <div className="inbox-modal-header">
              <h3 id="compose-dialog-title">New Message</h3>
              <button
                className="inbox-modal-close"
                onClick={() => setShowCompose(false)}
                aria-label="Close compose window"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSend}
              className="inbox-compose-form"
              aria-label="Compose new message form"
            >
              <div className="inbox-form-field">
                <label htmlFor="compose-to">To:</label>
                <select
                  id="compose-to"
                  value={composeData.recipientId}
                  onChange={(e) =>
                    setComposeData({ ...composeData, recipientId: e.target.value })
                  }
                  required
                >
                  <option value="">Select recipient...</option>
                  {allUsers
                    .filter((u) => u.uid !== currentUser.uid)
                    .map((user) => (
                      <option key={user.uid} value={user.uid}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                </select>
              </div>

              <div className="inbox-form-field">
                <label htmlFor="compose-subject">Subject:</label>
                <input
                  id="compose-subject"
                  type="text"
                  value={composeData.subject}
                  onChange={(e) =>
                    setComposeData({ ...composeData, subject: e.target.value })
                  }
                  placeholder="Enter subject..."
                  required
                />
              </div>

              <div className="inbox-form-field">
                <label htmlFor="compose-body">Message:</label>
                <textarea
                  id="compose-body"
                  value={composeData.body}
                  onChange={(e) =>
                    setComposeData({ ...composeData, body: e.target.value })
                  }
                  placeholder="Write your message..."
                  rows={6}
                  required
                />
              </div>

              <div className="inbox-form-actions">
                <button
                  type="button"
                  onClick={() => setShowCompose(false)}
                  className="inbox-btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inbox-btn"
                  disabled={sending}
                  aria-busy={sending}
                >
                  {sending ? "Sending..." : "Send"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
