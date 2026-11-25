import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/footer";
import "../styles/index.css";

const BlogDetail = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  /* SAFETY: Direct URL / refresh */
  if (!state) {
    return (
      <>
        <Navbar />
        <div className="bd-notfound">
          <h2>Blog not found</h2>
          <button
            className="bd-back-btn"
            onClick={() => navigate("/blog")}
          >
            Back to Blog
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <section className="bd-page">
        <div className="bd-container">
          {/* TITLE */}
          <h1 className="bd-title">{state.title}</h1>

          {/* IMAGE WRAPPER */}
          <div className="bd-image-wrapper">
            {/* SMALL ROUND IMAGE */}
            <img
              src={state.smallImage}
              alt="icon"
              className="bd-small-image"
              onError={(e) =>
                (e.target.src =
                  "https://via.placeholder.com/80?text=No+Image")
              }
            />

            {/* BIG IMAGE */}
            <img
              src={state.bigImage}
              alt={state.title}
              className="bd-big-image"
              onError={(e) =>
                (e.target.src =
                  "https://via.placeholder.com/600x320?text=No+Image")
              }
            />
          </div>

          {/* CONTENT */}
          <div className="bd-content">
            <p
              className={
                expanded
                  ? "bd-text bd-text--expanded"
                  : "bd-text"
              }
            >
              {state.desc}
            </p>

            {!expanded && (
              <span
                className="bd-readmore"
                onClick={() => setExpanded(true)}
              >
                Read more
              </span>
            )}
          </div>

          {/* BACK BUTTON */}
          <button
            className="bd-back-btn"
            onClick={() => navigate("/blog")}
          >
            ← Back to Blog
          </button>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default BlogDetail;
