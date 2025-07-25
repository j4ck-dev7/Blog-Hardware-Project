// Importação de depêndencias
import express from 'express';

// Importação de módulos
import { signIn, signUp, pageRender } from '../controllers/userController.js';
import { Auth } from '../middleware/AuthMiddleware.js';

// Inicialização do roteador
const router = express.Router();

// Definição de rotas
// Roteamento para formulários
router.post('/user/signIn', signIn)
router.post('/user/signUp', signUp)

// Roteamento para páginas
router.get('/user/main', Auth, pageRender)

// Exportação 
export default router;