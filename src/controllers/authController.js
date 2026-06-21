import {pool} from "../config/db.js";
import bcrypt from 'bcryptjs';
import generateToken from "../utils/generatetoken.js";
import verifyToken from "../middleware/authMiddleware.js";

const signup = async (req, res) => {
  const {firstname, lastname, username, email, password, birth_date, role} = req.body;

  const userExist = await pool.query('SELECT * FROM users WHERE email = $1 OR username = $2', [email, username]);
  if( userExist.rows[0]) { 
      if(userExist.rows[0].email === email) {
        return res
        .status(400)
        .json({error: "User already exist with this email"});

      } else if(userExist.rows[0].username === username) {
        return res
        .status(400) 
        .json({error: "Username already taken"})
      }
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const queryInsert = await pool.query(
  `INSERT INTO users (firstname, lastname, username, email, password, birth_date)
   VALUES ($1, $2, $3, $4, $5, $6)
   RETURNING *`,
  [firstname, lastname, username, email, hashedPassword, birth_date]
)

  
  
  const token = generateToken(queryInsert.rows[0].id, res);
  res.status(201)
  .json({message: "account was created successfully!"}); 
  

};

const login = async(req,res) => {
  const {email, username, password} = req.body;
  const user = await pool.query('SELECT * FROM users WHERE email =$1 OR username=$2', [email, username]);

  if(!user.rows[0]) {
    return res
    .status(401)
    .json({error: "Invalid email or password"}) 
  }

  const isPasswordValid = await bcrypt.compare(password, user.rows[0].password);

  if (!isPasswordValid) {
    return res
    .status(401)
    .json({error: "Invalid email or password"});
  }

  const token = generateToken(user.rows[0].id, res);
  const { password: _, ...userwithoutpassword } = user.rows[0];
  res.status(200).json({
    status: "success",
    message: "login successful"
  })

  
};

const logout = async(req,res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0)
  });
  res.status(200).json({
    status: "success", 
    message: "Logged out successfully"
  })
}
const profile = async(req,res) => { 
  const user = req.user
  return res
  .status(200)
  .json({
    status: "success",
    user: user});
};

export {signup, login, logout, profile};