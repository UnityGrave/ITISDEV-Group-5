const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { check, validationResult } = require('express-validator');

const router = express.Router();

// @route   POST /api/auth/signup
// @desc    Register a new user
router.post(
    '/signup',
    [
        check('fullName', 'Full Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
        check('phoneNumber', 'Phone number is required').not().isEmpty(),
        check('role', 'Role is required and must be either customer or admin').not().isEmpty().isIn(['customer', 'admin']),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { fullName, email, password, phoneNumber, role } = req.body;

        try {
            let user = await User.findOne({ email });
            if (user) return res.status(400).json({ msg: 'User already exists' });

            // Hash the password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            user = new User({
                fullName,
                email,
                password: hashedPassword,
                phoneNumber,
                role,
            });

            await user.save();

            // Generate JWT Token
            const token = jwt.sign(
                { userId: user.id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.status(201).json({
                token,
                user: {
                    id: user.id,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role,
                },
            });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ msg: 'Server error' });
        }
    }
);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post(
    '/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists(),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            let user = await User.findOne({ email });
            if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

            // Generate JWT Token
            const token = jwt.sign(
                { userId: user.id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.json({
                token,
                user: {
                    id: user.id,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role,
                },
            });
        } catch (error) {
            console.error(error.message);
            res.status(500).json({ msg: 'Server error' });
        }
    }
);

module.exports = router;
