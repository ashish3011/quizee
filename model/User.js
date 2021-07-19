const mongoose=require('mongoose');
const ObjectId =mongoose.ObjectId
const userSchema =new mongoose.Schema(
    {
        name: {
            type:String,
        },
        username:String,
        email: {
          type: String,
          required: true,
          index: true,
          unique:true
        },
        role: {
          type: String,
          default: "2",
        },
        mobile_number:{
            type:String,
        },
        password:{
            type:String
        },
        dob:{
            type:Date,
        },
        token:{
            type:String,
        },
        validation:{
            type:Boolean,
            default:false,
        },
        signinToken : {
            type:String
        },
        pic:{
            type: String,
            default: "https://res.cloudinary.com/quizee/image/upload/v1625900963/Profile/profile_gnpuwj.jpg"
        },
        quiz:[{
            type:ObjectId,
            ref:'Quiz'
        }]

    },
    { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);