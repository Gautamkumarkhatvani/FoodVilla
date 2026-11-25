import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import publicAPI from "../../api/publicApi";
import "../../styles/index.css";

const TasteOfFood = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchTasteItems();
  }, []);

  const fetchTasteItems = async () => {
    try {
      const res = await publicAPI.get("/taste");

      const formattedData = res.data.slice(0, 6).map((item, index) => ({
        id: item._id,
        title: item.title,
        description: item.description || "",
        image: item.imageUrl,
        featured: index === 0,
      }));

      setItems(formattedData);
    } catch (error) {
      console.error("TasteOfFood fetch error:", error);
    }
  };

  return (
    <section id="taste" className="tof-section">
      <div className="tof-container">
        <h2 className="tof-title">Taste of food</h2>

        <div className="tof-grid">
          {items.map((item) => (
            <article
              key={item.id}
              className={`tof-card ${
                item.featured ? "tof-card--featured" : ""
              }`}
            >
              <div className="tof-card-image-wrapper">
                <img
                  src={item.image}
                  alt={item.title}
                  className="tof-card-image"
                  onError={(e) =>
                    (e.target.src =
                      "https://via.placeholder.com/100?text=No+Image")
                  }
                />
              </div>

              <div className="tof-card-content">
                <h3 className="tof-card-title">{item.title}</h3>
                <p className="tof-card-description">
                  {item.description}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="tof-button-row">
          <button
            type="button"
            className="tof-readmore-btn"
            onClick={() => navigate("/taste")}
          >
            Read more
          </button>
        </div>

        <div className="tof-underline" />
      </div>
    </section>
  );
};

export default TasteOfFood;
