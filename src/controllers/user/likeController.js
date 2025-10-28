import Like from '../../models/Like.js'

export const like = async (req, res) => {
    const user = req.user._id;
    const article = req.params.artigoId;

    const curtidaExiste = await Like.findOne({ user, article });
    if(curtidaExiste) return res.status(409).json({ message: 'Você já curtiu este artigo' });

    const curtida = new Like({
        user,
        article
    });

    try {
        await curtida.save();
        res.status(201).json({ message: "Artigo curtido !" });
    } catch (error) {
        res.status(500).json({ message: 'Erro interno no servidor' });
        console.error('Erro ao curtir um artigo', error);
    }
}

export const removeLike = async (req, res) => {
    const user = req.user._id;
    const article = req.params.artigoId;
    try {
        const curtida = await Like.findOneAndDelete({ user, article });
        if(!curtida) return res.status(400).json({ error: 'Curtida não encontrada' });
        res.status(204).json({ message: 'Curtida removida' });
    } catch (error) {
        console.error('Erro ao remover curtida', error);
        res.status(500).json({ message: 'Erro interno no servidor' });
    }
}

export const allLikes = async (req, res) => {
    const user = req.user._id;
    try {
        const userCurtidas = await Like.find({ user })
            .populate('article', 'titulo conteudo')
            .sort({ createdAt: -1 });
        
        if(!userCurtidas.length) return res.status(400).json({ message: 'Nenhuma curtida' });
        res.status(200).json(userCurtidas);
    } catch (error) {
        res.status(500).json({ error: 'Erro interno no servidor' });
        console.error('Erro no servidor:', error);
    }
}