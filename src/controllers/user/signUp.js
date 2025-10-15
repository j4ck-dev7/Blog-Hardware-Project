// Importação de depêndencias 
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Importação de módulos
import User from '../../models/User.js'

// Register logic
export const signUp = async (req, res) => {
    const email = req.body.email;
    const selectedUser = await User.findOne({ email })
    if(selectedUser) return res.status(400).send('Email existente')

    const user = new User({
        name: req.body.name,
        email,
        password: bcrypt.hashSync(req.body.password)
    })

    try {
        const savedUser = await user.save()
        let token = jwt.sign( { _id : savedUser._id, email }, process.env.SECRET )
        res.cookie('AuthCookie', token, { secure: true, httpOnly: true, expires: new Date(Date.now() + 2 * 3600000) })
        res.status(200).json({ message: "Usuário registrado com sucesso!" })
    } catch (error) {
        res.status(400).send(error)
    }
}
