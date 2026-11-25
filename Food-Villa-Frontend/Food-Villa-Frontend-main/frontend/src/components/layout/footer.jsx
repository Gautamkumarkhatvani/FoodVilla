import "../../styles/index.css";
import Logo from "../../assets/footer/logo.svg";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-left">
          <img src={Logo} alt="Food Logo" className="footer-logo" />
          <p className="footer-desc">
            It is a long established fact that a be distracted by the readable
            when looking at its layout.
          </p>
        </div>

        <div className="footer-links">
          <a href="/">Home</a>
          <a href="/contact">Contact Us</a>
          <a href="/about">About</a>
          <a href="/blog">Blog</a>
          <a href="/services">Service</a>
        </div>

        <div className="footer-newsletter">
          <p className="footer-newsletter-title">Newsletter</p>
          <input
            type="text"
            placeholder="Enter your email"
            className="footer-input"
          /><br />
          <button className="footer-send-btn">Send</button>
        </div>
      </div>

      {/* COPYRIGHT SECTION */}
      <div className="footer-copyright">
        © {new Date().getFullYear()} Food Villa. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
