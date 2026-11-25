import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/index.css";

/* LISTS */
import KitchenList from "../components/kitchen/KitchenList";
import TasteList from "../components/taste/TasteList";
import RecipeList from "../components/recipes/RecipeList";
import BlogList from "../components/blog/BlogList";
import UserList from "../components/users/UserList";
import ContactList from "../components/contact/ContactList";
import OrderList from "../components/Orders/Orderlist";

/* FORMS */
import KitchenForm from "../components/kitchen/KitchenForm";
import TasteForm from "../components/taste/TasteForm";
import RecipeForm from "../components/recipes/RecipeForm";
import BlogForm from "../components/blog/BlogForm";
import UserForm from "../components/users/UserForm";

const Dashboard = () => {
  const { isAdmin, hasPermission, logout, loading } = useAuth();

  if (loading) {
    return <div style={{ padding: "20px" }}>Loading dashboard...</div>;
  }

  const [activeTab, setActiveTab] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);


  /* MODULE CONFIG */
  const modules = {
    kitchen: { label: "KITCHEN", list: KitchenList, form: KitchenForm },
    taste: { label: "TASTE", list: TasteList, form: TasteForm },
    recipe: { label: "RECIPE", list: RecipeList, form: RecipeForm },
    blog: { label: "BLOG", list: BlogList, form: BlogForm },
    contact: { label: "CONTACT", list: ContactList },
    orders: { label: "ORDERS", list: OrderList },
  };

  /* DEFAULT TAB */
  useEffect(() => {
    if (!activeTab && (isAdmin || hasPermission)) {
      const firstAllowed = Object.keys(modules).find(
        (key) => isAdmin || (hasPermission && hasPermission(key))
      );
      if (firstAllowed) setActiveTab(firstAllowed);
    }
  }, [activeTab, isAdmin, hasPermission]);

  const ActiveList = modules[activeTab]?.list;
  const ActiveForm = modules[activeTab]?.form;

  const canAccess = isAdmin || hasPermission(activeTab);
  const canAdd = isAdmin || hasPermission(activeTab);

  const changeTab = (tab) => {
    setActiveTab(tab);
    setEditingItem(null);
  };

  return (
    <div className="ad-wrapper">
      {/* HEADER */}
      <header className="ad-header">
        <h3 className="ad-title">Admin Dashboard</h3>

        <button className="ad-logout-btn" onClick={logout}>
          Logout
        </button>
      </header>

      {/* TABS */}
      <nav className="ad-tabs">
        {Object.entries(modules).map(
          ([key, mod]) =>
            (isAdmin || (hasPermission && hasPermission(key))) && (
              <button
                key={key}
                className={`ad-tab-btn ${activeTab === key ? "active" : ""}`}
                onClick={() => changeTab(key)}
              >
                {mod.label}
              </button>
            )
        )}
        {isAdmin && (
          <button
            className={`ad-tab-btn ${activeTab === "users" ? "active" : ""
              }`}
            onClick={() => changeTab("users")}
          >
            USERS
          </button>
        )}
      </nav>

      {/* CONTENT */}
      <main className="ad-content">
        {/* FORM */}
        {ActiveForm && canAdd && editingItem !== null && (
          <ActiveForm
            key={editingItem?._id || "new"}
            editData={editingItem === "new" ? null : editingItem}
            onSuccess={() => {
              setEditingItem(null);
              setRefreshKey((prev) => prev + 1);
            }}
            onCancel={() => setEditingItem(null)}
          />
        )}

        {/* LIST */}
        {ActiveList && canAccess && (
          <ActiveList
            refreshKey={refreshKey}
            onAdd={() => setEditingItem("new")}
            onEdit={(item) => setEditingItem(item)}
          />
        )}

        {/* USERS */}
        {activeTab === "users" && isAdmin && (
          <>
            <UserForm
              refresh={() => setRefreshKey((p) => p + 1)}
            />

            <UserList refreshKey={refreshKey} />
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
