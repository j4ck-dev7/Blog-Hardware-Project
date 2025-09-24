import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

import User from '../../models/User.js'

export const signIn = async (req, res) => {
    const selectedUser = await User.findOne({ email: req.body.email })
    if(!selectedUser) return res.status(400).send("Email ou senha incorretos");

    const passwordMatch = bcrypt.compare(req.body.password, selectedUser.password);
    if (!passwordMatch) return res.status(400).send("Email ou senha incorretos");

    try {
        let token = jwt.sign( { _id : selectedUser._id }, process.env.SECRET )
        res.cookie('AuthCookie', token, { secure: true, httpOnly: true, expires: new Date(Date.now() + 2 * 3600000) })
        res.status(200).json({ message: "Usuário logado com sucesso!" })
    } catch (error) {
        res.status(400).send(error)
    } 
}