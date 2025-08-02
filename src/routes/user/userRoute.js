// Importação de depêndencias
import express from 'express';

// Importação de módulos
import { signIn } from '../../controllers/user/signIn.js';
import { signUp } from '../../controllers/user/signUp.js';
// import { Auth } from '../middleware/AuthMiddleware.js';

// Inicialização do roteador
const router = express.Router();

// Definição de rotas
// Roteamento para formulários
router.post('/user/signIn', signIn)
router.post('/user/signUp', signUp)

// Roteamento para páginas
// router.get('/user/main', Auth, pageRender)

// Exportação 
export default router;