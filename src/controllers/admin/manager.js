// Importação de depêndencias
import slugify from 'slugify'
import sanitize from 'sanitize-html' // aprendido!
import { body, validationResult } from 'express-validator'

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

export const searchArticle = [
    body('pesquisa')
        .trim()
        .notEmpty().withMessage('Campo vazio, digite algo!'),

    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

            const pesquisa = req.body.pesquisa;
            if(!pesquisa) return res.status(404).json({ message: "Campo vazio, digite algo!" })

            const db = await Article.findOne({ titulo: pesquisa })
            if(!db) return res.status(404).json({ message: 'Artigo não encontrado | não existente' })

            res.json({ 
                message: 'Artigo encontrado com sucesso!',
                data: db 
            })
        } catch (error) {
            res.status(500).json({ message: 'Erro no servidor, tente novamente mais tarde' })
            console.error('Erro ao buscar artigo:', error)
        }
    }
]


export const editArticle = async (req, res) => {
    try {
        const data = { ...req.body };

        if(req.body.titulo){
            data.slug = slugify(req.body.titulo, { 
                lower: true,
                strict: true,
                remove: /[*+~.()'"!:@]/g
            })
        }

        const artigoEdit = await Article.findByIdAndUpdate(
            req.params.id,
            { $set: data}, // Apenas os campos enviados é atualizados
            { new: true, runValidators: true } // Retorna o artigo atualizado e o valida
        );

        if (!artigoEdit) {
            return res.status(404).json({ error: 'Artigo não encontrado' });
        }

        res.json({
            message: 'artigo editado com sucesso!',
            data
        })
    } catch (error) {
        res.json(error)
    }
}

export const deleteArticle = (req, res) => {
    
}
