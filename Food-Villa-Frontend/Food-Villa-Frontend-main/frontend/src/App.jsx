import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";



/* PUBLIC */
import Home from "./pages/Home";
import Recipes from "./pages/Recipes";
import RecipesDetails from "./pages/RecipesDetails";
import Taste from "./pages/Taste";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Contact from "./pages/Contact";
import Kitchen from "./pages/Kitchen";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Services from "./pages/Services";
import About from "./pages/About";

/* DASHBOARD */
import Dashboard from "./pages/Dashboard";

/* NEW */
import Profile from "./pages/Profile";
import OrderHistory from "./pages/OrderHistory";

/* CONTEXT */
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

/* ROUTES */
import ProtectedRoute from "./routes/ProtectedRoute";

const App = () => {
  return (
    <BrowserRouter>
  
  
        <AuthProvider>
          <CartProvider>
            <Routes>
              {/* PUBLIC */}
              <Route path="/" element={<Home />} />
              <Route path="/recipes" element={<Recipes />} />
              <Route path="/recipes/:id" element={<RecipesDetails />} />
              <Route path="/taste" element={<Taste />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogDetail />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/kitchen" element={<Kitchen />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
                <Route path="/services" element={<Services />} />
                <Route path="/about" element={<About />} />

              {/* CUSTOMER NEW */}
              <Route path="/profile" element={<Profile />} />
              <Route path="/orders" element={<OrderHistory />} />

              {/* ADMIN DASHBOARD */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              {/* FALLBACK */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </CartProvider>
        </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
