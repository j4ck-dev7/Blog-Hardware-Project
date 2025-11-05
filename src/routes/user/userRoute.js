import express from 'express';

import { signIn } from '../../controllers/user/signIn.js';
import { signUp } from '../../controllers/user/signUp.js';
import { like, removeLike, allLikes } from '../../controllers/user/likeController.js';
import { comment, removeComment, editComment } from '../../controllers/user/commentController.js';
import { allArticles, loadArticle } from '../../controllers/user/articleController.js';

import { signUpValidator } from '../../middlewares/user/signUpValidation.js';
import { loginValidate } from '../../middlewares/universal/loginValidate.js';       
import { auth } from '../../middlewares/user/authorization.js';

const router = express.Router();

router.get('/curtidas', auth, allLikes);
router.get('/artigos', auth, allArticles);
router.get('/artigo/:slug', auth, loadArticle);

router.post('/signIn', loginValidate, signIn);
router.post('/signUp', signUpValidator, signUp);
router.post('/artigo/:artigoId/curtida', auth, like);
router.post('/artigo/:artigoId/comentar', auth, comment);

router.put('/artigo/:artigoId/comentario/:commentId', auth, editComment);

router.delete('/artigo/curtida/:artigoId', auth, removeLike);
router.delete('/artigo/comentario/:commentId', auth, removeComment);

export default router;