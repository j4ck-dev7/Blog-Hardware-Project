// Importação de depêndencias 
import { body, validationResult } from 'express-validator';

export const loginValidate = [ 
    body('email')
        .trim()
        .notEmpty().withMessage('Email é obrigatório')
        .isEmail().withMessage('Email inválido'),

    body('password')
        .notEmpty().withMessage('Senha é obrigatória'),

    (req, res, next) => {
        const error = validationResult(req);
        if(!error.isEmpty()) return res.status(400).json({ error: error.array() })

        next()
    },
]