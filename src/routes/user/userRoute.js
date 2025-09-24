import express from 'express';

import { signIn } from '../../controllers/user/signIn.js';
import { signUp } from '../../controllers/user/signUp.js';

import { signUpValidator } from '../../middlewares/user/signUpValidation.js'
import { loginValidate } from '../../middlewares/universal/loginValidate.js'

const router = express.Router();

router.post('/user/signIn', loginValidate, signIn)
router.post('/user/signUp', signUpValidator, signUp)

export default router;