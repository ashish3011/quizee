const Quiz = require('../model/Quiz');
const sgMail = require('@sendgrid/mail');
const Question = require('../model/Question');
const User = require('../model/User');
const randomatic = require('randomatic')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

exports.create=(req,res)=>{
    const {name,no_of_questions,duration,_id,startTime,author_name}=req.body;
    let quiz=new Quiz({name,no_of_questions,duration,author:_id,startTime,author_name})
    quiz.secretId=name.substring(0,3).toUpperCase()+randomatic('A0',5)
    quiz.save((err,q)=>{
        if(err){
            return res.status(401).json({error:"Something went wrong, try again"})
        }
        return res.status(200).json({message:`${q.name} is created.`,q});
    })

}

exports.updateQuiz=(req,res)=>{
    const {name,no_of_questions,duration,_id,startTime}=req.body;
    const quiz={name,no_of_questions,duration,startTime}
    Quiz.findByIdAndUpdate(_id,quiz,{new:true},(err,q)=>{
        if(err){
            return res.status(401).json({error:"Something went wrong, try again"})
        }
        return res.status(200).json({message:"Updated successfully",q})
    })

}
exports.quizByfaculty=(req,res)=>{
    const {id}=req.params
    Quiz.find({author:id})
    .then(quiz=>{
        if(!quiz){
            return res.status(401).json({error:"Something went wrong, try again"})
        }
        return res.status(200).json({Quiz:quiz});
    })
    .catch(err=>console.error(err))
}

exports.quizid=(req,res)=>{
    const {id}=req.params
    Quiz.find({_id:id})
    .then(quiz=>{
        if(!quiz){
            return res.status(401).json({error:"Something went wrong, try again"})
        }
        return res.status(200).json({Quiz:quiz});
    })
    .catch(err=>console.error(err))
}

exports.deleteQuiz=(req,res)=>{
    const {id}=req.params
    Question.deleteMany({quiz:id},(er,q)=>{
        if(er){
            return res.status(401).json({error:"Something went wrong, try again"})
        }
        Quiz.findByIdAndDelete(id,(err,quiz)=>{
            if(err){
                return res.status(401).json({error:"Something went wrong, try again"})
            }
            return res.status(200).json({message:"deleted successfully"});
        })
    })

    
}

exports.uploadStudents=(req,res)=>{
    const {id,students} = req.body
    let newStudent=students
    let Author;
    let Secret;
    Quiz.findByIdAndUpdate(id,{ $push:{students:students}},{new:true},async(err,student)=>{
        if(err){
            return res.status(401).json({error:"Something went wrong, try again"})
        }
        Secret=student.secretId
        await User.findById(student.author,(err,user)=>{
            if(err){
                return res.status(401).json({error:"Something went wrong, try"})
            }
            Author=user.name;
            
        })
        for(let i=0;i<newStudent.length;i++){
            const msg = {
                to: newStudent[i], // Change to your recipient
                from: process.env.EMAIL, // Change to your verified sender
                subject: 'Email for invitation of quiz from QUIZEE',
                html: ` 
                <div style="background-color: #cf404d; margin: auto 10%; padding: 5%;text-align: center">
                <a href="${process.env.CLIENT_URL}" target="_blank">
                 <img src="${process.env.LOGO}" style="height:100px ;">
                </a>
                 <h1 style="color: #fff">
                    You are Invited by  ${Author} for taking quiz on QUIZEE
                 </h1>
                
                 <div  style="font-size:16px;font-weight:700; text-align:left;margin-top:15px;margin-bottom: 25px;color: #2d3e4f;"> 
                     <h2>Your Quiz Id for joining the Quiz is: ${Secret}</h2>
                     
                     </div>
                     <h3 style="margin-bottom: 30px;">Click on the button below to get started with Quizee</h3>
                 <a 
                 target="_blank"
                 style="background-color: #2d3e4f;color:#fff; text-decoration: none;  padding:15px 35px;border-radius:100px;font-size:30px;font-weight:700 "
                 href="${process.env.CLIENT_URL}">Start</a>
     
             </div>`,
                }
                sgMail
                .send(msg)
                .then(() => {
                })
                .catch((error) => {
                  console.error(error)
                  return res.status(400).json({error:"Error occured during signup",err:err})
                })
        }
        const unique = [ ...new Set(student.students)]
        student.students=unique
        student.save()
        return res.status(200).json({message:"done"})
    })
}

exports.addStudent = (req, res) => {
    const {email, id} = req.body;
    let newStudent=email
    let Author;
    let Secret;
    Quiz.findByIdAndUpdate(id,{ $push:{students:email}},{new:true},async(err,student)=>{
        if(err){
            return res.status(401).json({error:"Something went wrong, try again"})
        }
        Secret=student.secretId;
        await User.findById(student.author,(err,user)=>{
            if(err){
                return res.status(401).json({error:"Something went wrong, try"})
            }
            Author=user.name;
           
        })
        
            const msg = {
                to: newStudent, // Change to your recipient
                from: process.env.EMAIL, // Change to your verified sender
                subject: 'Email for invitation of quiz from QUIZEE',
                html: ` <div style="background-color: #cf404d; margin: auto 10%; padding: 5%;text-align: center">
                <a href="${process.env.CLIENT_URL}" target="_blank">
                 <img src="${process.env.LOGO}" style="height:100px ;">
                </a>
                 <h1 style="color: #fff">
                     Congratulations You are Invited by  ${Author} for taking quiz on QUIZEE
                 </h1>
                
                 <div  style="font-size:16px;font-weight:700; text-align:left;margin-top:15px;margin-bottom: 25px;color: #2d3e4f;"> 
                     <h2>Your Quiz Id for joining the Quiz is: ${Secret}</h2>
                     
                     </div>
                     <h3 style="margin-bottom: 30px;">Click on the button below to get started with Quizee</h3>
                 <a 
                 target="_blank"
                 style="background-color: #2d3e4f;color:#fff; text-decoration: none;  padding:15px 35px;border-radius:100px;font-size:30px;font-weight:700 "
                 href="${process.env.CLIENT_URL}"> Start with Quizee  </a>
     
             </div>`,
                }
                sgMail
                .send(msg)
                .then(() => {
                })
                .catch((error) => {
                  console.error(error)
                  return res.status(400).json({error:"Error occured during signup",err:err})
                })
                const unique = [ ...new Set(student.students)]
                student.students=unique
                student.save()

        return res.status(200).json({message:"done"})
    })
}

exports.allStudents =(req,res) =>{
    const {id}=req.params
    Quiz.findbyId(id ,{new:true},(err,quiz)=>{
        if(err){
            return res.status(401).json({error:"Something went wrong, try again"})
        }
        return res.status(200).json({Quiz:quiz});
    })
    
}

exports.removeStudent=(req,res)=>{
    const {id,studentId}=req.params
    Quiz.findByIdAndUpdate(id,{$pull:{students:studentId}},{new:true},(err,student)=>{
        if(err){
            return res.status(401).json({error:"Something went wrong, try"})
        }
        return res.status(200).json({message:"removed successfully"})

    })
}