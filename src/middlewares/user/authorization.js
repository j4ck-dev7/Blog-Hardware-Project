import jwt from 'jsonwebtoken';

export const auth = (req, res, next) => {
    const cookie = req.cookies.AuthCookie;
    if(!cookie) return res.status(401).send('É preciso estar logado');

    try {
        const userVerified = jwt.verify(cookie, process.env.SECRET);
        req.user = userVerified;
        next()
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor' });
        console.error(error)
    }
}