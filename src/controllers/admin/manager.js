import slugify from 'slugify';

import Article from '../../models/Article.js';

export const addArticle = async (req, res) => {
    try {
        const slug = slugify(titulo, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g });
        const { conteudo, titulo, autor } = req.body;

        const article = new Article({
            titulo,
            slug,
            autor,
            conteudo
        });    
        await article.save();
        res.status(201).json({ message: 'Post criado com sucesso!', article });
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor' });
        console.error('Erro ao adicionar um artigo:', error);
    };
};

export const editArticle = async (req, res) => {
    try {
        const data = { ...req.body };

        if(titulo){
            data.slug = slugify(titulo, { 
                lower: true,
                strict: true,
                remove: /[*+~.()'"!:@]/g
            });
        };

        const artigoEdit = await Article.findByIdAndUpdate(
            req.params.id,
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
        res.status(500).json({ message: 'Erro interno do servidor'});
        console.error('Erro ao editar o artigo', error);
    };
};

export const deleteArticle = async (req, res) => {
    try {
        const db = await Article.findByIdAndDelete(req.params.id);
        if(!db) return res.status(404).json({ message: 'O artigo não existe' });
            
        res.status(204).json({ message: 'Artigo excluído com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor' });
        console.log('Erro ao excluir o artigo:', error);
    };
};