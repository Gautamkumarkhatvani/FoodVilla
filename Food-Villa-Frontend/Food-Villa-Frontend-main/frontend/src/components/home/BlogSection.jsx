import { useEffect, useState } from "react";
import "../../styles/index.css";
import { useNavigate } from "react-router-dom";
import publicAPI from "../../api/publicApi";

import QuoteLeft from "../../assets/blog/quoteLeft.svg";
import QuoteRight from "../../assets/blog/quoteRight.svg";
import ArrowLeft from "../../assets/blog/arrowLeft.svg";
import ArrowRight from "../../assets/blog/arrowRight.svg";

const BlogSection = () => {
  const navigate = useNavigate();

  const [blogItems, setBlogItems] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeArrow, setActiveArrow] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await publicAPI.get("/blog");

      const formattedData = res.data.slice(0, 4).map((b) => ({
        id: b._id,
        title: b.title,
        text: b.description,
        image:
          b.smallImage ||
          "https://via.placeholder.com/120?text=No+Image",
      }));

      setBlogItems(formattedData);
    } catch (err) {
      console.error("Home blog fetch error:", err);
    }
  };

  if (blogItems.length === 0) return null;

  const current = blogItems[currentIndex];

  const triggerArrow = (direction) => {
    setActiveArrow(direction);
    setTimeout(() => setActiveArrow(null), 200);
  };

  const goPrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? blogItems.length - 1 : prev - 1
    );
    triggerArrow("left");
  };

  const goNext = () => {
    setCurrentIndex((prev) =>
      prev === blogItems.length - 1 ? 0 : prev + 1
    );
    triggerArrow("right");
  };

  return (
    <section id="blog" className="bs-section">
      <div className="bs-container">
        <h2 className="bs-title">Blog</h2>

        {/* DOTS */}
        <div className="bs-dots">
          {blogItems.map((_, idx) => (
            <span
              key={idx}
              className={`bs-dot ${
                idx === currentIndex ? "bs-dot--active" : ""
              }`}
            />
          ))}
        </div>

        {/* CARD */}
        <div className="bs-card-wrapper">
          <img
            src={QuoteLeft}
            alt=""
            aria-hidden="true"
            className="bs-quote bs-quote--left"
          />
          <img
            src={QuoteRight}
            alt=""
            aria-hidden="true"
            className="bs-quote bs-quote--right"
          />

          <button
            type="button"
            className={`bs-arrow-btn bs-arrow-btn--left ${
              activeArrow === "left" ? "bs-arrow-btn--active" : ""
            }`}
            onClick={goPrev}
          >
            <img src={ArrowLeft} alt="" />
          </button>

          <button
            type="button"
            className={`bs-arrow-btn bs-arrow-btn--right ${
              activeArrow === "right" ? "bs-arrow-btn--active" : ""
            }`}
            onClick={goNext}
          >
            <img src={ArrowRight} alt="" />
          </button>

          <div className="bs-card">
            <div className="bs-avatar-wrapper">
              <img
                src={current.image}
                alt={current.title}
                className="bs-avatar"
              />
            </div>

            <div className="bs-text">
              <h3 className="bs-post-title">{current.title}</h3>
              <p className="bs-post-text">{current.text}</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bs-button-row">
          <button
            type="button"
            className="bs-readmore-btn"
            onClick={() => navigate("/blog")}
          >
            Read more
          </button>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
