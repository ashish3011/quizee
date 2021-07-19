const mongoose=require('mongoose');
const {ObjectId}=mongoose.Schema
const questionSchema =new mongoose.Schema(
    {
        question: {
            type:String,
            required:true
        },
        option1:{
            type:String,
            required:true
        },
        option2:{
            type:String,
            required:true
        },
        option3:{
            type:String,
            required:true
        },
        option4:{
            type:String,
            required:true
        },
        answer:{
            type:String,
            required:true
        },
        quiz:{
            type:ObjectId,
            ref:'Quiz'
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Question", questionSchema);