const User = require('../model/User');
const sgMail = require('@sendgrid/mail');
const jwt = require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const { OAuth2Client } = require('google-auth-library');


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
