const jwt = require('jsonwebtoken');

const auth = (req,res,next)=>{
  const token = req.header('authorization')
  if(!token) return res.status(401).json({message:"Access denied"});
  try {
    const verified = jwt.verify(token,process.env.JWT_SECRET_KEY);
    req.user = verified.user;
    next();
  } catch (err) {
    res.status(401).json({error:"Invalid Token: "+err})
  }
}

module.exports = auth;