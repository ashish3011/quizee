const express= require("express");
const router = express.Router();
const {requireSignin, authMiddleware} = require('../middleware/auth');
const {addQuiz, viewQuiz} = require('../controller/user')

router.put('/user/:email',requireSignin, authMiddleware, addQuiz);
router.get('/user-quizes/:email', requireSignin,authMiddleware, viewQuiz);

module.exports = router;