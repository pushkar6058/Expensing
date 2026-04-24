import User from "../models/User.js";
import jwt from "jsonwebtoken";

function toSafeUser(user) {
    return {
        _id: user._id,
        name: user.name,
        email: user.email,
    };
}

const userRegisterController=async(req,res)=>{
    try {
        if (!req.body) {
            return res.status(400).json({message:"Request body is missing. Make sure to send JSON with Content-Type: application/json"});
        }
        const {name,email,password}=req.body;

        if(!name || !email || !password){
            return res.status(400).json({message:"All fields are required"});
        }

        const user=await User.create({name,email,password});
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"1h"});
        res.cookie("token",token,{httpOnly:true,maxAge:60*60*1000});

        return res.status(201).json({message:"User registered successfully",user: toSafeUser(user)});

    } catch (error) {

        return res.status(500).json(
            {
                message:"Internal server error",
                error:error.message
            });
    }
}

const userLoginController=async(req,res)=>{
    try {
        if (!req.body) {
            return res.status(400).json({message:"Request body is missing. Make sure to send JSON with Content-Type: application/json"});
        }
        const {email,password}=req.body;

        if(!email || !password){
            return res.status(400).json({message:"All fields are required"});
        }

        const user=await User.findOne({email});
        if(!user){
            return res.status(404).json({message:"User not found"});
        }

        const isPasswordValid=await user.comparePassword(password);
        if(!isPasswordValid){
            return res.status(401).json({message:"Invalid password"});
        }
        const token=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"1h"});
        res.cookie("token",token,{httpOnly:true,maxAge:60*60*1000});
        return res.status(200).json({message:"User logged in successfully",user: toSafeUser(user)});
    } catch (error) {
        return res.status(500).json(
            {
                message:"Internal server error",
                error:error.message
            });
    }
}

export const getCurrentUser = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.clearCookie('token');
    return res.status(401).json({ message: 'Invalid token' });
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie('token');
  return res.status(200).json({ message: 'Logged out successfully' });
};

export {userLoginController,userRegisterController};
