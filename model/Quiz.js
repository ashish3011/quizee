const mongoose=require('mongoose');
const {ObjectId}=mongoose.Schema
const quizSchema =new mongoose.Schema(
    {
        name: {
            type:String,
            required:true
        },
        students:[{
            type:String
        }],
        no_of_questions:{
            type:String,
            required:true
        },
        author:{
            type:ObjectId,
            ref:'User'
        },
        author_name:{
            type:String,
        },
        duration:{
            type:Number,
            required:true
        },
        startTime:{
            type:String
        },
        secretId:{
            type:String
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Quiz", quizSchema);