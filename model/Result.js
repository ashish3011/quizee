const mongoose=require('mongoose');
const {ObjectId}=mongoose.Schema
const resultSchema =new mongoose.Schema(
    {
        student:{
            type: ObjectId,
            ref:'User'
        },
        quiz:{
            type:ObjectId,
            ref:'Quiz'
        },
        questions:[{
            question:{type:String},
            option1:{type:String},
            option2:{type:String},
            option3:{type:String},
            option4:{type:String},
            answer:{type:String},
            userAnswer:{type:String,
            default:'0'}
        }],
        marks:{
            type:Number,
            default:0
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("Result", resultSchema);