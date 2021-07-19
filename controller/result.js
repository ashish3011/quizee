const Result=require("../model/Result")
const Question=require("../model/Question")
exports.createResult=async(req,res)=>{
    const {quizId,userId}=req.body;
    let questions;
    await Question.find({quiz:quizId})
    .then(q=>{
        if(!q){
            return;
        }
        questions=q;
        let result=new Result({student:userId,quiz:quizId,questions});
        result.save((err,res1)=>{
        if(err || !res1){
            return res.status(400).json({err});
        }
        return res.json({resultId:res1._id});
    })
    })
    .catch(err=>console.error(err))
}


exports.updateResult=(req,res)=>{
    const {resultId,
        questionId,
        userAnswer}=req.body
    Result.findById(resultId,(err,res1)=>{
        if(err ||  !res1){
            return res.status(400).json({error:"something went wrong,try again"})
        }
        
        for(let i=0;i<res1.questions.length;i++){
            if(res1.questions[i]._id==questionId){
                res1.questions[i].userAnswer=userAnswer;
                res1.save();
                return res.status(200).json({message:"saaved"})
            }
        }
       
    })
}


exports.resultByQuiz=(req,res)=>{
    const {id}=req.params;
    Result.find({quiz:id})
    .populate('quiz','-secretId')
    .populate('student', '_id name email')
    .exec(async(err,result)=>{
        if(err || !result){
            return res.status(400).json({message:"no result found"});
        }
        for(let r=0;r<result.length;r++){
            let sum=0;
            for(let i = 0; i < result[r].questions.length; i++){
                if(result[r].questions[i].userAnswer==result[r].questions[i].answer){
                    sum+=1;
                }
            }
            result[r].marks=sum;
            await result[r].save()
        }
        return res.status(200).json({result:result})
    })
}

exports.resultByStudent=(req,res)=>{
    const {id}=req.params;
    Result.find({student:id})
    .populate('quiz','-secretId')
    .populate('student', '_id name email')
    .exec((err,result)=>{
        if(err || !result){
            return res.status(400).json({message:"no result found"});
        }
        return res.status(200).json({result:result})
    })
}

exports.resultByQuizStudent=(req,res)=>{
    const {studentId,quizId} =req.params;
    Result.findOne({$and:[{quiz: quizId},{student:studentId}]})
    .populate('quiz','-secretId')
    .populate('student', '_id name email')
    .exec(async(err,result)=>{
        if(err ){
            return res.status(400).json({error:"no result found"});
        }
        if(!result){
            return res.status(200).json({message:"false"})
        }
          let sum=0;
        for(let i = 0; i < result.questions.length; i++){
            if(result.questions[i].userAnswer==result.questions[i].answer){
                sum+=1;
            }
        }
        result.marks=sum;
        await result.save()
        return res.status(200).json({result:result,message:"true"})
    })

}

