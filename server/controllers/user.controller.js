import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

// Signup
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashed });
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    console.error("Error in signup controller", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

// Login
export const login = async (req, res) => {
  try {
    // Debugging line to check if JWT_SECRET is set
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error in login controller", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

// Logout
export const logout = async (req, res) => {
  try {
    // No server-side invalidation unless you manage blacklists
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Error in logout controller", error);
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

export async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "No user found!", success: true });
    }
    const emailRes = await sendEmail({
      email,
      emailType: "RESET",
      userId: user._id,
    });
    console.log("Email Response: ", emailRes);

    return res
      .status(200)
      .json({ emailRes, message: "Email sent successfully.", success: "true" });
  } catch (error) {
    console.log("Error in forgot password route: sending email failed", error);
    return res
      .status(500)
      .json({ error: "Error in seding forgot password email" + error });
  }
}
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.query;
    const { password } = req.body;
    console.log(token, password);
    const user = await User.findOne({
      forgotPasswordToken: token,
      forgotPasswordTokenExpiry: { $gt: Date.now() },
    }); // Check if the token is not expired });
    if (!user) {
      return res.status(400).json({ message: "no user found" });
    }
    //update password
    //hash password and replace old password with new password
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.forgotPasswordToken = undefined; // Remove the token from the user document
    user.forgotPasswordTokenExpiry = undefined; // Remove the token expiry from the user document
    await user.save(); // Save the updated user document

    // If the user is found and verified, send a success response
    return res
      .status(200)
      .json({ message: "Reset password successfull", success: true });
  } catch (error) {
    console.log("Error in reset password route:", error);
    return res.status(200).json({ error: "Error resetting password " });
  }
};
