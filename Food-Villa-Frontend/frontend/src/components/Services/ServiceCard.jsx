import React from "react";
import "../../styles/index.css";

const ServiceCard = ({ title, image, description }) => {
  return (
    <div className="card">
      <div className="card-inner">

        {/* Front */}
        <div className="card-front">
          <img src={image} alt={title} />
          <h3>{title}</h3>
        </div>

        {/* Back */}
        <div className="card-back">
          <h3>{title}</h3>
          <p>{description}</p>
          <button>Learn More</button>
        </div>

      </div>
    </div>
  );
};

export default ServiceCard;