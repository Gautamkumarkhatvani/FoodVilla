import axios from "axios";

export const sendOtpEmail = async (email, otp) => {
  try {
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: "FoodVilla",
          email: process.env.BREVO_EMAIL,
        },
        to: [{ email }],
        subject: "Your FoodVilla login OTP",
        htmlContent: `
  <p>Hello 👋</p>
  <p>Your FoodVilla login OTP is:</p>
  <h2>${otp}</h2>
  <p>This OTP expires in 10 minutes.</p>
`
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("OTP SENT SUCCESSFULLY (Brevo API)");
  } catch (error) {
    console.error(
      "BREVO API ERROR:",
      error.response?.data || error.message
    );
    throw error;
  }
};