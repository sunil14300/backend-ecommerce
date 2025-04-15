const UserModel = require("../models/user");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendMail =require('./../mailsend');

const signup = async (req, res) => {
    try {
      const { username, email, password, phone } = req.body;
  
      // Check if user already exists
      const existingUser = await UserModel.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          message: "User already exists, you can login",
          success: false,
        });
      }
  
      // Hash password before storing
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create and save new user
      const newUser = new UserModel({
        username,
        email,
        password: hashedPassword,
        phone,
      });
  
      await newUser.save();
  
      // Send welcome email
      const emailResponse = await sendMail(email, username);
  
      if (!emailResponse.success) {
        console.error("Email Error:", emailResponse.error);
        return res.status(500).json({
          message: "Signup successful, but email not sent.",
          success: true,
        });
      }
  
      res.status(201).json({
        message: "Signup successful! A confirmation email has been sent.",
        success: true,
      });
  
    } catch (err) {
      console.error("Signup Error:", err);
      res.status(500).json({
        message: "Internal server error",
        success: false,
      });
    }
  };

module.exports = signup;


const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password required",
                success: false
            });
        }

        // Find user in database
        const user = await UserModel.findOne({ email });
        const errormsg = "Auth failed: Email or password is wrong";

        if (!user) {
            return res.status(401).json({
                message: errormsg, // ✅ Using variable correctly
                success: false
            });
        }

        // Check password
        const isEqualPassword = await bcrypt.compare(password, user.password);
        if (!isEqualPassword) {
            return res.status(403).json({
                message: errormsg,
                success: false
            });
        }

        // Ensure JWT_SECRET is set
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET is missing in .env file");
            return res.status(500).json({
                message: "Internal server error: Missing JWT_SECRET",
                success: false
            });
        }

        // Generate JWT token
        const jwtToken = jwt.sign(
            { email: user.email, _id: user.id },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: "Login successful",
            success: true,
            jwtToken,
            email,
            username: user.username // ✅ Fixed field name
        });

    } catch (error) {
        console.error("Login Error:", error); // ✅ Corrected variable
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

module.exports = { signup, login };
