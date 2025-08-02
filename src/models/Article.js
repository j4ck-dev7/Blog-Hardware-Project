// Importação de depêndencias
import mongoose from "mongoose";

// Modelo de conteúdo
const contentSchema = new mongoose.Schema({
    tipo: {
        type: String, required: true, enum: ['paragrafo', 'imagem']
    },
    valor: {
        type: String, required: () => {
            return contentSchema.tipo === 'paragrafo';
        }
    },
    url: {
        type: String, required: () => {
            return contentSchema.tipo === 'imagem';
        }
    },
    legenda: {
        type: String, required: () => {
            return contentSchema.tipo === 'imagem';
        }
    },
    alt: {
        type: String, required: () => {
            return contentSchema.tipo === 'imagem';
        }
    }
});

// Modelo do artigo
const articleSchema = new mongoose.Schema({
    titulo: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    dataCriação: { type: Date, default: Date.now },
    autor: { type: String, required: true },
    conteudo: [contentSchema],
})

export default mongoose.model('Article', articleSchema)