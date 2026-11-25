import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/footer";
import API from "../api/axios";
import "../styles/index.css";


const Recipes = () => {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const res = await API.get("/recipe");

      const formattedData = res.data.map((item) => ({
        id: item._id,
        name: item.title,
        image: item.imageUrl,
        description: item.description, 
      }));

      setRecipes(formattedData);
    } catch (error) {
      console.error("Recipe fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <section className="recipes-page">
        <div className="recipes-container">
          <h2 className="recipes-title">Our Recipes</h2>

          {loading && <p style={{ textAlign: "center" }}>Loading...</p>}

          <div className="recipes-grid">
            {!loading &&
              recipes.map((item) => (
                <div
                  key={item.id}
                  className="recipe-card"
                  onClick={() =>
                    navigate(`/recipes/${item.id}`, {
                      state: item, 
                    })
                  }
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(e) =>
                      (e.target.src =
                        "https://via.placeholder.com/250x160?text=No+Image")
                    }
                  />
                  <h3>{item.name}</h3>
                </div>
              ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Recipes;