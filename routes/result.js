const express= require("express");
const router = express.Router();
const {requireSignin, authMiddleware} = require('../middleware/auth');
const {createResult,updateResult, resultByStudent, resultByQuiz,resultByQuizStudent} = require('../controller/result')

router.post('/create-result',requireSignin,authMiddleware,createResult);
router.put('/update-result',requireSignin,authMiddleware,updateResult);
router.get('/result-student/:id',requireSignin,authMiddleware,resultByStudent);
router.get('/result-quiz/:id',requireSignin,authMiddleware,resultByQuiz);
router.get('/result-quiz-student/:quizId/:studentId',requireSignin,authMiddleware,resultByQuizStudent);
module.exports = router;