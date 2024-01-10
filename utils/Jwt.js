import jwt from "jsonwebtoken"
import dotend from "dotenv"
dotend.config()

const secret = `${process.env.JWT_SECRET}` || 'secretKey'

export const generateToken = (user) => {
    return jwt.sign(
        {
            email: user.email,
            role: user.role,
        },
        secret,
        { expiresIn: "24h" }
    )
}

export const verifyToken = (token) => {
    return jwt.verify(token, secret)
}