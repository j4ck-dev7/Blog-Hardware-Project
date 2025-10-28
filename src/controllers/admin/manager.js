import slugify from 'slugify'
import sanitize from 'sanitize-html'
import { body, validationResult } from 'express-validator'

import Article from '../../models/Article.js'

export const addArticle = async (req, res) => {
    try {
        const titulo = req.body.titulo
        const slug = slugify(titulo, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g })
        const { conteudo } = req.body
        if (Array.isArray(conteudo)) {
            console.log('O campo "conteudo" é um array');
        }

        const conteudoSanitizado = conteudo.map(bloco => {
            if(bloco.tipo === 'paragrafo'){
                return {
                    ...bloco,
                    valor: sanitize(bloco.valor, { allowedTags: [], allowedAttributes: {} })
                }
            };
            if(bloco.tipo === 'imagem'){
                return {
                    ...bloco,
                    legenda: bloco.legenda ? sanitize(bloco.legenda, {
                        allowedTags: [],
                        allowedAttributes: {},
                    }) : undefined,
                    alt: sanitize(bloco.alt, { allowedTags: [], allowedAttributes: {} })
                }
            }
            return bloco
        })

        const article = new Article({
            titulo,
            slug: slug,
            autor: req.body.autor,
            conteudo: conteudoSanitizado
        })    
        await article.save();
        res.status(201).json({ message: 'Post criado com sucesso!', article })
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor' });
        console.error('Erro ao adicionar um artigo:', error);
    }
}

export const editArticle = async (req, res) => {
    const id = req.params.id;

    try {
        const data = { ...req.body };

        if(titulo){
            data.slug = slugify(titulo, { 
                lower: true,
                strict: true,
                remove: /[*+~.()'"!:@]/g
            })
        };

        const artigoEdit = await Article.findByIdAndUpdate(
            id,
            { $set: data}, 
            { new: true, runValidators: true } 
        );

        if (!artigoEdit) {
            return res.status(404).json({ error: 'Artigo não encontrado' });
        };

        res.status(200).json({
            message: 'artigo editado com sucesso!',
            data
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor'})
        console.error('Erro ao editar o artigo', error)
    }
}

export const deleteArticle = async (req, res) => {
    const id = req.params.id;

    try {
        const db = await Article.findByIdAndDelete(id);
        if(!db) return res.status(404).json({ message: 'O artigo não existe' });
            
        return res.status(204).json({ message: 'Artigo excluído com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor' });
        console.log('Erro ao excluir o artigo:', error);
    }
}
