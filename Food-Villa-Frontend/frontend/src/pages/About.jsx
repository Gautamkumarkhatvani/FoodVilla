import React from "react";
import "../styles/index.css";
import aboutImg from "../assets/slider/slide1.jpg";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/footer";

const About = () => {
  return (<>
  <Navbar/>
    <section className="about-modern">

      <div className="about-container">

        {/* LEFT TEXT */}
        <div className="about-left">
          <h1>
            <span>SUPERIOR CUSTOMER</span><br />
            SUPPORT IS AT YOUR <br />
            FINGERTIPS WITH <br />
            OUR FOODVILLA PLATFORM
          </h1>

          <ul className="about-points">
            <li>Instant Support</li>
            <li>Quick Responses</li>
            <li>Request Refunds</li>
            <li>Submit Feedback</li>
            <li>Request New Products</li>
          </ul>
        </div>

        {/* RIGHT IMAGE */}
        <div className="about-right">
          <img src={aboutImg} alt="FoodVilla Support" />
        </div>

      </div>

    </section>
    <Footer />
    </>
  );
};

export default About;
// import React from "react";
// import "./../styles/index.css";

// import img1 from "../../src/assets/slider/slide3.jpg";
// import img2 from "../../src/assets/slider/slide3.jpg";
// import Navbar from "../components/layout/Navbar";
// import Footer from "../components/layout/footer";

// const About = () => {
//   return (
//     <>
//     <Navbar />
//     <section className="about">

//       <h1 className="about-title">About FoodVilla</h1>

//       {/* Section 1 */}
//       <div className="about-section">
//         <div className="about-image">
//           <img src={img1} alt="FoodVilla" />
//         </div>

//         <div className="about-text">
//           <h2>Who We Are</h2>
//           <p>
//             FoodVilla is your ultimate destination for delicious recipes,
//             smart kitchen solutions, and food inspiration. We aim to bring
//             convenience and taste together in one platform.
//             FoodVilla is your ultimate destination for delicious recipes,
//             smart kitchen solutions, and food inspiration. We aim to bring
//             convenience and taste together in one platform.
//             FoodVilla is your ultimate destination for delicious recipes,
//             smart kitchen solutions, and food inspiration. We aim to bring
//             convenience and taste together in one platform.
//             FoodVilla is your ultimate destination for delicious recipes,
//             smart kitchen solutions, and food inspiration. We aim to bring
//             convenience and taste together in one platform.
//             FoodVilla is your ultimate destination for delicious recipes,
//             smart kitchen solutions, and food inspiration. We aim to bring
//             convenience and taste together in one platform.
//             FoodVilla is your ultimate destination for delicious recipes,
//             smart kitchen solutions, and food inspiration. We aim to bring
//             convenience and taste together in one platform.
//             FoodVilla is your ultimate destination for delicious recipes,
//             smart kitchen solutions, and food inspiration. We aim to bring
//             convenience and taste together in one platform.
//             FoodVilla is your ultimate destination for delicious recipes,
//             smart kitchen solutions, and food inspiration. We aim to bring
//             convenience and taste together in one platform.
//           </p>
//           <p>
//             From modern vending to curated recipes, we serve food lovers with
//             quality and passion.
            
//           </p>
//         </div>
//       </div>

//       {/* Section 2 (Reverse) */}
//       <div className="about-section reverse">
//         <div className="about-image">
//           <img src={img2} alt="Food Experience" />
//         </div>

//         <div className="about-text">
//           <h2>Our Mission</h2>
//           <p>
//             Our mission is to make food experiences smarter, faster, and more
//             enjoyable. Whether it’s cooking at home or ordering your favorite
//             dish, we simplify everything.
//           </p>
//           <p>
//             We believe food is not just a need — it’s an emotion ❤️
//             FoodVilla is your ultimate destination for delicious recipes,
//             smart kitchen solutions, and food inspiration. We aim to bring
//             convenience and taste together in one platform.
//             FoodVilla is your ultimate destination for delicious recipes,
//             smart kitchen solutions, and food inspiration. We aim to bring
//             convenience and taste together in one platform.
//             FoodVilla is your ultimate destination for delicious recipes,
//             smart kitchen solutions, and food inspiration. We aim to bring
//             convenience and taste together in one platform.
//             FoodVilla is your ultimate destination for delicious recipes,
//             smart kitchen solutions, and food inspiration. We aim to bring
//             convenience and taste together in one platform.
//           </p>
//         </div>
//       </div>

//     </section>
//     <Footer />
//     </>
//   );
// };

// export default About;