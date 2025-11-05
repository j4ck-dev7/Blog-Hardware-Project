import Comment from '../../models/Comment.js';
import { tempoRelativo } from '../../utills/tempoRelativo.js'

export const comment = async (req, res) => {
    const article = req.params.artigoId;
    const user = req.user._id;
    const post = req.body.post;

    const comment = new Comment({
        post,
        user,
        article
    });

    try {
        await comment.save();
        const commentPopulate = await Comment.findById(comment._id)
            .select('createdAt post')
            .populate({
                path: 'user',
                select: '-_id -password -role -email -createdAt -__v'
            })
            .populate({
                path: 'article',
                select: '-_id titulo'
            })
            .lean();

        res.status(201).json({ 
            message: "Comentário adicionado!", 
            comment: commentPopulate.post,
            user: commentPopulate.user, 
            article: commentPopulate.article,
            criado: tempoRelativo(commentPopulate.createdAt) 
        });
    } catch (error) {
        res.status(500).json({ message: 'Erro interno do servidor' });
        console.error('Erro ao curtir um artigo', error);
    }
}

export const editComment = async (req, res) => {
    const post = req.body.post;
    const updateField = { post, isEdited: true };
    const commentId = req.params.commentId;

    try {
        const editComment = await Comment.findByIdAndUpdate(
            { _id: commentId },
            { $set: updateField },
            { runValidators: true, new: true }
        ).select('createdAt post +isEdited')
            .populate({
                path: 'user',
                select: '-_id -password -role -email -createdAt -__v'
            })
            .populate({
                path: 'article',
                select: '-_id titulo'
            })
            .lean();

        if(!editComment) return res.status(404).json({ message: 'Comentário não encontrado' });

        res.status(200).json({ 
            message: 'Comentário editado!',
            comment: editComment.post,
            user: editComment.user, 
            article: editComment.article,
            criado: tempoRelativo(editComment.createdAt),
            Editado: editComment.isEdited
        });
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