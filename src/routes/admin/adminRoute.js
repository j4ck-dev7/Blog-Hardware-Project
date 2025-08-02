// Importação de depêndencias
import express from 'express';

// Importação de módulos
import { signIn } from '../../controllers/admin/signIn.js';
import { addContent } from '../../controllers/admin/manager.js'
import { adminAuth } from '../../middleware/admin/adminAuth.js';

// Inicialização do roteador
const router = express.Router();

// Definição de rotas
// Roteamento para formulários
router.post('/admin/signIn', signIn)
router.post('/admin/addContent', adminAuth, addContent)

// Roteamento para páginas
// router.get('/admin/main', adminAuth)

// Exportação 
export default router;