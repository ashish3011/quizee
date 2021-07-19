const User = require('../model/User');
const sgMail = require('@sendgrid/mail');
const jwt = require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

exports.signup= async (req,res) =>{
    const {email}=req.body;
    const otp=(Math.floor(Math.random() * (10000000)));
    
    User.findOne({email})
    .then((u)=>{
        if(u && u.validation===false){
            
            const msg = {
                to: u.email, // Change to your recipient
                from: process.env.EMAIL, // Change to your verified sender
                subject: 'Email verification for Quizee',
                html: `
                <div style="background-color: #cf404d; margin: auto 10%; padding: 5%;text-align: center">
                <a href="${process.env.CLIENT_URL}" target="_blank">
                 <img src="https://res.cloudinary.com/quizee/image/upload/v1625901176/Profile/logo_xnm9uv.png" style="height:100px ;">
                </a>
                 
                 <h1 style="color: #fff">
                     Thank you for signing up!!!
                 </h1>
                 <h3 style="margin-bottom: 50px;">Click on the button to verify your account...</h3>
                 <a 
                 target="_blank"
                 style="background-color: #2d3e4f;color:#fff; text-decoration: none; padding:15px 35px;border-radius:100px;font-size:30px;font-weight:700 "
                 href="${process.env.CLIENT_URL}/verifyaccount/${u.email}/${u.token}"> Verify </a>
     
             </div>            `,
            }
                sgMail
                .send(msg)
                .then(() => {
                  
                })
                .catch((error) => {
                  console.error(error)
                  return res.status(400).json({error:"Error occured during signup",err:error})
                })
                return res.status(200).json({message:"mail sent successfully Check your email",u})
        }

        if(u && u.validation===true){
            return res.status(400).json({err:"Email already existed"});
        }
            
        const userdata=new User({email});
        userdata.token=jwt.sign({email},process.env.JWT_SECRET,{expiresIn:60*100*10});
        userdata.save()
        .then((u1)=>{
        const msg = {
            to: u1.email, // Change to your recipient
            from: process.env.EMAIL, // Change to your verified sender
            subject: 'Email verification for Quizee',
            html: `
            <div style="background-color: #cf404d; margin: auto 10%; padding: 5%;text-align: center">
            <a href="${process.env.CLIENT_URL}" target="_blank">
             <img src="https://res.cloudinary.com/quizee/image/upload/v1625901176/Profile/logo_xnm9uv.png" style="height:100px ;">
            </a>
             
             <h1 style="color: #fff">
                 Thank you for signing up!!!
             </h1>
             <h3 style="margin-bottom: 50px;">Click on the button to verify your account...</h3>
             <a 
             target="_blank"
             style="background-color: #2d3e4f;color:#fff; text-decoration: none; padding:15px 35px;border-radius:100px;font-size:30px;font-weight:700 "
             href="${process.env.CLIENT_URL}/verifyaccount/${u1.email}/${u1.token}"> Verify </a>
 
         </div>            `,
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

exports.signout = (req, res) => {
    res.clearCookie('token');
    res.json({
        message: 'Signout success'
    });
};

exports.register=(req,res)=>{
    const {authorization}= req.headers
    //authorization ===Bearer ewefwegwrherhe
    if(!authorization){
        return status(401).json({error:"you must be logged in"})
    }
    const token=authorization.replace("Bearer ","")
    jwt.verify(token,process.env.JWT_SECRET,(err,payload)=>{
        if(err){
            return res.status(401).json({error:"you must be logged in"})
        }

        const {email} =payload
        User.findOneAndUpdate({email},{validation:true},{new:true}, (err,data=>{
            if(err){
                console.log(err);
                return res.json({error:err});
            }
            return res.status(200).json({message:"token verified"})
        })
        )
    })
}

exports.profile=async(req,res)=>{
    const {name,mobile_number,password,dob,email}=req.body;
     User.findOne ({email})
    .then(async (user)=>{
      if(!user)
      {
          return res.status(430).json({error:"user does not exist"})
      }  
    await bcrypt.hash(password,12)
    .then(hp=>{
        if(hp){
            user.password=hp
            user.dob=dob;
            user.mobile_number=mobile_number;
            user.name=name;
            user.username=email.split("@")[0];
            user.signinToken=jwt.sign({email},process.env.JWT_SECRET,{expiresIn:(60*6000)});
            user.save()
            .then((d)=>   res.status(201).json({message:"update successfully",d}))
            .catch((err)=>console.log("err",err));
        }   
    })
    .catch((err)=>console.log("err",err))
    })
    .catch((err)=>console.log("err",err))
}

exports.signin = (req, res) => {
    const {email, password} = req.body;
    User.findOne({email})
    .then((user) => {
        if(!user){
            return res.json({
                error:"User doesnot exist"
            })
        }
        bcrypt.compare(password, user.password, (err, data) => {
            //if error than throw error
            if (err) console.log(err)

            //if both match than you can do anything
            if (data) {
                user.signinToken=jwt.sign({email},process.env.JWT_SECRET,{expiresIn:(60*6000)});
                res.cookie('token', user.signinToken, { expiresIn: '1d' });
                user.save();
                return res.status(200).json({ 
                    message: "Login success",
                    signinToken:user.signinToken,
                    role:user.role,
                    name:user.name,
                    email,
                    number:user.mobile_number,
                    dob:user.dob,
                    pic:user.pic,
                    _id:user._id
                  })

            } else {
                return res.status(401).json({ error: "Invalid credentials" })
            }

        })
        
    })
    .catch((error) => {
        console.error(error)
        return res.status(400).json({error:"Error occured during sign in"})
      })
}


exports.forgotpassword =async (req,res) =>{
    const {email}=req.body;
   
    User.findOne({email})
    .then((u)=>{
        if(!u){
            return res.status(400).json({error:"Email doesn't exist"});
        }
        u.token=jwt.sign({email},process.env.JWT_SECRET,{expiresIn:60*100*10});
        u.save()
        const msg = {
            to: u.email, // Change to your recipient
            from: process.env.EMAIL, // Change to your verified sender
            subject: 'Reset Password of Quizee ',
            html: `
            <div style="background-color: #cf404d; margin: auto 10%; padding: 5%;text-align: center">
           <a href="${process.env.CLIENT_URL}" target="_blank">
            <img src="${process.env.LOGO}" style="height:100px ;">
           </a>
            <h3 style="margin-bottom: 50px;">Click on the button to Reset Password </h3>
            <a 
            target="_blank"
            style="background-color: #2d3e4f;color:#fff; text-decoration: none;  padding:15px 35px;border-radius:100px;font-size:30px;font-weight:700 "
            href="${process.env.CLIENT_URL}/resetpassword/${u.email}/${u.token}"> Reset Password  </a>
        </div>`,
            }
            sgMail
            .send(msg)
            .then(() => {
            })
            .catch((error) => {
              console.error(error)
              return res.status(400).json({error:"Error occured during forgot password"})
            })
            return res.status(201).json({message:"Email sent Successfully",u})
    })
    .catch((error) => {
        console.error(error)
        return res.status(400).json({error:"Error occured during forgot password"})
      })
}


exports.reset=(req,res)=>{
    const email=req.auth.email
    const {password}=req.body
    User.findOne({email})
    .then((user)=>{
        if(!user){
            return res.status(400).json({error:"Something went wrong during reset password please try again"});
        }

        bcrypt.hash(password,12)
        .then(hp=>{
            if(!hp){
                return res.status(400).json({error:"Something went wrong during reset password please try again"});
            }
            user.password=hp
            user.save().then(()=>res.status(200).json({message:"password reset successfully"}))
            .catch((error) => {
                console.error(error)
                return res.status(400).json({error:"Error occured during reset password"})
              })
        })
        .catch((error) => {
            console.error(error)
            return res.status(400).json({error:" Error occured during reset password"})
          })

    })
    .catch((error) => {
        console.error(error)
        return res.status(400).json({error:"Error occured during reset password"})
      })
} 


const client  =  new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
exports.googlesignin = async (req, res) => {
    const idToken = req.body.tokenId;
    
    await client.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID }).then(response => {
        const { email_verified, name, email, jti } = response.payload;
        if (email_verified) {
            User.findOne({ email }).exec((err, user) => {
                if (user) {
                    user.signinToken=jwt.sign({email},process.env.JWT_SECRET,{expiresIn:(60*6000)});
                    res.cookie('token', user.signinToken, { expiresIn: '1d' });
                    user.save();
                    return res.status(200).json({ 
                        message: "Login success",
                        signinToken:user.signinToken,
                        role:user.role,
                        name:user.name,
                        email,
                        dob:user.dob,
                        mobile_number:user.mobile_number,
                        pic:user.pic,
                        _id:user._id
                      })
                } else {
                    let username = email.split("@")[0];
                    let password = jti;
                    user = new User({ name, email, username, password });
                    user.signinToken=jwt.sign({email},process.env.JWT_SECRET,{expiresIn:(60*6000)});
                    user.validation=true;
                    res.cookie('token', user.signinToken, { expiresIn: '1d' });
                    user.save((err, data) => {
                        if (err) {
                            return res.status(400).json({
                                error: "Try again"
                            });
                        }
                        return res.status(200).json({ 
                            message: "Login success",
                            signinToken:data.signinToken,
                            role:data.role,
                            name:data.name,
                            email,
                            mobile_number:data.mobile_number,
                            dob:data.dob,
                            pic:data.pic,
                            _id:data._id
                          })
                    });
                }
            });
        } else {
            return res.status(400).json({
                error: 'Google login failed. Try again.'
            });
        }
    });
};

exports.updateProfile=async(req,res)=>{
    const {name,mobile_number,dob}=req.body;
    const {email}=req.auth
    User.findOne ({email})
    .then(async (user)=>{
      if(!user)
      {
          return res.status(430).json({error:"user does not exist"})
      }  
            user.dob=dob;
            user.mobile_number=mobile_number;
            user.name=name;
            user.save()
            .then((d)=>   res.status(201).json({message:"update successfully",d}))
            .catch((err)=>console.log("err",err));   
    })
    .catch((err)=>console.log("err",err))
}

exports.updatePassword=async(req,res)=>{
    const {password}=req.body;
    const {email}=req.auth
     User.findOne ({email})
    .then(async (user)=>{
      if(!user)
      {
          return res.status(430).json({error:"user does not exist"})
      }  
    await bcrypt.hash(password,12)
    .then(hp=>{
        if(hp){
            user.password=hp
            user.save()
            .then((d)=>   res.status(201).json({message:"Password updated successfully",d}))
            .catch((err)=>console.log("err",err));
        }   
    })
    .catch((err)=>console.log("err",err))
    })
    .catch((err)=>console.log("err",err))
}
exports.updatePic=(req, res) =>{
    const {pic}=req.body;
    const {email}=req.auth
    User.findOne ({email})
    .then(async (user)=>{
      if(!user)
      {
          return res.status(430).json({error:"user does not exist"})
      }  
            user.pic=pic;
            user.save()
            .then((d)=>   res.status(201).json({message:"update successfully",d}))
            .catch((err)=>console.log("err",err));   
    })
    .catch((err)=>console.log("err",err))
}
