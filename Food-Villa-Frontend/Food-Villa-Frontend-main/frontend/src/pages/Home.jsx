import "../styles/index.css";

import Navbar from "../components/layout/Navbar";
import AutoSlider from "../components/home/AutoSlider";
import TasteOfFood from "../components/home/TasteOfFood";
import Recipes from "../components/home/Recipes";
import BlogSection from "../components/home/BlogSection";
import Footer from "../components/layout/footer";

const Home = () => {
  return (
    <>
      <Navbar />

      <main>
        <AutoSlider />
        <TasteOfFood />
        <Recipes />
        <BlogSection />
      </main>

      <Footer />
    </>
  );
};

export default Home;
