import express from 'express';

import { signIn } from '../../controllers/user/signIn.js';
import { signUp } from '../../controllers/user/signUp.js';
import { like, removeLike, allLikes } from '../../controllers/user/likeController.js';
import { comment, removeComment, editComment } from '../../controllers/user/commentController.js';
// import { allArticles, loadArticle } from '../../controllers/user/articleController.js';

import { signUpValidator } from '../../middlewares/user/signUpValidation.js';
import { loginValidate } from '../../middlewares/universal/loginValidate.js';       
import { auth } from '../../middlewares/user/authorization.js';

const router = express.Router();

// router.get('/user/artigos', todosArtigos)
// router.get('/user/artigo/:id', carregarArtigo)
router.get('/curtidas', auth, allLikes);
// router.get('/user/comentarios/artigo/:id', auth, todosComentarios)

router.post('/signIn', loginValidate, signIn);
router.post('/signUp', signUpValidator, signUp);
router.post('/artigos/:artigoId/curtida', auth, like);
router.post('/artigos/:artigoId/comentar', auth, comment);

router.put('/artigos/:artigoId/comentario/:commentId', auth, editComment);

router.delete('/artigos/:artigoId/', auth, removeLike);
router.delete('/artigos/comentario/:commentId', auth, removeComment);

export default router;