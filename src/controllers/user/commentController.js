import sanitize from 'sanitize-html';

import Comment from '../../models/Comment.js';

export const comment = async (req, res) => {
    const article = req.params.artigoId;
    const user = req.user._id
    const post = sanitize(req.body.post, { allowedTags: [], allowedAttributes: {} });

    const comment = new Comment({
        post,
        user,
        article
    });

    try {
        await comment.save();
        res.status(201).json({ message: "Comentário adicionado!", comment });
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor' });
        console.error('Erro ao curtir um artigo', error);
    }
}

export const editComment = async (req, res) => {
    const post = sanitize(req.body.post, { allowedTags: [], allowedAttributes: {} });
    const updateField = { post };
    const commentId = req.params.commentId;

    try {
        const editComment = await Comment.findByIdAndUpdate(
            { _id: commentId },
            { $set: updateField },
            { runValidators: true }
        );

        if(!editComment) return res.status(404).json({ message: 'Comentário não encontrado' });
        
        res.status(200).json({ message: 'Comentário editado!', editComment });
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor' });
        console.error('Erro ao editar um comentário', error);
    }
}

export const removeComment = async (req, res) => {
    const id = req.params.commentId;
    try {
        const comment = await Comment.findByIdAndDelete( id );
        if(!comment) return res.status(400).json({ error: 'Comentário não encontrado' });
        res.status(204).json({ message: 'Comentário removido' });
    } catch (error) {
        console.error('Erro ao remover comentário', error);
        res.status(500).json({ message: 'Erro interno no servidor' });
    }
}