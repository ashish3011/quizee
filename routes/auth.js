const express= require("express");
const reader=require('xlsx')
const router = express.Router();
const {requireSignin, authMiddleware, adminMiddleware, facultyMiddleware} = require('../middleware/auth');
const {signup,register,profile,signout,signin,forgotpassword,reset,updatePassword,updateProfile,updatePic,googlesignin}=require('../controller/auth');

router.post('/signup',signup);
router.put('/register',requireSignin,register);
router.put('/profile',profile);
router.post('/signin',signin);
router.get('/signout', signout);
router.put('/forgotpassword', forgotpassword);
 router.put('/reset',requireSignin, reset);
 router.post('/google-signin', googlesignin);

 router.put('/update-profile', requireSignin,updateProfile);
 router.put('/update-password', requireSignin,updatePassword);
 router.put('/update-pic', requireSignin,updatePic);


module.exports = router;
