const User = require('../model/User');
const Quiz = require('../model/Quiz');
const sgMail = require('@sendgrid/mail');
const jwt = require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const Question = require('../model/Question');
const Result=require('../model/Result');

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

exports.allAdmin = (req, res) => {
    User.find({role:'0'})
    .then(users => {
        if(!users){
            return res.status(400).json({error: 'No admin found'})
        }
        return res.status(200).json({users})
    })
    .catch(e => console.log(e))
}

exports.allFaculty = (req, res) => {
    User.find({role:'1'})
    .then(users => {
        if(!users){
            return res.status(400).json({error: 'No faculty found'})
        }
        return res.status(200).json({users})
    })
    .catch(e => console.log(e))
}
exports.allStudent = (req, res) => {
    User.find({role:'2'})
    .then(users => {
        if(!users){
            return res.status(400).json({error: 'No student found'})
        }
        return res.status(200).json({users})
    })
    .catch(e => console.log(e))
}

exports.addNewAdmin= async (req,res) =>{
    const {email}=req.body;
    const otp=(Math.floor(Math.random() * (10000000)));
    
    User.findOne({email})
    .then((u)=>{
        if(u){
            return res.status(400).json({err:"Email already existed"});
        }
            
        let userdata=new User({email});
        userdata.token=jwt.sign({email},process.env.JWT_SECRET,{expiresIn:'4d'});
        userdata.role='0'
        userdata.save()
        .then((u1)=>{
        const msg = {
            
            to: u1.email, // Change to your recipient
            from: process.env.EMAIL, // Change to your verified sender
            subject: 'Request approved for becoming Admin',
            html: `
            <div style="background-color: #cf404d; margin: auto 10%; padding: 5%;text-align: center">
           <a href="${process.env.CLIENT_URL}" target="_blank">
            <img src="${process.env.LOGO}" style="height:100px ;">
           </a>
            <h1 style="color: #fff">
                Congratulations Your Request for becoming Admin has been approved
            </h1>
            <h3 style="margin-bottom: 50px;">Click on the button to Start Managing Quizes for your Organization...</h3>
            <a 
            target="_blank"
            style="background-color: #2d3e4f;color:#fff; text-decoration: none;  padding:15px 35px;border-radius:100px;font-size:30px;font-weight:700 "
            href="${process.env.CLIENT_URL}/verifyaccount/${u1.email}/${u1.token}"> Start  </a>

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
        res.status(201).json({message:"Sign up Successfully",u1})})
        .catch((err)=>{
            console.error(err)
            return res.status(400).json({error:"Error occured during signup"})})
    })
    .catch((error) => {
        console.error(error)
        return res.status(400).json({error:"Error occured during sign up"})
      })
}


exports.addNewFaculty= async (req,res) =>{
    const {email}=req.body;
    const otp=(Math.floor(Math.random() * (10000000)));
    
    User.findOne({email})
    .then((u)=>{
        if(u){
            return res.status(400).json({err:"Email already existed"});
        }
            
        let userdata=new User({email});
        userdata.token=jwt.sign({email},process.env.JWT_SECRET,{expiresIn:'4d'});
        userdata.role='1'
        userdata.save()
        .then((u1)=>{
        const msg = {
            
            to: u1.email, // Change to your recipient
            from: process.env.EMAIL, // Change to your verified sender
            subject: 'Request approved for becoming Faculty',
            html: `
            <div style="background-color: #cf404d; margin: auto 10%; padding: 5%;text-align: center">
           <a href="${process.env.CLIENT_URL}" target="_blank">
            <img src="${process.env.LOGO}" style="height:100px ;">
           </a>
            <h1 style="color: #fff">
                Your Request for becoming Faculty has been approved
            </h1>
            <h3 style="margin-bottom: 50px;">Click on the button to Start taking quizes on Quizee...</h3>
            <div  style="font-size:16px;font-weight:700; text-align:left;color:#fff"> 
                <h2>Guidelines for adding Questions through Excel File</h2>
                <ul style="color:#2d3e4f">
                    <li>First row in each column must be a column title</li>
                    <li>First Column will be question with title <strong>'Question'</strong></li>
                    <li>Second Column will be Option 1 with title <strong>'Option1'</strong></li>
                    <li>Third Column will be Option 2 with title <strong>'Option2'</strong></li>
                    <li>Fourth Column will be Option 3 with title <strong>'Option3'</strong></li>
                    <li>Fifth Column will be Option 4 with title <strong>'Option4'</strong></li>
                    <li>Sixth Column will be Answer in range of 1 to 4 with title <strong>'Answer'</strong></li>
                </ul> 
                <h2>Guidelines for adding Students through Excel File</h2>
                <ul style="color:#2d3e4f">
                    <li>First row in each column must be a column title</li>
                    <li>First Column will be Email Id </li>
                   
                </ul> 
                </div>
            <a 
            target="_blank"
            style="background-color: #2d3e4f;color:#fff; text-decoration: none;  padding:15px 35px;border-radius:100px;font-size:30px;font-weight:700 "
            href="${process.env.CLIENT_URL}/verifyaccount/${u1.email}/${u1.token}"> Start </a>

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
        res.status(201).json({message:"Sign up Successfully",u1})})
        .catch((err)=>{
            console.error(err)
            return res.status(400).json({error:"Error occured during signup"})})
    })
    .catch((error) => {
        console.error(error)
        return res.status(400).json({error:"Error occured during sign up"})
      })
}

exports.removeUser = (req, res) => {
    const {email} =req.params

    User.findOneAndDelete({email} ,async(err, docs) =>{
        if (err){
            console.log(err)
            return res.status(400).json({error: 'User could not be deleted'})
        }

            if(docs.role==='1'){
                Quiz.find({author:docs._id},async(er,qu)=>{
                    if(er){
                        return res.status(400).json({error:"something went wrong try againg"});
                    }

                    for(let i=0;i<qu.length;i++){
                        await Result.deleteMany({quiz:qu[i]._id},(er2,r)=>{
                            if(er2){
                                return res.status(401).json({error:"Something went wrong, try again"})
                            }
                        })
                        Question.deleteMany({quiz:qu[i]._id},(er1,q)=>{
                                    if(er1){
                                        return res.status(401).json({error:"Something went wrong, try again"})
                                    }
                                    Quiz.findByIdAndDelete(qu[i]._id,(err1,quiz)=>{
                                        if(err){
                                            return res.status(401).json({error:"Something went wrong, try again"})
                                        }
                                    })
                                })
                    }
    
                })

            }
            else if(docs.role==='2'){
               await Result.deleteMany({student:docs._id},(err3,s)=>{
                   if(err3){
                    return res.status(401).json({error:"Something went wrong, try again"})
                   }
               }) 
            }
            const msg = {
            
                to: email, // Change to your recipient
                from: process.env.EMAIL, // Change to your verified sender
                subject: 'Account Deleted due to some reasons',
                html: `
                <div style="background-color: #cf404d; margin: auto 10%; padding: 5%;text-align: center">
               <a href="${process.env.CLIENT_URL}" target="_blank">
                <img src="${process.env.LOGO}" style="height:100px ;">
               </a>
                <h1 style="color: #fff">
                    Account deleted due to some reasons
                </h1>
            
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

            return res.status(200).json({message:"deleted successfully"});    
    });
}