import React, { useState, useEffect } from "react";
import {
  ThumbsUp,
  MessageCircle,
  Plus,
  Clock,
  TrendingUp,
  MapPin,
  Info,
} from "lucide-react";

import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  addDoc,
  increment,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";

import { auth, db1 } from "../firebase";
import "../index.css";

export default function CommunityDiscussions() {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostTags, setNewPostTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const [sortMode, setSortMode] = useState("recent"); // recent | trending
  const [openComments, setOpenComments] = useState({});
  const [commentsByPost, setCommentsByPost] = useState({});
  const [newCommentText, setNewCommentText] = useState({});


  /* ------------------------- AUTH TRACKING ------------------------- */
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user || null);
    });
    return () => unsub();
  }, []);

  /* ------------------------- LOAD POSTS ------------------------- */
  useEffect(() => {
    if (!currentUser) return;

    const q =
      sortMode === "recent"
        ? query(collection(db1, "posts"), orderBy("createdAt", "desc"))
        : query(collection(db1, "posts"), orderBy("likes", "desc"));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const postsList = await Promise.all(
        snapshot.docs.map(async (docSnap) => {
          const data = docSnap.data();

          const likeSnap = await getDoc(
            doc(db1, "posts", docSnap.id, "likes", currentUser.uid)
          );

          return {
            id: docSnap.id,
            ...data,
            likedByCurrentUser: likeSnap.exists(),
          };
        })
      );

      setPosts(postsList);
    });

    return () => unsubscribe();
  }, [sortMode, currentUser]);

  /* ------------------------- CREATE POST ------------------------- */
  const handlePost = async () => {
    if (!currentUser || newPostContent.trim() === "") return;

    const newPost = {
      category: newPostTags.length ? newPostTags : ["General"],
      author: currentUser.displayName || currentUser.email,
      uid: currentUser.uid,
      content: newPostContent.trim(),
      likes: 0,
      comments: 0,
      createdAt: serverTimestamp(),
    };

    try {
      await addDoc(collection(db1, "posts"), newPost);
      setNewPostContent("");
      setNewPostTags([]);
      setTagInput("");
      setShowForm(false);
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };

  /* ------------------------- DELETE POST ------------------------- */
  const handleDelete = async (postId) => {
    if (!currentUser) return;
    if (!window.confirm("Delete this post?")) return;

    try {
      await deleteDoc(doc(db1, "posts", postId));
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  /* ------------------------- TOGGLE LIKE ------------------------- */
  const handleLike = async (post) => {
    if (!currentUser) return;
    if (post.uid === currentUser.uid) return alert("You cannot like your own post!");

    const postRef = doc(db1, "posts", post.id);
    const likeRef = doc(db1, "posts", post.id, "likes", currentUser.uid);

    try {
      if (post.likedByCurrentUser) {
        // Only decrement if likes > 0
        const newLikes = Math.max(post.likes - 1, 0);

        await deleteDoc(likeRef);
        await updateDoc(postRef, { likes: newLikes });

        setPosts((prev) =>
          prev.map((p) =>
            p.id === post.id
              ? { ...p, likes: newLikes, likedByCurrentUser: false }
              : p
          )
        );
      } else {
        await setDoc(likeRef, { likedAt: serverTimestamp() });
        await updateDoc(postRef, { likes: increment(1) });

        setPosts((prev) =>
          prev.map((p) =>
            p.id === post.id
              ? { ...p, likes: p.likes + 1, likedByCurrentUser: true }
              : p
          )
        );
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  /* ------------------------- COMMENTS ------------------------- */
  const loadComments = async (postId) => {
    try {
      const q = query(
        collection(db1, "posts", postId, "comments"),
        orderBy("createdAt", "asc")
      );
      const snap = await getDocs(q);
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setCommentsByPost((prev) => ({ ...prev, [postId]: list }));
    } catch (err) {
      console.error("Error loading comments:", err);
    }
  };

  const toggleComments = async (postId) => {
    const isOpen = !!openComments[postId];
    if (!isOpen && !commentsByPost[postId]) {
      await loadComments(postId);
    }
    setOpenComments((prev) => ({ ...prev, [postId]: !isOpen }));
  };

  const handleAddComment = async (postId) => {
    if (!currentUser) return;

    const text = (newCommentText[postId] || "").trim();
    if (!text) return;

    const comment = {
      uid: currentUser.uid,
      author: currentUser.displayName || currentUser.email,
      text,
      createdAt: serverTimestamp(),
    };

    try {
      const commentsRef = collection(db1, "posts", postId, "comments");
      const docRef = await addDoc(commentsRef, comment);

      // Update local state
      setNewCommentText((prev) => ({ ...prev, [postId]: "" }));
      setCommentsByPost((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), { id: docRef.id, ...comment }],
      }));

      // Increment comment count on the post itself
      await updateDoc(doc(db1, "posts", postId), { comments: increment(1) });
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  /* Deleting a comment */
  const handleDeleteComment = async (postId, commentId) => {
    if (!currentUser) return;
    if (!window.confirm("Delete this comment?")) return;

    try {
      await deleteDoc(doc(db1, "posts", postId, "comments", commentId));

      setCommentsByPost((prev) => ({
        ...prev,
        [postId]: prev[postId].filter((c) => c.id !== commentId),
      }));

      await updateDoc(doc(db1, "posts", postId), { comments: increment(-1) });
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  /* ------------------------- JSX ------------------------- */
  return (
    <div className="community-page">
      {/* HERO */}
      <section className="community-hero">
        <img src="./img/community.jpg" alt="" className="community-bg" />
        <div className="community-overlay">
          <h1>Community Discussions</h1>
          <div className="community-meta">
            <p className="meta-item"><MapPin size={16} /> Washington</p>
          </div>
        </div>
      </section>

      {/* CONTROLS */}
      <div className="community-controls">
        <div className="tabs">
          <button
            className={`tab ${sortMode === "recent" ? "active" : ""}`}
            onClick={() => setSortMode("recent")}
          >
            <Clock size={16} /> Recent
          </button>
          <button
            className={`tab ${sortMode === "trending" ? "active" : ""}`}
            onClick={() => setSortMode("trending")}
          >
            <TrendingUp size={16} /> Trending
          </button>
        </div>
        <button className="add-post" onClick={() => setShowForm(true)}>
          <Plus size={18} /> Add Post
        </button>
      </div>

      {/* CREATE POST */}
      {showForm && (
        <div className="form-overlay">
          <div className="add-post-form">
            <h3>Create a Post</h3>

            {/* TAG INPUT */}
            <div className="tag-field">
              <label>Tags:</label>
              <div className="tags-container">
                {newPostTags.map((tag, idx) => (
                  <span key={idx} className="tag-pill">{tag}</span>
                ))}
              </div>
              <input
                className="tag-input"
                placeholder="Type tag + press Enter"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && tagInput.trim()) {
                    if (!newPostTags.includes(tagInput.trim())) {
                      setNewPostTags([...newPostTags, tagInput.trim()]);
                    }
                    setTagInput("");
                    e.preventDefault();
                  }
                }}
              />
            </div>

            {/* CONTENT */}
            <textarea
              placeholder="Write your post..."
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
            />

            <div className="form-buttons">
              <button onClick={handlePost}>Post</button>
              <button onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* POSTS */}
      <div className="posts">
        {posts.map((post) => (
          <div key={post.id} className="post-card">
            <div className="post-header">
              <div className="avatar">
                {post.author ? post.author[0].toUpperCase() : "U"}
              </div>
              <div className="author">{post.author}</div>
            </div>

            <div className="category-row">
              {post.category?.map((tag, idx) => (
                <span key={idx} className="tag-pill">{tag}</span>
              ))}
            </div>

            <p className="post-content">{post.content}</p>

            {currentUser?.uid === post.uid && (
              <button
                className="delete-post-btn"
                onClick={() => handleDelete(post.id)}
              >
                Delete
              </button>
            )}

            <div className="post-footer">
              <div
                className="icon-group"
                onClick={() => handleLike(post)}
              >
                <ThumbsUp
                  size={16}
                  fill={post.likedByCurrentUser ? "currentColor" : "none"}
                />{" "}
                {post.likes} likes
              </div>
              <div
                className="icon-group"
                onClick={() => toggleComments(post.id)}
              >
                <MessageCircle size={16} /> {post.comments || 0} comments
              </div>
            </div>

            {openComments[post.id] && (
              <div className="comments-section">
                <div className="comments-list">
                  {(commentsByPost[post.id] || []).map((c) => (
                    <div key={c.id} className="comment">
                      <div className="comment-avatar">
                        {c.author ? c.author[0].toUpperCase() : "U"}
                      </div>
                      <div className="comment-body">
                        <span className="comment-author">{c.author}</span>
                        <span className="comment-text">{c.text}</span>
                      </div>
                      {/* DELETE COMMENT BUTTON */}
                      {currentUser?.uid === c.uid && (
                        <button
                          className="delete-post-btn"
                          onClick={() => handleDeleteComment(post.id, c.id)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  ))}
                </div>


                <div className="comment-input-row">
                  <input
                    className="comment-input"
                    placeholder="Write a comment..."
                    value={newCommentText[post.id] || ""}
                    onChange={(e) =>
                      setNewCommentText((prev) => ({
                        ...prev,
                        [post.id]: e.target.value,
                      }))
                    }
                  />
                  <button
                    className="comment-send-btn"
                    onClick={() => handleAddComment(post.id)}
                  >
                    Post
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
