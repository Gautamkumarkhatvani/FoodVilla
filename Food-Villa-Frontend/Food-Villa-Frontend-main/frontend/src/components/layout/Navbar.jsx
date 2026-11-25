import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/index.css";

import LogoIcon from "../../assets/icons/logo.svg";
import Icon1 from "../../assets/icons/icon1.svg";
import Icon2 from "../../assets/icons/icon2.svg";
import Icon3 from "../../assets/icons/icon3.svg";
import Icon4 from "../../assets/icons/icon4.svg";
import Icon5 from "../../assets/icons/icon5.svg";
import Icon6 from "../../assets/icons/icon6.svg";
import Icon7 from "../../assets/icons/icon7.svg";

/* NAV ITEMS */
const navItems = [
  { id: "item1", icon: Icon1, label: "Kitchen", type: "route", path: "/kitchen" },
  { id: "item2", icon: Icon2, label: "Taste", type: "route" },
  { id: "item3", icon: Icon3, label: "Recipes", type: "route" },
  { id: "item4", icon: Icon4, label: "Blog", type: "route" },
  { id: "item5", icon: Icon5, label: "Contact", type: "route" },
  { id: "item6", icon: Icon6, label: "facebook", type: "route" },
];

const extraItems = [
  // {
  //   id: "item6",
  //   icon: Icon6,
  //   label: "Facebook",
  //   external: "https://facebook.com",
  // },
  {
    id: "item7",
    icon: Icon7,
    label: "X",
    external: "https://x.com",
  },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen((prev) => !prev);

  /* HANDLE NAV CLICK  */
  const handleNavClick = (item) => {
    setIsOpen(false);

    //  Route navigation
    if (item.type === "route") {
      if (item.label === "Taste") {
        navigate("/taste");
      } else if (item.label === "Contact") {
        navigate("/contact");
      }else if(item.label ==="Blog"){
        navigate("/Blog")
      }else if(item.label ==="Recipes"){
        navigate("/Recipes")
      }
      else if(item.label==="Kitchen"){
        navigate("/Kitchen")
      }
       else if(item.label==="facebook"){
        navigate("/login")
      }
      return;
    }

    //  Scroll navigation
    const section = document.getElementById(item.label.toLowerCase());
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleExternal = (url) => {
    setIsOpen(false);
    window.open(url, "_blank");
  };

  return (
    <div className="navbar-wrapper">
      <nav className="navbar">
        {/* LOGO  */}
        <div className="navbar-left">
          <button
            type="button"
            className="nav-logo-btn"
            onClick={() => navigate("/")}
          >
            <img src={LogoIcon} alt="Food Villa Logo" className="nav-logo-icon" />
          </button>
        </div>

        {/* HAMBURGER */}
        <button
          type="button"
          className={`nav-toggle ${isOpen ? "is-open" : ""}`}
          aria-expanded={isOpen}
          onClick={toggleMenu}
        >
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </button>

        {/* NAV MENU */}
        <div className={`navbar-right ${isOpen ? "is-open" : ""}`}>
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className="nav-item"
              onClick={() => handleNavClick(item)}
            >
              <img src={item.icon} alt={item.label} className="nav-icon-img" />
              <span className="nav-label">{item.label}</span>
            </button>
          ))}

          {extraItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className="nav-item nav-item-extra"
              onClick={() => handleExternal(item.external)}
            >
              <img src={item.icon} alt={item.label} className="nav-icon-img" />
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
