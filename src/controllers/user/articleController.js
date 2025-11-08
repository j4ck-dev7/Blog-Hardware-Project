import Article from '../../models/Article.js';
import Comment from '../../models/Comment.js';
import Like from '../../models/Like.js';
import client from '../../db/redis.js';

import { formatDateTime } from '../../utills/formatarDataHora.js';
import { relativeTime } from '../../utills/tempoRelativo.js';
import { isValidObjectId } from '../../utills/isValidObjectId.js';

const CACHE_TTL = 300;

export const allArticles = async (req, res) => {
    try {
      const pageNum = Math.max(1, parseInt(req.query.page));
      const limitNum = Math.min(5, Math.max(1, parseInt(req.query.limit)));
      const skip = (pageNum -1) * limitNum;

      const cacheKey = `articles:page:${pageNum}:limit:${limitNum}`
      const cached = await client.get(cacheKey);
      if(cached){
        return res.status(200).json(JSON.parse(cached));
      }

      const [total, articlesData] = await Promise.all([
        Article.countDocuments(),
        Article.find()
          .sort({ dataCriação: -1 })
          .skip(skip)
          .limit(limitNum)
          .select('-_id -content._id -__v')
          .lean()
      ]);

      if(!articlesData.length) return res.status(400).json({ message: 'Articles not found' })

      const articles = articlesData.map(a => ({
        title: a.title,
        auth: a.author,
        content: a.content,
        createdIn: formatDateTime(a.creationDate)
      }));

      const totalPages = Math.ceil(total / limitNum);
      const pagination = {
        total,
        pages: totalPages,
        currentPage: pageNum,
        limit: limitNum,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      };

      const data = {
        articles,
        pagination
      };

      await client.setEx(cacheKey, CACHE_TTL, JSON.stringify(data))

      res.status(200).json({ 
        message: 'Articles obtained', 
        data
      });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
        console.error(error);
    }
}

export const loadArticle = async (req, res) => {
    const { slug } = req.params;

    try {
      const articleData = await Article.findOne({ slug })

      if (!articleData) {
        return res.status(404).json({ message: 'Article not found' });
      }

      const articleId = articleData._id;
      if (!isValidObjectId(articleId)) {
        return res.status(400).json({ 
          message: 'ID inválido' 
        });
      }

      const [article, likeCount, userComments] = await Promise.all([
        Article.findOne({ slug })
          .select('-__v -conteudo._id -creationDate -_id')
          .lean(),
        Like.countDocuments({ article: articleId }),
        Comment.find({ article: articleId})
          .select('-_id -article -__v +isEdited')
          .sort({ createdAt: -1 })
          .populate({
            path: 'user',
            select: '-_id -__v -password -role -email -creationDate'
          })
          .lean()
      ]);

      const comment = userComments.map(c => ({
        content: c.post,
        user: c.user,
        createdIn: relativeTime(c.createdAt),
        edited: c.isEdited
      }))

      res.status(200).json({
        article: {
          article,
          createdIn: formatarDataHora(article.dataCriação)
        },           
        likeCount,                  
        comments: comment
      });

    }catch (error) {
      console.error('Error loading article', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
};

export const findArticleByTag = async (req, res) => {
      const tags = req.query.tag;

      const pageNum = Math.max(1, parseInt(req.query.page));
      const limitNum = Math.min(5, Math.max(1, parseInt(req.query.limit)));
      const skip = (pageNum -1) * limitNum;

      const cacheKey = `articles:tag:${tags}:page:${pageNum}:limit:${limitNum}`

    try {
      const cached = await client.get(cacheKey);
      if(cached){
        return res.status(200).json(JSON.parse(cached));
      }

      const [total, articlesData] = await Promise.all([
        Article.countDocuments({tags}),
        Article.find({tags})
          .sort({ dataCriação: -1 })
          .skip(skip)
          .limit(limitNum)
          .select('-_id -conteudo._id -__v')
          .lean()
      ]);

      const articles = articlesData.map(a => ({
        title: a.title,
        author: a.author,
        content: a.content,
        cratedIn: formatDateTime(a.dataCriação)
      }));

      const totalPages = Math.ceil(total / limitNum);
      const pagination = {
        total,
        pages: totalPages,
        currentPage: pageNum,
        limit: limitNum,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1
      };

      const data = {
        articles,
        pagination
      };

      await client.setEx(cacheKey, CACHE_TTL, JSON.stringify(data))

      res.status(200).json({ 
        message: 'Articles obtained', 
        data
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    };
};