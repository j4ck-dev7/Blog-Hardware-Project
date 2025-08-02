// Importação de depêndencias
import slugify from 'slugify'
import sanitize from 'sanitize-html'

// Importação de módulos
import Article from '../../models/Article.js'

export const addContent = async (req, res) => {
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
        res.status(201).json({ message: 'Post criado com sucesso', article })
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}