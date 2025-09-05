// Importação de depêndencias
import slugify from 'slugify'
import sanitize from 'sanitize-html' // aprendido!

// Importação de módulos
import Article from '../../models/Article.js'

export const addArticle = async (req, res) => {
    try {
        const slug = slugify(req.body.titulo, { lower: true, strict: true, remove: /[*+~.()'"!:@]/g }) // aprendido!
        const { conteudo } = req.body
        
        if (Array.isArray(conteudo)) {
            console.log('O campo "conteudo" é um array');
        }

        // Sanitização do conteúdo
        const conteudoSanitizado = conteudo.map(bloco => {
            if(bloco.tipo === 'paragrafo'){
                return {
                    ...bloco, // aprendido! 
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
            titulo: req.body.titulo,
            slug: slug,
            autor: req.body.autor,
            conteudo: conteudoSanitizado
        })    
        await article.save();
        res.status(201).json({ message: 'Post criado com sucesso!', article })
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

export const searchArticle = async (req, res) => {
    try {
        const pesquisa = req.body.pesquisa;
        if(!pesquisa) return res.status(404).json({ message: "Campo vazio, digite algo!" })
        console.log(pesquisa)

        const db = await Article.findOne({ titulo: pesquisa })
        if(!db) return res.status(404).json({ message: "Artigo não encontrado | não existente" })
        console.log(db.slug)

        res.json({db})
    } catch (error) {
        res.json(error)
    }
}

export const editArticle = (req, res) => {
    
}
