import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import API from "../api/axios";
import { useCustomerAuth } from "../context/CustomerAuthContext";
import "../styles/index.css";

const CustomerLogin = () => {
  const { login } = useCustomerAuth();

  const [step, setStep] = useState("google");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const user = jwtDecode(credentialResponse.credential);
      setEmail(user.email);

      setLoading(true);

      await API.post("/customers/send-otp", {
        email: user.email,
        name: user.name,
        googleId: user.sub,
      });

      setStep("otp");
    } catch (err) {
      console.error(err);
      alert("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      alert("Enter OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post(
        "/customers/verify-otp",
        { email, otp }
      );

      login(res.data);
    } catch (err) {
      console.error(err);
      alert("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cl-wrapper">
      <div className="cl-box">
        {step === "google" && (
          <>
            <h2 className="cl-title">
              Login with Google
            </h2>

            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() =>
                alert("Google Login Failed")
              }
            />

            {loading && (
              <p className="cl-loading">
                Sending OTP...
              </p>
            )}
          </>
        )}

        {step === "otp" && (
          <>
            <h2 className="cl-title">
              Enter OTP
            </h2>

            <p className="cl-sub">
              OTP sent to <strong>{email}</strong>
            </p>

            <input
              className="cl-input"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value)
              }
            />

            <button
              className="cl-btn"
              onClick={verifyOtp}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default CustomerLogin;
