import React from "react";
import { ThumbsUp, MessageCircle, Plus, Clock, TrendingUp, MapPin, Info } from "lucide-react";
import "../index.css";

export default function CommunityDiscussions() {
  const posts = [
    {
      category: "Pickleball Enthusiasts",
      author: "John Doe",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      likes: 8,
      comments: 3,
    },
    {
      category: "Hiking Buddies",
      author: "John Doe",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      likes: 8,
      comments: 3,
    },
    {
      category: "Reading Pals",
      author: "John Doe",
      content:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      likes: 8,
      comments: 3,
    },
  ];

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
        <button className="add-post">
          <Plus size={18} /> Add Post
        </button>
      </div>

      {/* ===== POSTS ===== */}
      <div className="posts">
        {posts.map((post, index) => (
          <div key={index} className="post-section">
            <div className="category-tag">{post.category}</div>
            <div className="post-card">
              <div className="post-header">
                <div className="avatar">JD</div>
                <div className="author">{post.author}</div>
              </div>
              <p className="post-content">{post.content}</p>
              <div className="post-footer">
                <div className="icon-group">
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
