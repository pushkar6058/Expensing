import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function getAuthenticatedUser(req) {
  const token = req.cookies?.token;
  // console.log(token, "user is authenticated");
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return await User.findById(decoded.id);
  } catch {
    return null;
  }
}
