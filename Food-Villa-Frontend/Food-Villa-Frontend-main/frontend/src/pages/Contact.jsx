import { useState } from "react";
import axios from "axios";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/footer";
import "../styles/index.css";

import {
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaPen,
} from "react-icons/fa";

const API_BASE = "http://localhost:5000/api";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  /* HANDLE CHANGE */
const handleChange = (e) => {
  let { name, value } = e.target;

  // NAME: no starting space
  if (name === "name") {
    value = value.replace(/^\s+/g, "");
  }

  // MOBILE: allow ONLY numbers
  if (name === "mobile") {
    value = value.replace(/[^0-9]/g, "");
  }

  setForm({
    ...form,
    [name]: value,
  });
};

  /* SUBMIT FORM */
  const handleSubmit = async (e) => {
  e.preventDefault();

  const nameRegex = /^[A-Za-z]{3,}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const mobileRegex = /^[0-9]{10}$/;

  if (!nameRegex.test(form.name)) {
    alert("Name must be at least 3 letters and contain no spaces");
    return;
  }

  if (!emailRegex.test(form.email)) {
    alert("Enter a valid email address");
    return;
  }

  if (!mobileRegex.test(form.mobile)) {
    alert("Mobile number must be exactly 10 digits");
    return;
  }

  if (form.message.trim().length < 3) {
    alert("Message must be at least 3 characters");
    return;
  }

  try {
    setLoading(true);

    await axios.post(`${API_BASE}/contact`, form);

    setForm({
      name: "",
      email: "",
      mobile: "",
      message: "",
    });
  } catch (error) {
    console.error(error);
    alert("Failed to send message");
  } finally {
    setLoading(false);
  }
};

return (
    <>
      <Navbar />

      <section className="ct-page">
        <div className="ct-container">
          {/* LEFT */}
          <div className="ct-left">
            <h2>Get in touch</h2>
            <div className="ct-divider"></div>

            <p>
              <strong>Mob:</strong> 0000 000 0000
            </p>
            <p>
              <strong>Email:</strong> foodvilla@gmail.com
            </p>
            <p>
              <strong>Address:</strong> Lorem Ipsum
            </p>

            <form
              className="ct-form"
              onSubmit={handleSubmit}
            >
              <div className="ct-input">
                <FaUser className="ct-icon" />
                <input
                  type="text"
                  name="name"
                  placeholder="Your name *"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="ct-input">
                <FaEnvelope className="ct-icon" />
                <input
                  type="email"
                  name="email"
                  placeholder="Your email *"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="ct-input ct-full">
                <FaPhoneAlt className="ct-icon" />
                <input
                  type="tel"
                  name="mobile"
                  placeholder="Your Mobile Number"
                  value={form.mobile}
                  onChange={handleChange}
                  maxLength={10}
                  required
                />
              </div>

              <div className="ct-input ct-full">
                <FaPen className="ct-icon ct-textarea-icon" />
                <textarea
                  name="message"
                  placeholder="Your message"
                  rows="5"
                  value={form.message}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="ct-submit"
              >
                {loading ? "Sending..." : "Send email"}
              </button>
            </form>
          </div>

          {/* RIGHT – MAP */}
          <div className="ct-right">
            <iframe
              title="Google Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1856.0909891213375!2d70.42407717768297!3d21.50059086939632!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3957ff6750a83db3%3A0xddcb24c789dd4e75!2sAvadh%20Web!5e0!3m2!1sen!2sin!4v1766041123892!5m2!1sen!2sin"
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Contact;
