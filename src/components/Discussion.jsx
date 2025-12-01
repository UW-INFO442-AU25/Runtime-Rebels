import React, { useState, useEffect } from "react";
import {
  ThumbsUp,
  MessageCircle,
  Plus,
  Clock,
  TrendingUp,
  MapPin,
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
  runTransaction,
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

  const [sortMode, setSortMode] = useState("recent");
  const [openComments, setOpenComments] = useState({});
  const [commentsByPost, setCommentsByPost] = useState({});
  const [newCommentText, setNewCommentText] = useState({});
  const [likePending, setLikePending] = useState({});

  /* ------------------------- AUTH ------------------------- */
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

    await addDoc(collection(db1, "posts"), newPost);

    setNewPostContent("");
    setNewPostTags([]);
    setTagInput("");
    setShowForm(false);
  };

  /* ------------------------- DELETE POST ------------------------- */
  const handleDelete = async (postId) => {
    if (!currentUser) return;
    if (!window.confirm("Delete this post?")) return;

    await deleteDoc(doc(db1, "posts", postId));
  };

  /* ------------------------- LIKE (TRANSACTION) ------------------------- */
  const handleLike = async (post) => {
    if (!currentUser) return;
    if (post.uid === currentUser.uid) {
      alert("You cannot like your own post");
      return;
    }

    if (likePending[post.id]) return;
    setLikePending((prev) => ({ ...prev, [post.id]: true }));

    const postRef = doc(db1, "posts", post.id);
    const likeRef = doc(db1, "posts", post.id, "likes", currentUser.uid);

    try {
      let becameLiked = false;

      await runTransaction(db1, async (tx) => {
        const likeSnap = await tx.get(likeRef);

        if (likeSnap.exists()) {
          tx.delete(likeRef);
          tx.update(postRef, { likes: increment(-1) });
        } else {
          tx.set(likeRef, { likedAt: serverTimestamp() });
          tx.update(postRef, { likes: increment(1) });
          becameLiked = true;
        }
      });

      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id
            ? {
                ...p,
                likedByCurrentUser: becameLiked,
                likes: p.likes + (becameLiked ? 1 : -1),
              }
            : p
        )
      );
    } catch (err) {
      console.error("Error toggling like", err);
    } finally {
      setLikePending((prev) => {
        const copy = { ...prev };
        delete copy[post.id];
        return copy;
      });
    }
  };

  /* ------------------------- LOAD COMMENTS ------------------------- */
  const loadComments = async (postId) => {
    const q = query(
      collection(db1, "posts", postId, "comments"),
      orderBy("createdAt", "asc")
    );
    const snap = await getDocs(q);
    const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));

    setCommentsByPost((prev) => ({ ...prev, [postId]: list }));
  };

  const toggleComments = async (postId) => {
    const isOpen = !!openComments[postId];
    if (!isOpen && !commentsByPost[postId]) {
      await loadComments(postId);
    }
    setOpenComments((prev) => ({ ...prev, [postId]: !isOpen }));
  };

  /* ------------------------- ADD COMMENT ------------------------- */
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

    const commentsRef = collection(db1, "posts", postId, "comments");
    const docRef = await addDoc(commentsRef, comment);

    setNewCommentText((prev) => ({ ...prev, [postId]: "" }));
    setCommentsByPost((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), { id: docRef.id, ...comment }],
    }));

    await updateDoc(doc(db1, "posts", postId), {
      comments: increment(1),
    });
  };

  /* ------------------------- DELETE COMMENT ------------------------- */
  const handleDeleteComment = async (postId, commentId) => {
    if (!currentUser) return;
    if (!window.confirm("Delete this comment?")) return;

    await deleteDoc(doc(db1, "posts", postId, "comments", commentId));

    setCommentsByPost((prev) => ({
      ...prev,
      [postId]: prev[postId].filter((c) => c.id !== commentId),
    }));

    await updateDoc(doc(db1, "posts", postId), {
      comments: increment(-1),
    });
  };

  /* ------------------------- JSX ------------------------- */
  return (
    <div className="community-page">
      <section className="community-hero">
        <img src="./img/community.jpg" alt="" className="community-bg" />
        <div className="community-overlay">
          <h1>Community Discussions</h1>
          <div className="community-meta">
            <p className="meta-item">
              <MapPin size={16} /> Washington
            </p>
          </div>
        </div>
      </section>

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

      {showForm && (
        <div className="form-overlay">
          <div className="add-post-form">
            <h3>Create a Post</h3>

            <div className="tag-field">
              <label>Tags:</label>
              <div className="tags-container">
                {newPostTags.map((tag, idx) => (
                  <span key={idx} className="tag-pill">
                    {tag}
                  </span>
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
                <span key={idx} className="tag-pill">
                  {tag}
                </span>
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
                className={`icon-group ${
                  likePending[post.id] ? "icon-group--disabled" : ""
                }`}
                onClick={() => handleLike(post)}
              >
                <ThumbsUp
                  size={16}
                  fill={post.likedByCurrentUser ? "currentColor" : "none"}
                />
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

                      {currentUser?.uid === c.uid && (
                        <button
                          className="delete-post-btn"
                          onClick={() =>
                            handleDeleteComment(post.id, c.id)
                          }
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
