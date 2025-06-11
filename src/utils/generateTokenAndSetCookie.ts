import jwt from 'jsonwebtoken';
const generateTokenAndSetCookie = (userId: string, res: any) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET as string, {
        expiresIn: '7d', // Token expiration time
    });
    res.cookie('token', token, {
        httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'Strict', // Helps prevent CSRF attacks
    });
}
export default generateTokenAndSetCookie;