import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import API from "../api/axios";

const GoogleLoginBtn = ({ onSuccess }) => {
  return (
    <GoogleLogin
      onSuccess={async (credentialResponse) => {
        try {
          const user = jwtDecode(credentialResponse.credential);

          await API.post("/customers/send-otp", {
            email: user.email,
            name: user.name,
            googleId: user.sub,
          });

          onSuccess({
            email: user.email,
            name: user.name,
          });
        } catch (err) {
          alert("OTP send failed");
        }
      }}
      onError={() => alert("Google Login Failed")}
    />
  );
};

export default GoogleLoginBtn;
