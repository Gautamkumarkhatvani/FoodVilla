import React, { useEffect, useState } from "react";
import "../../styles/index.css";

import Slide1 from "../../assets/slider/slide1.jpg";
import Slide2 from "../../assets/slider/slide2.jpg";
import Slide3 from "../../assets/slider/slide3.jpg";

const images = [Slide1, Slide2, Slide3];

const AutoSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(id);
  }, []);

  return (
    <section id="home" className="as-slider">
      <div
        className="as-slider-track"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((src, idx) => (
          <div className="as-slide" key={idx}>
            <img
              src={src}
              alt={`Slide ${idx + 1}`}
              className="as-slide-img"
            />
          </div>
        ))}
      </div>

      <div className="as-slider-overlay">
        <div className="as-slider-overlay-content">
          <h1>Healthy Food Recipes</h1>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit.
          </p>

          <button
            type="button"
            onClick={() =>
              document
                .getElementById("taste")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Read More
          </button>
        </div>
      </div>
    </section>
  );
};

export default AutoSlider;
