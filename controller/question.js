const Question = require('../model/Question');
const Quiz = require('../model/Quiz');

exports.create=(req,res)=>{
    const {question,option1,option2,option3,option4,answer,id} = req.body;
    let que=new Question({question,option1,option2,option3,option4,answer,quiz:id})
    que.save((err,q)=>{
        if(err){
            return res.status(401).json({error:"Something went wrong, try again"})
        }
        return res.status(200).json({message:`Question created.`,q});
    })

}

exports.updateQuestion=(req,res)=>{
    const {question,option1,option2,option3,option4,answer,_id} = req.body;
    const que={question,option1,option2,option3,option4,answer}
    Question.findByIdAndUpdate(_id,que,{new:true},(err,q)=>{
        if(err){
            return res.status(401).json({error:"Something went wrong, try again"})
        }
        return res.status(200).json({message:"Updated successfully",q})
    })
}
exports.questionByQuiz=(req,res)=>{
    const {id}=req.params
    Question.find({quiz:id})
    .then(q=>{
        if(!q){
            return res.status(401).json({error:"Something went wrong, try again"})
        }
        return res.status(200).json({q});
    })
    .catch(err=>console.error(err))
}

exports.deleteQuestion=(req,res)=>{
    const {id}=req.params
    Question.findByIdAndDelete(id,(err,q)=>{
        if(err){
            return res.status(401).json({error:"Something went wrong, try again"})
        }
        return res.status(200).json({message:"deleted successfully"});
    })
}

exports.addQuestions = (req, res) => {
    const {id, questions} = req.body
    let newQuestion=questions
    for(let i=0; i<questions.length; i++) {
        let question=questions[i].Question;
        let option1=questions[i].Option1;
        let option2=questions[i].Option2;
        let option3=questions[i].Option3;
        let option4=questions[i].Option4;
        let answer=questions[i].Answer;
        let que=new Question({question,option1,option2,option3,option4,answer,quiz:id})
        que.save((err,q)=>{
        if(err){
            return res.status(401).json({error:"Something went wrong, try again"})
        }
        
    })
    }
    return res.status(200).json({message:`Question created.`});
}