import jwt from 'jsonwebtoken';

export const Auth = (req, res, next) => {
    const cookie = req.cookies.AuthCookie;
    if(!cookie) return res.status(401).send('Access denied')

    try {
        const userVerified = jwt.verify(cookie, process.env.SECRET)
        next()
    } catch (error) {
        res.status(401).send('Access Denied')
        console.log(error)
    }
}