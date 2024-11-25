import jwt from "jsonwebtoken";

const authMiddleware = async (req,res,next) => {
    const {userToken,adminToken} = req.cookies;

    if(!adminToken && !userToken)
        return res.status(401).json({success:false,message:"Please login"});

    if(adminToken)
    {
        const user = await jwt.verify(adminToken,process.env.JWT_SECRET);

        if(!user)
            return res.status(401).json({success:false,message:"Admin Not Found"});

        req.admin = user;
        next();
    }
    else
    {
        const user = await jwt.verify(userToken,process.env.JWT_SECRET);

        if(!user)
            return res.status(401).json({success:false,message:"User Not Found"});

        req.user = user;
        next();
    }
}

const adminauthMiddleware = async (req,res,next) => {
    const {adminToken} = req.cookies;

    if(!adminToken)
        return res.status(401).json({success:false,message:"Please login as Admin"});

    const user = await jwt.verify(adminToken,process.env.JWT_SECRET);

    if(!user)
        return res.status(401).json({success:false,message:"Admin Not Found"});

    req.admin = user;
    next();
}

export {
    authMiddleware,
    adminauthMiddleware,
}