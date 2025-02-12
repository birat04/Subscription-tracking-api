import { mongoose } from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";

export const signUp = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const{ name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            const error = new Error('User already exists');
            error.statusCode = 409;
            throw error;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password,salt);

        const newUsers = await User.create([{name, email, password:hashedPassword}], {session});
        const token = jwt.sign({ userId: newUsers[0]._id}, JWT_SECRET, {expiresIn: JWT_EXPIRES_IN});

        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: {
                token,
                user: newUsers[0],
            }
        })
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
    
};
export const signIn = async (req, res, next) => {
    try {
        console.log("SignIn request received");

        const { email, password } = req.body;
        console.log("Received email:", email);

        const user = await User.findOne({ email });
        if (!user) {
            console.log("User not found");
            const error = new Error("User not found!!");
            error.statusCode = 404;
            throw error;
        }

        console.log("User found, checking password...");
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log("Invalid password");
            const error = new Error("Password invalid!!");
            error.statusCode = 401;
            throw error;
        }

        console.log("Password valid, generating token...");
        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        console.log("Sending response...");
        res.status(200).json({
            success: true,
            message: "User signed in successfully",
            data: {
                token,
                user,
            },
        });
    } catch (error) {
        console.error("Error:", error.message);
        next(error);
    }
};



export const signOut = async (req, res, next) => {
};