const jwt = require('jsonwebtoken');


interface details{
    id:string;
    email:string;
}


export const createTokenForUser = async(user:details)=>{
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined in environment variables");
    }

    const payload = {
        userId: user.id,
        email: user.email,
        // Add any other relevant user information you want in the token payload
      };
    
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
      return token;
}

