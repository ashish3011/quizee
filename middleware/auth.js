const expressJwt= require('express-jwt');
const User=require('../model/User')

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"], // added later
    userProperty: "auth",
  });
  
  exports.authMiddleware = (req, res, next) => {
    const authUserEmail= req.auth.email;
    User.findOne({email:authUserEmail}).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }
        req.profile = user;
        next();
    });
};



exports.adminMiddleware = (req, res, next) => {
    const adminUserEmail = req.auth.email;
    User.findOne({ email:adminUserEmail }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }

        if (user.role !== "0" && user.role!=="19") {
            return res.status(400).json({
                error: 'Admin resources, Access denied!'
            });
        }

        req.profile = user;
        next();
    });
};

exports.facultyMiddleware = (req, res, next) => {
    const adminUserEmail = req.auth.email
    User.findOne({ email:adminUserEmail }).exec((err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: 'User not found'
            });
        }

        if (user.role === "2") {
            return res.status(400).json({
                error: 'Faculty resources, Access denied!'
            });
        }

        req.profile = user;
        next();
    });
};
