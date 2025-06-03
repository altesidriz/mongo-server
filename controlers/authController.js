import User from "../models/User.js";
import bcrypt from "bcrypt"; // Keep 'bcrypt' if that's what you're using. If not, use 'bcryptjs'.
import { createError } from "../error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
    try {
        // Hash the password
        const salt = bcrypt.genSaltSync(10); // 10 salt rounds is a good standard
        const hash = bcrypt.hashSync(req.body.password, salt);

        // Create a new user instance
        const newUser = new User({ ...req.body, password: hash });

        // Save the new user to the database
        const savedUser = await newUser.save(); // Capture the saved user to ensure it has _id

        // Generate JWT Token
        // The token payload contains the user's ID
        const token = jwt.sign({ id: savedUser._id }, process.env.JWT, {
            expiresIn: '3h' // Token expires in 3 hours for security
        });

        // Exclude the password from the response object for security
        const { password, ...otherDetails } = savedUser._doc; // _doc gives the plain JS object from Mongoose

        // Send the token as an HTTP-only cookie and the user's details
        res
            .cookie("access_token", token, {
                httpOnly: true, // Makes the cookie inaccessible to client-side JavaScript
                maxAge: 3 * 60 * 60 * 1000, // Cookie expires in 3 hours (milliseconds)
                // In production, consider adding:
                // secure: process.env.NODE_ENV === 'production', // Send cookie only over HTTPS
                // sameSite: 'Lax', // Protects against CSRF attacks
            })
            .status(200)
            .json(otherDetails); // Send the user object (without the password)

    } catch (err) {
        next(err); // Pass any errors to your global error handler
    }
};

export const signin = async (req, res, next) => {
    try {
        // Search for user by name in the database
        const user = await User.findOne({ name: req.body.name });
        // Handler if user not found
        if (!user) return next(createError(404, "User was not found!"));

        // Compare the provided password with the hashed password in the database
        const isCorrect = await bcrypt.compare(req.body.password, user.password); // Await bcrypt.compare as it returns a Promise
        // Handler for wrong password
        if (!isCorrect) return next(createError(400, "Wrong credentials!"));

        // Generate JWT Token
        const token = jwt.sign({ id: user._id }, process.env.JWT, {
            expiresIn: '3h' // Token expires in 3 hours
        });

        // Exclude the password from the response object
        const { password, ...otherDetails } = user._doc;

        // Send the token as an HTTP-only cookie and the user's details
        res
            .cookie("access_token", token, {
                httpOnly: true,
                maxAge: 3 * 60 * 60 * 1000, // 3 hours in milliseconds
                // In production, consider adding:
                // secure: process.env.NODE_ENV === 'production',
                // sameSite: 'Lax',
            })
            .status(200)
            .json(otherDetails); // Send the user object (without the password)

    } catch (err) {
        next(err);
    }
};

export const logout = (req, res) => {
    // Clear the access_token cookie
    res
        .clearCookie("access_token", {
            sameSite: "Lax", // Ensure these match what you set on signin/signup
            secure: process.env.NODE_ENV === 'production', // Use secure in production
        })
        .status(200)
        .json("User has been logged out."); // Send a success message
};

// Keeping googleAuth as is, since you asked to ignore it for this change.
export const googleAuth = async (req, res, next) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (user) {
        const token = jwt.sign({ id: user._id }, process.env.JWT); // Consider adding expiresIn here too
        res
          .cookie("access_token", token, {
            httpOnly: true,
          })
          .status(200)
          .json(user._doc);
      } else {
        const newUser = new User({
          ...req.body,
          fromGoogle: true,
        });
        const savedUser = await newUser.save();
        const token = jwt.sign({ id: savedUser._id }, process.env.JWT); // Consider adding expiresIn here too
        res
          .cookie("access_token", token, {
            httpOnly: true,
          })
          .status(200)
          .json(savedUser._doc);
      }
    } catch (err) {
      next(err);
    }
};