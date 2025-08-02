// Importação de depêndencias 
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Importação de módulos
import User from '../../models/User.js'

// Register logic
export const signUp = async (req, res) => {
    const selectedUser = await User.findOne({ email: req.body.email })
    if(selectedUser) return res.status(400).send('Email existente')

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password)
    })

    try {
        const savedUser = await user.save()
        let token = jwt.sign( { _id : savedUser._id }, process.env.SECRET )
        res.cookie('AuthCookie', token, { secure: true, httpOnly: true, expires: new Date(Date.now() + 2 * 3600000) })
        res.redirect('/app/user/main');
    } catch (error) {
        res.status(400).send(error)
    }
}
