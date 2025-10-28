import express from 'express';

import { signIn } from '../../controllers/admin/signIn.js';
import { addArticle, editArticle, deleteArticle } from '../../controllers/admin/manager.js';

import { adminAuth } from '../../middlewares/admin/adminAuth.js';
import { loginValidate } from '../../middlewares/universal/loginValidate.js';

const router = express.Router();

router.post('/admin/signIn', loginValidate, signIn);
router.post('/admin/addArticle', adminAuth, addArticle);

router.put('/admin/editArticle/:id', adminAuth, editArticle);

router.delete('/admin/deleteArticle/:id', adminAuth, deleteArticle)

export default router;