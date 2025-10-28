import jwt from 'jsonwebtoken';

export const adminAuth = (req, res, next) => {
    const cookie = req.cookies.adminAuthCookie;
    if(!cookie) return res.status(401).send('Acesso negado');

    try {
        const adminVeriefied = jwt.verify(cookie, process.env.SECRET);
        if(adminVeriefied.role === 'usuario' ||adminVeriefied.role === 'redator'){
            return res.status(403).send('Você não tem permissão');
        };
        next();
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor' });
        console.error(error);
    }
}