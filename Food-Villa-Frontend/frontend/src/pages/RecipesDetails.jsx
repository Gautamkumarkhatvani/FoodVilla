import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/footer";
import "../styles/index.css";

const RecipesDetails = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Direct URL / refresh safety
  if (!state) {
    return (
      <>
        <Navbar />
        <div style={{ padding: "40px", textAlign: "center" }}>
          <h2>Recipe not found</h2>
          <button
            onClick={() => navigate("/recipes")}
            className="detail-back-btn"
          >
            Back to Recipes
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <section className="detail-page">
        <div className="detail-container">
          {/* TITLE */}
          <h1 className="detail-title">{state.name}</h1>

          {/* IMAGE */}
          <img
            src={state.image}
            alt={state.name}
            className="detail-image"
            onError={(e) =>
              (e.target.src =
                "https://via.placeholder.com/500x300?text=No+Image")
            }
          />

          {/* DESCRIPTION */}
          <p className="detail-desc">{state.description}</p>

          {/* BACK BUTTON */}
          <button
            className="detail-back-btn"
            onClick={() => navigate("/recipes")}
          >
            ← Back to Recipes
          </button>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default RecipesDetails;
