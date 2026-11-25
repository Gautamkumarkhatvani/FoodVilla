import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/footer";
import API from "../api/axios";
import "../styles/index.css";

const Blog = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await API.get("/blog");

      const formattedData = res.data.map((b) => ({
        id: b._id,
        title: b.title,
        desc: b.description,
        smallImage: b.smallImage,
        bigImage: b.largeImage || b.smallImage,
      }));

      setBlogs(formattedData);
    } catch (error) {
      console.error("Blog fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <section className="bp-page">
        <div className="bp-container">
          <h2 className="bp-title">Our Blog</h2>

          {loading && (
            <p className="bp-loading">Loading...</p>
          )}

          <div className="bp-grid">
            {!loading &&
              blogs.map((blog) => (
                <div
                  className="bp-card"
                  key={blog.id}
                >
                  <img
                    src={blog.smallImage}
                    alt={blog.title}
                    onError={(e) =>
                      (e.target.src =
                        "https://via.placeholder.com/300x180?text=No+Image")
                    }
                  />

                  <div className="bp-card-body">
                    <h3>{blog.title}</h3>
                    <p>{blog.desc}</p>

                    <button
                      className="bp-readmore"
                      onClick={() =>
                        navigate(`/blog/${blog.id}`, {
                          state: blog,
                        })
                      }
                    >
                      Read More →
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Blog;
