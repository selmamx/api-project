import jwt from "jsonwebtoken";
import {pool} from '../config/db.js';
import generateToken from "../utils/generatetoken.js";
import cookieParser from "cookie-parser";

const verifyToken = async(req, res, next) => {
  const token = req.cookies.jwt;

  if(!token) {
    return res.status(401).json({error: "Unauthorized - no token"});
  }
  try {
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    const user = await pool.query('SELECT * FROM users WHERE id = $1 ',[decoded.userId]);

    if(!user.rows[0]) {
      return res
      .status(401)
      .json({error: "User no longer exists"});
    }
    req.user=user.rows[0];
    next();
  }catch(err) {
    return res.status(401).json({ error: "Not authorized, token failed"})
  }

}
    
export default verifyToken;