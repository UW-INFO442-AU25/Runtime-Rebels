import React, { useState, useEffect } from "react";
import { ThumbsUp, MessageCircle, Plus, Clock, TrendingUp, MapPin, Info } from "lucide-react";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc, getDoc,
  setDoc,
  deleteDoc,
  onSnapshot, query, orderBy, serverTimestamp, addDoc, increment, updateDoc
} from "firebase/firestore";
import { auth, db1} from "../main";
import "../index.css";

export default function CommunityDiscussions() {
   const [posts, setPosts] = useState([
    {
      category: ["Pickleball Enthusiasts"],
      author: "John Doe",
      content: "Lorem ipsum dolor sit amet...",
      likes: 8,
      comments: 3,
    },
    {
      category: ["Hiking Buddies"],
      author: "John Doe",
      content: "Lorem ipsum dolor sit amet...",
      likes: 8,
      comments: 3,
    },
    {
      category: ["Reading Pals"],
      author: "John Doe",
      content: "Lorem ipsum dolor sit amet...",
      likes: 8,
      comments: 3,
    },
  ]);

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    setCurrentUser(user); // user object if logged in, null if not
    console.log(user.uid);
  });

  return () => unsubscribe();
}, []);





  useEffect(() => {
  const q = query(collection(db1, "posts"), orderBy("createdAt", "desc"));
  const unsubscribe = onSnapshot(q, (snapshot) => {
    const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setPosts(postsData);
  });

  return () => unsubscribe(); // cleanup listener on unmount
}, []);

  const [showForm, setShowForm] = useState(false); // for toggling the form
  const [newPostContent, setNewPostContent] = useState(""); // for typing
  const [newPostTags, setNewPostTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  //Pushing Posts to Firebase


 const handlePost = async () => {
  if (!currentUser || newPostContent.trim() === "") return;

  const newPost = {
    category: ["General", ...newPostTags],
    author: currentUser.displayName || currentUser.email || "Anonymous",
    uid: currentUser.uid,
    content: newPostContent,
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
  } catch (error) {
    console.error("Error posting:", error);
  }
};

//Liking a post?


const handleLike = async (post) => {
  if (!currentUser) return;

  if (post.uid === currentUser.uid) {
    alert("You cannot like your own post!");
    return;
  }

  const likeRef = doc(db1, "posts", post.id, "likes", currentUser.uid);
  const likeSnap = await getDoc(likeRef);

  if (likeSnap.exists()) {
    alert("You have already liked this post!");
    return;
  }

  try {
    await setDoc(likeRef, {
      likedAt: serverTimestamp(),
    });

    // Optionally update likes count in the post itself
    const postRef = doc(db1, "posts", post.id);
    await updateDoc(postRef, {
      likes: increment(1)
    });

    setPosts(posts.map(p =>
      p.id === post.id ? { ...p, likes: p.likes + 1 } : p
    ));

  } catch (error) {
    console.error("Error liking post:", error);
  }
};


  return (
    <div className="community-page">
      {/* ===== HERO ===== */}
      <section className="community-hero">
        <img
          src="./img/community.jpg"
          alt="Community Background"
          className="community-bg"
        />
        <div className="community-overlay">
          <h1>Community Discussions</h1>
          <div className="community-meta">
            <p className="meta-item"><MapPin size={16} /> Location</p>
            <p className="meta-item"><Info size={16} /> About Community</p>
          </div>
        </div>
      </section>

      {/* ===== CONTROLS ===== */}
      <div className="community-controls">
        <div className="tabs">
          <button className="tab active">
            <Clock size={16} /> Recent
          </button>
          <button className="tab">
            <TrendingUp size={16} /> Trending
          </button>
        </div>
        <button className="add-post" onClick={() => setShowForm(true)}>
        <Plus size={18} /> Add Post
        </button>
      </div>

      {/* ===== ADD POST FORM ===== */}
    {showForm && (
            <div className="form-overlay">
              <div className="add-post-form">
                <h3>Create a Post</h3>

                {/* Tag input */}
                <div className="tag-field">
                  <label>Tags:</label>
                  <div className="tags-container">
                    {newPostTags.map((tag, idx) => (
                      <span key={idx} className="tag-pill">{tag}</span>
                    ))}
                  </div>
                  <input
                    type="text"
                    placeholder="Type a tag and press Enter"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && tagInput.trim() !== "") {
                        if (!newPostTags.includes(tagInput.trim())) {
                          setNewPostTags([...newPostTags, tagInput.trim()]);
                        }
                        setTagInput("");
                        e.preventDefault();
                      }
                    }}
                    className="tag-input"
                  />
                </div>

                {/* Post content */}
                <textarea
                  placeholder="Write your post..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                />

                {/* Buttons */}
                <div className="form-buttons">
                  <button
                    onClick={handlePost}>
                    Post
                  </button>
                  <button onClick={() => setShowForm(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}

      {/* ===== POSTS ===== */}
      <div className="posts">
        {posts.map((post, index) => (
          <div key={index} className="post-section">
            <div className="category-tag">{post.category.map((tag, idx) => (
    <span key={idx} className="tag-pill">{tag}</span>
  ))}</div>
            <div className="post-card">
              <div className="post-header">
                <div className="avatar">JD</div>
                <div className="author">{post.author}</div>
              </div>
              <p className="post-content">{post.content}</p>
              <div className="post-footer">
                <div className="icon-group" onClick={() => handleLike(post)}>
                  <ThumbsUp size={16} /> <span>{post.likes} likes</span>
                </div>
                <div className="icon-group">
                  <MessageCircle size={16} /> <span>{post.comments} comments</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
