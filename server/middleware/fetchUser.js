const jwt = require("jsonwebtoken")

const JWT_SECRET = 'ThisAsecretThread';

const fetchUser = (req,res,next)=> {
    //Get user  from the given auth-token

    const token = req.header("auth-token");
    if(!token){
        res.status(401).json({errors: "Please authenticate with a valid token"})
    }

    try{
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    }catch(error){
        console.log(error.message);
        res.status(401).json({errors: "Please authenticate with a valid token"})
    }

}

module.exports = fetchUser;