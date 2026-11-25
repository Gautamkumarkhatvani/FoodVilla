import { useEffect, useState } from "react";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/footer";
import API from "../api/axios";
import "../styles/index.css";

const Kitchen = () => {
  const [kitchenItems, setKitchenItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKitchens();
  }, []);

  const fetchKitchens = async () => {
    try {
      const res = await API.get("/kitchen");
      setKitchenItems(res.data);
    } catch (error) {
      console.error("Kitchen fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <section className="kitchen-page">
        <div className="kitchen-container">
          <h2 className="kitchen-title">Our Kitchen</h2>

          <p className="kitchen-subtitle">
            Behind every delicious meal is a clean, modern, and passionate kitchen
          </p>

          {loading && <p>Loading...</p>}

          <div className="kitchen-grid">
            {!loading &&
              kitchenItems.map((item) => (
                <div className="kitchen-card" key={item._id}>
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    onError={(e) =>
                      (e.target.src =
                        "https://via.placeholder.com/80?text=No+Image")
                    }
                  />
                  <h3>{item.title}</h3>
                  <p>{item.desc || item.description}</p>
                </div>
              ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Kitchen;
