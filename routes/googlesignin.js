const express= require("express");
const router = express.Router();
const {googlesignin}=require('../controller/googlesignin');


 router.post('/google-signin', googlesignin);


module.exports = router;
