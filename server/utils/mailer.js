import nodemailer from "nodemailer";
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export default async function sendEmail({ email, emailType, userId }) {
  try {
    if (!userId) throw new Error("userId is undefined in sendEmail");
    console.log("✅ userId received in sendEmail:", userId);

    const hashedToken = await bcryptjs.hash(userId.toString(), 10);
    console.log("✅ hashedToken:", hashedToken);

    let update;
    if (emailType === "VERIFY") {
      update = await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
    } else if (emailType === "RESET") {
      update = await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    console.log("✅ DB update result:", update);

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
      },
    });

    const emailOptions = {
      from: process.env.SOURCE_EMAIL,
      to: email,
      subject:
        emailType === "VERIFY" ? "Verify your email" : "Reset your password",
      html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px;">
  <h2 style="color: #4CAF50;">Action Required!</h2>
  <p>
    Click the button below to 
    <strong>
      ${emailType === "VERIFY" ? "verify your email" : "reset your password"}
    </strong>.
  </p>
  <a 
    href="${process.env.DOMAIN}/auth/${
        emailType === "VERIFY" ? "verifyemail" : "reset-password"
      }?token=${hashedToken}" 
    style="
      display: inline-block;
      padding: 10px 20px;
      margin-top: 10px;
      background-color: #4CAF50;
      color: white;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
    "
    target="_blank"
  >
    ${emailType === "VERIFY" ? "Verify Email" : "Reset Password"}
  </a>
  <h1>----OR---</h1>
  <h2>Copy & Paste the below url in your browser.</h2>
  <p>${process.env.DOMAIN}/auth/${
        emailType === "VERIFY" ? "verifyemail" : "reset-password"
      }?token=${hashedToken}</p>
  <p style="margin-top: 20px; font-size: 12px; color: #888;">
    If you didn't request this, you can safely ignore this email.
  </p>
</div>
`,
    };

    const mailresponse = await transporter.sendMail(emailOptions);
    console.log("✅ Email sent");
    return mailresponse;
  } catch (error) {
    console.error("❌ sendEmail error:", error);
    throw new Error("Error sending email: " + error.message);
  }
}
