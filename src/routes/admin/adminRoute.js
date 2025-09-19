// Importação de depêndencias
import express from 'express';

// Importação de módulos
// Controllers
import { signIn } from '../../controllers/admin/signIn.js';
import { addArticle, searchArticle, editArticle } from '../../controllers/admin/manager.js';
// Middlewares
import { adminAuth } from '../../middlewares/admin/adminAuth.js';
import { loginValidate } from '../../middlewares/universal/loginValidate.js';

// Inicialização do roteador
const router = express.Router();

// Definição de rotas
// Roteamento para formulários
router.get('/admin/search/', adminAuth, searchArticle);

router.post('/admin/signIn', loginValidate, signIn);
router.post('/admin/addArticle', adminAuth, addArticle);
router.put('/admin/editArticle/:id', adminAuth, editArticle);

// Roteamento para páginas
// router.get('/admin/main', adminAuth)

// Exportação 
export default router;