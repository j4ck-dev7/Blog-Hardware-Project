import express from 'express';

import { signIn } from '../../controllers/user/signIn.js';
import { signUp } from '../../controllers/user/signUp.js';
import { like, removeLike, allLikes } from '../../controllers/user/likeController.js';
import { comment, removeComment, editComment } from '../../controllers/user/commentController.js';
import { allArticles, loadArticle, findArticleByTag } from '../../controllers/user/articleController.js';

import { signUpValidator } from '../../middlewares/user/signUpValidation.js';
import { loginValidate } from '../../middlewares/universal/loginValidate.js';       
import { auth } from '../../middlewares/user/authorization.js';

const router = express.Router();

router.get('/likes', auth, allLikes);
router.get('/articles', auth, allArticles);
router.get('/articles/:slug', auth, loadArticle);
router.get('/articles/tag', auth, findArticleByTag);

router.post('/signIn', loginValidate, signIn);
router.post('/signUp', signUpValidator, signUp);
router.post('/article/:articleId/like', auth, like);
router.post('/article/:articleId/comment', auth, comment);

router.put('/article/:articleId/comment/:commentId', auth, editComment);

router.delete('/article/like/:articleId', auth, removeLike);
router.delete('/article/comment/:commentId', auth, removeComment);

export default router;