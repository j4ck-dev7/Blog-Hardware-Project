// Importação de depêndencias
import jwt from 'jsonwebtoken';

// admin Auth
export const adminAuth = (req, res, next) => {
    const cookie = req.cookies.adminAuthCookie;
    if(!cookie) return res.status(401).send('Access denied')

    try {
        const adminVeriefied = jwt.verify(cookie, process.env.SECRET)
        if(adminVeriefied.role === 'usuario' ||adminVeriefied.role === 'redator') return res.status(401).send('Access denied')
        next()
    } catch (error) {
        res.status(401).send('Access Denied')
        console.log(error)
    }
}