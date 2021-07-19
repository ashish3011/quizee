const express= require("express");
const reader=require('xlsx')
const router = express.Router();
const {requireSignin, authMiddleware, adminMiddleware, facultyMiddleware} = require('../middleware/auth');
const {allAdmin, allFaculty, allStudent, addNewAdmin,addNewFaculty, removeUser} = require('../controller/admin')

router.get('/all-admin', requireSignin, adminMiddleware, allAdmin)
router.post('/add-new-admin', requireSignin, adminMiddleware, addNewAdmin)
router.get('/all-faculty', requireSignin, adminMiddleware, allFaculty)
router.post('/add-new-faculty', requireSignin, adminMiddleware, addNewFaculty)
router.delete('/remove-user/:email', requireSignin, adminMiddleware, removeUser)
router.get('/all-student', requireSignin, adminMiddleware, allStudent)

module.exports = router;
