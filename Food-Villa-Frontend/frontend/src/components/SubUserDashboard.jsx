import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/index.css";

/* MODULE COMPONENTS */
import KitchenList from "../components/kitchen/KitchenList";
import KitchenForm from "../components/kitchen/KitchenForm";

import TasteList from "../components/taste/TasteList";
import TasteForm from "../components/taste/TasteForm";

import RecipeList from "../components/recipe/RecipeList";
import RecipeForm from "../components/recipe/RecipeForm";

import BlogList from "../components/blog/BlogList";
import BlogForm from "../components/blog/BlogForm";

const SubUserDashboard = () => {
  const { canAdd } = useAuth();
  const [tab, setTab] = useState("kitchen");

  return (
    <div className="sud-container">
      {/* HEADER */}
      <header className="sud-header">
        <h2>Sub User Dashboard</h2>
      </header>

      {/* TABS */}
      <nav className="sud-tabs">
        <button onClick={() => setTab("kitchen")}>Kitchen</button>
        <button onClick={() => setTab("taste")}>Taste</button>
        <button onClick={() => setTab("recipes")}>Recipes</button>
        <button onClick={() => setTab("blog")}>Blog</button>
      </nav>

      {/* CONTENT */}
      <main className="sud-content">
        {tab === "kitchen" && (
          <>
            {canAdd("kitchen") && (
              <KitchenForm onSuccess={() => {}} />
            )}
            <KitchenList />
          </>
        )}

        {tab === "taste" && (
          <>
            {canAdd("taste") && (
              <TasteForm onSuccess={() => {}} />
            )}
            <TasteList />
          </>
        )}

        {tab === "recipes" && (
          <>
            {canAdd("recipe") && (
              <RecipeForm onSuccess={() => {}} />
            )}
            <RecipeList />
          </>
        )}

        {tab === "blog" && (
          <>
            {canAdd("blog") && (
              <BlogForm refresh={() => {}} />
            )}
            <BlogList />
          </>
        )}
      </main>
    </div>
  );
};

export default SubUserDashboard;
