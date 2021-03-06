var jwt = require('jsonwebtoken');

module.exports=(req,res,next)=>{
    try{
        const token=req.headers.authorization.split(" ")[1];  
        console.log(token)
        const decode=jwt.verify(token, 'secret');
        req.userData=decode;
        next();
    }catch(e){
        return res.status(401).json({
            message:"Auth fail"
        });
    }
}