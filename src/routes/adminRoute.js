// Importação de depêndencias
import express from 'express';

// Importação de módulos
import { signIn, pageRender } from '../controllers/adminController.js';
import { adminAuth } from '../middleware/adminAuth.js';

// Inicialização do roteador
const router = express.Router();

// Definição de rotas
// Roteamento para formulários
router.post('/admin/signIn', signIn)

// Roteamento para páginas
router.get('/admin/main', adminAuth, pageRender)

// Exportação 
export default router;