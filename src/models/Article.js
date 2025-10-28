import mongoose from "mongoose";

const contentSchema = new mongoose.Schema({
    tipo: {
        type: String, required: true, enum: ['paragrafo', 'imagem'],
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
}, { _id: false });

const articleSchema = new mongoose.Schema({
    titulo: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    dataCriação: { type: Date, default: Date.now },
    autor: { type: String, required: true },
    conteudo: [contentSchema],
})

export default mongoose.model('Article', articleSchema);