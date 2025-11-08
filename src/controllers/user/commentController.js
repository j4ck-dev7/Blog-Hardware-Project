import Comment from '../../models/Comment.js';
import { relativeTime } from '../../utills/tempoRelativo.js'

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
                select: '-_id title'
            })
            .lean();

        res.status(201).json({ 
            message: "Comment added", 
            comment: commentPopulate.post,
            user: commentPopulate.user, 
            article: commentPopulate.article,
            create: relativeTime(commentPopulate.createdAt) 
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
        console.error('Error while liking an article', error);
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

        if(!editComment) return res.status(404).json({ message: 'Comment not found' });

        res.status(200).json({ 
            message: 'Comentário editado!',
            comment: editComment.post,
            user: editComment.user, 
            article: editComment.article,
            created: relativeTime(editComment.createdAt),
            edited: editComment.isEdited
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
        console.error('Error editing a comment', error);
    }
}

export const removeComment = async (req, res) => {
    const id = req.params.commentId;
    try {
        const comment = await Comment.findByIdAndDelete( id );
        if(!comment) return res.status(400).json({ message: 'Comment not found' });
        res.status(204).json({ message: 'Comment removed' });
    } catch (error) {
        console.error('Error removing comment', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}