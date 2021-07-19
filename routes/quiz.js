const express= require("express");
const router = express.Router();
const {requireSignin,facultyMiddleware, authMiddleware} = require('../middleware/auth');
const {create,quizByfaculty,updateQuiz,deleteQuiz,quizid,uploadStudents, addStudent,allStudents,removeStudent} = require('../controller/quiz')

router.post('/create-quiz',requireSignin,facultyMiddleware,create);
router.get('/quiz-by-faculty/:id',requireSignin,facultyMiddleware,quizByfaculty);
router.get('/quiz/:id',requireSignin,authMiddleware,quizid);
router.get('/all-students/:id',requireSignin,facultyMiddleware,allStudents);
router.put('/update-quiz',requireSignin,facultyMiddleware,updateQuiz);
router.delete('/delete-quiz/:id',requireSignin,facultyMiddleware,deleteQuiz);
router.put('/update-students',requireSignin,facultyMiddleware,uploadStudents);
router.put('/add-student',requireSignin,facultyMiddleware,addStudent);
router.put('/remove-student/:id/:studentId',requireSignin,facultyMiddleware,removeStudent);

module.exports = router;
