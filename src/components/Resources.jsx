import React, { useState } from "react";
import "../index.css";

const heroImg = "/img/resourcesbanner.png";
const img1 = "/img/samhsa.png";
const img2 = "/img/nimh.webp";
const img3 = "/img/who.png";
const img4 = "/img/cdc.png";
const img5 = "/img/nami.png";
const img6 = "/img/forbes.jpg";
const img7 = "/img/psychologytoday.png";
const img8 = "/img/harvard.png";
const img9 = "/img/mha.webp";

// ======================
// RESOURCE DATA ARRAY
// ======================
const resourcesData = [
  {
    title: "SAMHSA: Resources for Older Adults",
    img: img1,
    description: "Support for older adults with mental and substance use disorders.",
    link: "https://www.samhsa.gov/communities/older-adults",
    category: "Mental Health",
    type: "Guide",
    topic: "Stress",
  },
  {
    title: "NIMH: Older Adults & Mental Health",
    img: img2,
    description: "Mental health information specifically for older adults.",
    link: "https://www.nimh.nih.gov/health/topics/older-adults-and-mental-health",
    category: "Mental Health",
    type: "Article",
    topic: "Wellness",
  },
  {
    title: "NIMH: Caring for Your Mental Health",
    img: img2,
    description: "Simple steps and practices to maintain mental well being.",
    link: "https://www.nimh.nih.gov/health/topics/caring-for-your-mental-health",
    category: "Mental Health",
    type: "Guide",
    topic: "Wellness",
  },
  {
    title: "WHO: Mental Health of Older Adults",
    img: img3,
    description: "Global statistics and key risk factors affecting mental health later in life.",
    link: "https://www.who.int/news-room/fact-sheets/detail/mental-health-of-older-adults",
    category: "Mental Health",
    type: "Article",
    topic: "Stress",
  },
  {
    title: "CDC Mental Health Resources",
    img: img4,
    description: "Evidence based guidance on caring for mental health.",
    link: "https://www.cdc.gov/mental-health/caring/index.html",
    category: "Mental Health",
    type: "Guide",
    topic: "Wellness",
  },
  {
    title: "National Alliance on Mental Illness (NAMI)",
    img: img5,
    description: "Support, education, and advocacy for mental health.",
    link: "https://www.nami.org/",
    category: "Community",
    type: "Guide",
    topic: "Purpose",
  },
  {
    title: "Best Online Therapy Services",
    img: img6,
    description: "Independent review of top online therapy platforms.",
    link: "https://www.forbes.com/health/l/best-online-therapy/",
    category: "Mental Health",
    type: "Article",
    topic: "Stress",
  },
  {
    title: "Psychology Today: Find a Therapist",
    img: img7,
    description: "Search tool to find therapists by location and specialty.",
    link: "https://www.psychologytoday.com/us",
    category: "Community",
    type: "Guide",
    topic: "Purpose",
  },
  {
    title: "Harvard: Importance of Social Connection",
    img: img8,
    description: "How social ties support healthier, longer lives.",
    link: "https://hsph.harvard.edu/news/the-importance-of-connections-ways-to-live-a-longer-healthier-life/",
    category: "Lifestyle",
    type: "Article",
    topic: "Purpose",
  },
  {
    title: "Mental Health America: Connect With Others",
    img: img9,
    description: "Steps to build meaningful connection and support networks.",
    link: "https://mhanational.org/resources/connect-with-others/",
    category: "Community",
    type: "Guide",
    topic: "Purpose",
  },
];

export default function Resources() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [topic, setTopic] = useState("");
  const [type, setType] = useState("");

  // Video modal state
  const [showVideo, setShowVideo] = useState(false);

  // Filtered resources
  const filteredResources = resourcesData.filter((r) => {
    const matchCategory = category === "All" || r.category === category;
    const matchTopic = topic === "" || r.topic === topic;
    const matchType = type === "" || r.type === type;

    const matchSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      (r.description &&
        r.description.toLowerCase().includes(search.toLowerCase()));

    return matchCategory && matchTopic && matchType && matchSearch;
  });

  const categories = ["All", "General", "Mental Health", "Community", "Lifestyle"];

  return (
    <div
      className="resources-page"
      role="main"
      aria-labelledby="resources-title"
    >
      {/* HERO */}
      <section
        className="resources-hero"
        style={{ backgroundImage: `url(${heroImg})` }}
        aria-label="Retirement mental health resources hero section"
      >
        <div className="hero-overlay">
          <h1 id="resources-title">
            While retiring can be exciting, it can also be stressful.
            These resources help you cope with retirement depression and find new purpose in life.
          </h1>
          <p>22.8 percent of U.S. adults experienced mental illness in 2021.</p>
        </div>

        {/* Bottom "View Video" Button anchored to hero */}
        <div className="hero-bottom-button">
          <button
            className="view-video-btn"
            onClick={() => setShowVideo(true)}
            aria-label="Open video about coping with retirement stress"
          >
            View Video
          </button>
        </div>
      </section>

      {/* VIDEO MODAL */}
      {showVideo && (
        <div
          className="video-modal-overlay"
          onClick={() => setShowVideo(false)}
        >
          <div
            className="video-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Video dialog about retirement and mental health"
          >
            <button
              className="modal-close-btn"
              onClick={() => setShowVideo(false)}
              aria-label="Close video"
            >
              ✕
            </button>

            <iframe
              className="video-iframe"
              src="https://www.youtube.com/embed/G0zJGDokyWQ"
              title="Retirement and mental health video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* FILTERS */}
      <section
        className="filter-section"
        aria-label="Filter and search mental health resources"
      >
        <div
          className="filter-card"
          role="group"
          aria-label="Resource filters"
        >
          {/* CATEGORY PILLS */}
          <div
            className="filter-buttons"
            role="group"
            aria-label="Filter resources by category"
          >
            {categories.map((cat) => (
              <button
                key={cat}
                className={`pill ${category === cat ? "active" : ""}`}
                onClick={() => setCategory(cat)}
                aria-pressed={category === cat}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* SEARCH BAR */}
          <div className="filter-controls">
            <div className="field">
              <input
                type="text"
                placeholder="Search keywords..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Search resources by keyword"
              />
            </div>
          </div>

          {/* RESOURCE GRID */}
          <div
            className="resource-grid resources-grid--wide"
            aria-label="Resource search results"
            aria-live="polite"
          >
            {filteredResources.map((res, index) => (
              <article className="resource-card" key={index}>
                <div className="thumb">
                  {res.img && (
                    <img
                      src={res.img}
                      alt={res.title}
                    />
                  )}
                </div>

                {res.link ? (
                  <h3>
                    <a
                      href={res.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {res.title}
                    </a>
                  </h3>
                ) : (
                  <h3>{res.title}</h3>
                )}

                {res.description && <p>{res.description}</p>}
              </article>
            ))}

            {filteredResources.length === 0 && (
              <p className="no-results" role="status">
                No resources match your search.
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
