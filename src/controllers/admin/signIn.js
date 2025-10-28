// Importação de depêndencias
import jwt from 'jsonwebtoken';
import bcryptjs from 'bcryptjs';

// Importação de módulos
import User from '../../models/User.js';

// Login | Lógica 
export const signIn = async (req, res) => {
    const email = req.body.email;
    const selectedUser = await User.findOne({ email });
    if(!selectedUser) return res.status(400).send("Email ou senha incorretos");

    const passwordMatch = bcryptjs.compare(req.body.password, selectedUser.password);
    if(!passwordMatch) return res.status(400).send("Email ou senha incorretos");

    if(selectedUser.role === 'usuario' || selectedUser.role === 'redator') return res.status(401).send('Access Denied!');

    try {
        let token = jwt.sign({ _id: selectedUser._id, role: selectedUser.role }, process.env.SECRET);
        res.cookie('adminAuthCookie', token, { secure: true, httpOnly: true, expires: new Date(Date.now() + 2 * 3600000) });
        res.status(200).json({ message: "Admin logado com sucesso!" });
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
}