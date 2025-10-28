import Article from '../../models/Article.js';

export const allArticles = async (req, res) => {
    try {
        const pageNum = Math.max(1, parseInt(req.query.page));
        const limitNum = Math.min(5, Math.max(1, parseInt(req.query.limit)));

        const skip = (pageNum -1) * limitNum;
        const [total, data] = await Promise.all([
        Article.countDocuments(),
        Article.find()
            .sort({ dataCriação: -1 })
            .skip(skip)
            .limit(limitNum)
            .select('-_id -conteudo._id -__v')
            .lean()
        ]);

        const totalPages = Math.ceil(total / limitNum);
        const pagination = {
            total,
            pages: totalPages,
            currentPage: pageNum,
            limit: limitNum,
            hasNext: pageNum < totalPages,
            hasPrev: pageNum > 1
        }

        res.status(200).json({ message: 'Artigos obtidos', data, pagination});
    } catch (error) {
        res.status(500).json({ message: 'Erro interno no servidor' });
        console.error(error);
    }
}