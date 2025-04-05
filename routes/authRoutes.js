const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const router = express.Router();

// @route   POST /api/auth/signup
// @desc    Register a new user
// @access  Public
router.post(
    "/signup",
    [
        check("fullName", "Name is required").not().isEmpty(),
        check("email", "Please include a valid email").isEmail(),
        check("password", "Please enter a password with 6 or more characters").isLength({ min: 6 }),
        check("phoneNumber", "Phone number is required").not().isEmpty(),
        check("role", "Role is required").not().isEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { fullName, email, password, phoneNumber, role } = req.body;

        try {
            // Check if user already exists
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ msg: "User already exists" });
            }

            // Create new user
            user = new User({
                fullName,
                email,
                password,
                phoneNumber,
                role: role.toLowerCase()
            });

            // Hash password
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            // Save user to database
            await user.save();

            // Create JWT payload
            const payload = {
                user: {
                    id: user.id,
                    role: user.role
                }
            };

            // Sign JWT
            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: "1h" },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token, role: user.role });
                }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server error");
        }
    }
);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
    "/login",
    [
        check("email", "Please include a valid email").isEmail(),
        check("password", "Password is required").exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            let user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({ msg: "Invalid Credentials" });
            }

            console.log("🔍 Stored Password in DB:", user.password); // Debugging
            console.log("🔍 Entered Password:", password);

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ msg: "Invalid Password. Try Again." });
            }

            const payload = {
                userId: user.id,
                role: user.role, // Include role in the JWT payload
            };

            jwt.sign(
                payload,
                process.env.JWT_SECRET,
                { expiresIn: "1h" },
                (err, token) => {
                    if (err) throw err;
                    res.json({ token, role: user.role }); // Send role in response
                }
            );

        } catch (err) {
            console.error(err.message);
            res.status(500).send("Server Error");
        }
    }
);

module.exports = router;