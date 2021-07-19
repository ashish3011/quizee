const Quiz = require('../model/Quiz');
const User = require('../model/User');

exports.addQuiz = async (req, res) => {
    const {email} = req.params
    const {quizCode} = req.body
    await Quiz.findOne({secretId: quizCode},async(err, quiz) => {
        if(err){
            return res.status(400).json({error: 'Error occured while adding quiz'})
        }
        else if(!quiz){
            return res.status(404).json({message: 'No quiz found'})
        }
        if(quiz.students.includes(email)){
            await User.findOne({email}, async (err1, user) => {
                if(err1 || !user){
                    return res.status(400).json({error: 'Error occured while adding quiz'})
                }
                if(!user.quiz.includes(quiz._id)){
                    user.quiz.push(quiz._id)
                    await user.save()
                    return res.status(200).json({message:"quiz is added successfully", quiz})
                } 
                else{
                    return res.status(200).json({message:"quiz already exists"})
                }
            })
        }
        else{
            return res.status(400).json({error: 'Ask faculty to add you to quiz'})
        }
    })
}

exports.viewQuiz = (req, res) => {
    const {email} = req.params
    let quizes = []
    User.findOne({ email})
    .populate({path: 'quiz', options: { sort: {'startTime':1} }})
    .exec((err, user) => {
        if(err || !user){
            return res.status(400).json({error:"Something went wrong..."})
        }
        return res.status(200).json(user.quiz)
    })
}
