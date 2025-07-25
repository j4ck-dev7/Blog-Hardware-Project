// Importação de depêndencias 
import mongoose from "mongoose";

export const connect = async () => {(
    await mongoose.connect(process.env.MONGO_CONNECT).then(
        () => console.log('Mongo connected'),
        (error) => console.log('Erro:', error)
    )
)}