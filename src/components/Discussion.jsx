import React, { useState, useEffect } from "react";
import {
  ThumbsUp,
  MessageCircle,
  Plus,
  Clock,
  TrendingUp,
  MapPin,
  Info
} from "lucide-react";

import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  addDoc,
  increment,
  updateDoc,
  deleteDoc   // ✅ YOU FORGOT THIS
} from "firebase/firestore";

import { auth, db1 } from "../main";
import "../index.css";

export default function CommunityDiscussions() {
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostTags, setNewPostTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  /* -------------------------
       AUTH TRACKING
  -------------------------- */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  /* -------------------------
       LOAD POSTS
  -------------------------- */
  useEffect(() => {
    const q = query(collection(db1, "posts"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const postsList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      }));
      setPosts(postsList);
    });

    return () => unsubscribe();
  }, []);

  /* -------------------------
       CREATE POST
  -------------------------- */
  const handlePost = async () => {
    if (!currentUser || newPostContent.trim() === "") return;

    const newPost = {
      category: newPostTags.length ? newPostTags : ["General"],
      author: currentUser.displayName || currentUser.email,
      uid: currentUser.uid,
      content: newPostContent.trim(),
      likes: 0,
      comments: 0,
      createdAt: serverTimestamp()
    };

    try {
      await addDoc(collection(db1, "posts"), newPost);
      setNewPostContent("");
      setNewPostTags([]);
      setTagInput("");
      setShowForm(false);
    } catch (err) {
      console.error(err);
    }
  };

  /* -------------------------
       DELETE POST (NEW)
  -------------------------- */
  const handleDelete = async (postId) => {
    if (!currentUser) return;
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await deleteDoc(doc(db1, "posts", postId));
      // No need to update state manually — the listener refreshes UI
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  /* -------------------------
       LIKE A POST
  -------------------------- */
  const handleLike = async (post) => {
    if (!currentUser) return;
    if (post.uid === currentUser.uid) return alert("You cannot like your own post!");

    const likeRef = doc(db1, "posts", post.id, "likes", currentUser.uid);
    const likeSnap = await getDoc(likeRef);

    if (likeSnap.exists()) {
      alert("You already liked this post!");
      return;
    }

    try {
      await setDoc(likeRef, { likedAt: serverTimestamp() });
      await updateDoc(doc(db1, "posts", post.id), {
        likes: increment(1)
      });
    } catch (err) {
      console.error(err);
    }
  };

  /* -------------------------
       JSX
  -------------------------- */
  return (
    <div className="community-page">
      {/* HERO */}
      <section className="community-hero">
        <img src="./img/community.jpg" alt="Community Background" className="community-bg" />
        <div className="community-overlay">
          <h1>Community Discussions</h1>
          <div className="community-meta">
            <p className="meta-item"><MapPin size={16} /> Seattle</p>
            <p className="meta-item"><Info size={16} /> About Community</p>
          </div>
        </div>
      </section>

      {/* CONTROLS */}
      <div className="community-controls">
        <div className="tabs">
          <button className="tab active"><Clock size={16} /> Recent</button>
          <button className="tab"><TrendingUp size={16} /> Trending</button>
        </div>
        <button className="add-post" onClick={() => setShowForm(true)}>
          <Plus size={18} /> Add Post
        </button>
      </div>

      {/* CREATE POST MODAL */}
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
                type="text"
                className="tag-input"
                placeholder="Type a tag and press Enter"
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

            {/* DELETE BUTTON — only for post owner */}
            {currentUser?.uid === post.uid && (
              <button
                className="delete-post-btn"
                onClick={() => handleDelete(post.id)}
              >
                Delete
              </button>
            )}

            <div className="post-footer">
              <div className="icon-group" onClick={() => handleLike(post)}>
                <ThumbsUp size={16} /> {post.likes} likes
              </div>
              <div className="icon-group">
                <MessageCircle size={16} /> {post.comments} comments
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
