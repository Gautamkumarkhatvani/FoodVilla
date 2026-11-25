import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import API from "../../api/axios";
import "../../styles/index.css";

const OtpModal = ({ onVerified }) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("login");
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);

      await API.post("/customers/send-otp", {
        email: decoded.email,
        name: decoded.name,
        googleId: decoded.sub,
      });

      setEmail(decoded.email);
      setName(decoded.name);
      setStep("otp");
    } catch (err) {
      console.error(err);
      alert("Google login failed");
    }
  };

  const verifyOtp = async () => {
    try {
      setLoading(true);

      const res = await API.post("/customers/verify-otp", {
        email,
        otp,
      });

      localStorage.setItem("token", res.data.token);

      onVerified({
        email,
        name,
      });
    } catch (err) {
      console.error(err);
      alert("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ckm-otp-wrapper">
      {step === "login" && (
        <>
          <h3 className="ckm-otp-title">Login with Google</h3>

          <div className="ckm-otp-google">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => alert("Google Login Failed")}
            />
          </div>
        </>
      )}

      {step === "otp" && (
        <>
          <h3 className="ckm-otp-title">
            Enter OTP sent to <span>{email}</span>
          </h3>

          <input
            type="text"
            placeholder="Enter 6 digit OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="ckm-otp-input"
          />

          <button
            type="button"
            onClick={verifyOtp}
            disabled={loading}
            className="ckm-primary-btn"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </>
      )}
    </div>
  );
};

export default OtpModal;
