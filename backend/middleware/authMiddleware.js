import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    try {
        //Get authorization header
        const authHeader = req.headers.authorization;

        //Check if token exists
        if(!authHeader || !authHeader.startsWith("Bearer")) {
            return res.status(401).json({
                error: "Unauthorization access"
            });
        }

        //Extract token 
        const token = authHeader.split(" ")[1];

        //Verify token 
        const decoded = jwt.verify(
            token, 
            process.env.JWT_SECRET
        );

        //Attach user data to request 
        req.user = decoded;

        //Continue to next route 
        next();
    } catch(err){
        console.log(err)
        res.status(401).json({
            error:"Invalid token"
        })
    }
}

export default authMiddleware; 