// Importação de depêndencias
import express from 'express';

// Importação de módulos
// Controllers
import { signIn } from '../../controllers/user/signIn.js';
import { signUp } from '../../controllers/user/signUp.js';
// Middlewares
import { signUpValidator } from '../../middlewares/user/signUpValidation.js'
import { loginValidate } from '../../middlewares/universal/loginValidate.js';
// import { Auth } from '../middlewares/AuthMiddleware.js';

// Inicialização do roteador
const router = express.Router();

// Definição de rotas
// Roteamento para formulários
router.post('/user/signIn', loginValidate, signIn)
router.post('/user/signUp', signUpValidator, signUp)

// Roteamento para páginas
// router.get('/user/main', Auth, pageRender)

// Exportação 
export default router;