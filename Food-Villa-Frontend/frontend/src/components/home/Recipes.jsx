import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import publicAPI from "../../api/publicApi";
import "../../styles/index.css";

const Recipes = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const res = await publicAPI.get("/recipe");

      const formattedData = res.data.slice(0, 8).map((item) => ({
        id: item._id,
        image: item.imageUrl,
      }));

      setRecipes(formattedData);
    } catch (error) {
      console.error("Home Recipes fetch error:", error);
    }
  };

  return (
    <section id="recipes" className="rs-section">
      <div className="rs-container">
        <h2 className="rs-title">Recipes</h2>

        <div className="rs-grid">
          {recipes.map((item) => (
            <div className="rs-item" key={item.id}>
              <img
                src={item.image}
                alt="Recipe"
                className="rs-img"
                onError={(e) =>
                  (e.target.src =
                    "https://via.placeholder.com/400x300?text=No+Image")
                }
              />
            </div>
          ))}
        </div>

        <div className="rs-button-row">
          <button
            type="button"
            className="rs-readmore-btn"
            onClick={() => navigate("/recipes")}
          >
            Read more
          </button>
        </div>

        <div className="rs-underline" />
      </div>
    </section>
  );
};

export default Recipes;
