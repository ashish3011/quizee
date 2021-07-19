const express= require("express");
const router = express.Router();
const {requireSignin,facultyMiddleware, authMiddleware} = require('../middleware/auth');
const {create,questionByQuiz,updateQuestion,deleteQuestion, addQuestions} = require('../controller/question')

router.post('/create-question',requireSignin,facultyMiddleware,create);
router.get('/question-by-quiz/:id',requireSignin,authMiddleware,questionByQuiz);
router.put('/update-question',requireSignin,facultyMiddleware,updateQuestion);
router.put('/add-questions-excel',requireSignin,facultyMiddleware,addQuestions);
router.delete('/delete-question/:id',requireSignin,facultyMiddleware,deleteQuestion);
module.exports = router;