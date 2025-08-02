// Importação de depêndencias
import mongoose from "mongoose";

// Modelo de likes 
const likeSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article' },
    createdAt: Date
});

// Exportação
export default mongoose.model('Like', likeSchema)