import { body, validationResult } from 'express-validator';

export const signUpValidator = [ 
    body('name')
        .trim()
        .notEmpty().withMessage('Nome de usuário é obrigatório')
        .isLength({ min: 3, max: 50 }).withMessage('Nome de usuário deve ter entre 3 e 20 caracteres')
        .isAlphanumeric().withMessage('Nome de usuário deve conter apenas letras e números'),

    body('email')
        .trim()
        .notEmpty().withMessage('Email é obrigatório')
        .isEmail().withMessage('Email inválido')
        .normalizeEmail(),

    body('password')
        .notEmpty().withMessage('Senha é obrigatória')
        .isLength({ min : 8 }).withMessage('Senha deve conter pelo menos 8 caracteres'),

    (req, res, next) => {
        const error = validationResult(req);
        if(!error.isEmpty()) return res.status(400).json({ error: error.array() });

        next();
    }
]