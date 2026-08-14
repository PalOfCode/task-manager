const jwt=require("jsonwebtoken");
module.exports=function authenticateToken(req,res,next){
 const h=req.headers.authorization||""; const [scheme,token]=h.split(" ");
 if(scheme!=="Bearer"||!token)return res.status(401).json({success:false,message:"Authentication required."});
 try{req.user=jwt.verify(token,process.env.JWT_SECRET);next()}catch(e){return res.status(401).json({success:false,message:"Invalid or expired token."})}
};
