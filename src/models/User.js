import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, unique:true, minlength: 3, maxlength: 50 },
    email: { type: String, required: true, unique:true, minlength: 13, maxlength: 50 },
    googleId: { type: String, unique: true, sparse: true },
    githubId: { type: String, unique: true, sparse: true },
    password: { type: String, required: true, minlength: 8, maxlength: 100 },
    role: {
        type: String, 
        enum: [ 'admin', 'redator', 'usuario' ],
        default: 'usuario'
    },
    createdAt: { type: Date, default: Date.now }
})

export default mongoose.model('User', userSchema)