import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js"

const router = express.Router();

//SIGNUP ROUTE
router.post("/signup", async(req, res) => {
    try{
        const {name, email, password} = req.body;

        // Validate fields
        if(!name || !email || !password) {
            return res.status(400).json({
                error: "All fields are required"
            });
        }

        // Check if user already exists 
        const existingUser = await User.findOne({email});

        if(existingUser) {
            return res.status(400).json({
                error: "User already exists"
            });
        }

        // Hash Password 
        const hashPassword = await bcrypt.hash(password, 10);

        // Create User 
        const user = new User({
            name, 
            email, 
            password: hashPassword
        });

        // Save User 
        await user.save();

        // Generate JWT token 
        const token = jwt.sign(
            {
                userId: user._id
            },
            process.env.JWT_SECRET, 
            {
                expiresIn: "7d"
            }
        ); 

        //SEND response
        res.status(201).json({
            message: "signup successful",
            token, 
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (err) {
        console.log(err);

        res.status(500).json({
            error: "Signup failed"
        });
    }
});

//LOGIN ROUTE 
router.post("/login", async(req, res)=> {
    try {
        const {email, password} = req.body;

        // Check if user exists 
        const user = await User.findOne({email});

        if (!user){
            return res.status(400).json({
                error: "Invalid credentials"
            }); 
        }

        //Compares password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if(!isMatch) {
            return res.status(400).json({
                error: "Invalid credentials"
            })
        }

        //Generate JWT Token 
        const token = jwt.sign(
            {
                userId: user._id 
            }, 
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );


        // Send response
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            error: "Login failed"
        });
    }
});

export default router; 