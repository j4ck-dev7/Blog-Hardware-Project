import Article from '../../models/Article.js';
import Like from '../../models/Like.js'

import { isValidObjectId } from '../../utills/isValidObjectId.js';

export const like = async (req, res) => {
    const user = req.user._id;
    const article = req.params.articleId;

    if (!isValidObjectId(user)) {
        return res.status(400).json({ 
            message: 'ID inválido' 
        });
    }

    if (!isValidObjectId(article)) {
        return res.status(400).json({ 
            message: 'ID inválido' 
        });
    }

    const articleValid = await Article.findById(article);
    if(!articleValid) return res.status(400).json({ message: 'Article not found' });

    const liked = await Like.findOne({ user, article });
    if(liked) return res.status(409).json({ message: 'You already liked this article' });

    const like = new Like({
        user,
        article
    });

    try {
        await like.save();
        res.status(201).json({ message: "Liked article" });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
        console.error('Error while liking an article', error);
    }
}

export const removeLike = async (req, res) => {
    const user = req.user._id;
    const article = req.params.articleId;

    console.log(user, article)

    if (!isValidObjectId(user)) {
        return res.status(400).json({ 
            message: 'ID inválido' 
        });
    }

    if (!isValidObjectId(article)) {
        return res.status(400).json({ 
            message: 'ID inválido' 
        });
    }

    const articleValid = await Article.findById(article);
    if(!articleValid) return res.status(400).json({ message: 'Article not found' });
    
    try {
        const like = await Like.findOneAndDelete({ user, article });
        if(!like) return res.status(400).json({ message: 'Like not found' });
        res.status(204).json({ message: 'Like removed' });
    } catch (error) {
        console.error('Error removing like', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const allLikes = async (req, res) => {
    const user = req.user._id;

    try {
        if (!isValidObjectId(user)) {
            return res.status(400).json({ 
                message: 'ID inválido' 
            });
        }
        const userCurtidas = await Like.find({ user })
            .select('-_id -__v -user -creationDate')
            .populate('article', 'title -_id')
            .sort({ creationDate: -1 });
        
        if(!userCurtidas.length) return res.status(400).json({ message: 'No likes' });
        res.status(200).json({ message: 'Likes obteined', userCurtidas});
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
        console.error('Server error:', error);
    }
}