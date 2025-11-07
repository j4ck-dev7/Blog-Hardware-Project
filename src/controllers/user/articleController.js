import Article from '../../models/Article.js';
import Comment from '../../models/Comment.js';
import Like from '../../models/Like.js';
import client from '../../db/redis.js';

import { formatarDataHora } from '../../utills/formatarDataHora.js';
import { tempoRelativo } from '../../utills/tempoRelativo.js';

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
          .select('-_id -conteudo._id -__v')
          .lean()
      ]);

      const articles = articlesData.map(a => ({
        titulo: a.titulo,
        autor: a.autor,
        conteudo: a.conteudo,
        criadoEm: formatarDataHora(a.dataCriação)
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
        message: 'Artigos obtidos', 
        data
      });
    } catch (error) {
        res.status(500).json({ message: 'Erro interno no servidor' });
        console.error(error);
    }
}

export const loadArticle = async (req, res) => {
    const { slug } = req.params;

    try {
      const articleData = await Article.findOne({ slug })

      if (!articleData) {
        return res.status(404).json({ message: 'Artigo não encontrado' });
      }

      const articleId = articleData._id;

      const [article, likeCount, userComments] = await Promise.all([
        Article.findOne({ slug })
          .select('-__v -conteudo._id -dataCriação -_id')
          .lean(),
        Like.countDocuments({ article: articleId }),
        Comment.find({ article: articleId})
          .select('-_id -article -__v +isEdited')
          .sort({ createdAt: -1 })
          .populate({
            path: 'user',
            select: '-_id -__v -password -role -artigosCurtidos -comments -email -createdAt'
          })
          .lean()
      ]);

      const comment = userComments.map(c => ({
        content: c.post,
        user: c.user,
        criado: tempoRelativo(c.createdAt),
        editado: c.isEdited
      }))

      res.status(200).json({
        article: {
          article,
          criadoEm: formatarDataHora(articleData.dataCriação)
        },           
        likeCount,                  
        comments: comment
      });

    }catch (error) {
      console.error('Erro ao carregar artigo:', error);
      return res.status(500).json({ message: 'Erro interno no servidor' });
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
        titulo: a.titulo,
        autor: a.autor,
        conteudo: a.conteudo,
        criadoEm: formatarDataHora(a.dataCriação)
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
        message: 'Artigos obtidos', 
        data
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Erro interno' });
    };
};