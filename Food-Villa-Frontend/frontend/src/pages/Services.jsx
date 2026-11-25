import React from "react";
import ServiceCard from "../components/Services/ServiceCard";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/footer";
import ".././styles/index.css";

import vending from "../../src/assets/slider/slide3.jpg";
import coffee from "../../src/assets/slider/slide3.jpg";
import pantry from "../../src/assets/slider/slide3.jpg";
import catering from "../../src/assets/slider/slide3.jpg";

const Services = () => {
  const data = [
    {
      title: "Modern Vending",
      image: vending,
      description: "Smart vending machines with fresh snacks and drinks.",
    },
    {
      title: "Office Coffee",
      image: coffee,
      description: "Premium coffee solutions for your workplace.",
    },
    {
      title: "Pantry Service",
      image: pantry,
      description: "Fully managed pantry services for your office.",
    },
    {
        title: "Custom Catering",
        image: catering,
        description: "Tailored catering solutions for events and meetings.",
    }
  ];

  return (
   <>
    <Navbar />
    <section className="services">
      <h2>Our Services</h2>

      <div className="card-container">
        {data.map((item, index) => (
          <ServiceCard key={index} {...item} />
        ))}
      </div>
    </section>

    <Footer />
    </>
  );
};

export default Services;