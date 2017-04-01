const express = require('express');
const router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');

//register
router.post('/register',(req,res,next)=>{
    let newUser = new User({
        name: req.body.name,
        email:req.body.email,
        username:req.body.username,
        password:req.body.password
    });

    User.addUser(newUser, (err,user)=> {
        if(err){
            res.json({sucess: false, msg:'Failed to register'});
        } else {
            res.json({sucess: true, msg:'Successful registeration'});
        }
    });
});

//authentication
router.post('/authenticate',(req,res,next)=>{
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username,(err,user) => {
        if(err) throw err;
        if(!user){
            return res.json ({success:false, msg: "No user found!"});
        }
        User.comparePassword(password, user.password,(err, isMatch) => {
            if(err) throw err;
            if(isMatch){
                //getting the token with expireIn obj
                const token = jwt.sign(user, config.secret,{
                    expiresIn: 604800 // 1 week
                });
                // we are not sending the entire user obj because we dont wanna send the password
                res.json({
                    success:true,
                    token:'JWT '+ token,
                    user: {
                        id:user._id,
                        name:user.name,
                        username : user.username,
                        email: user.email
                    }
                });
            } else {
                return res.json({success:false, msg:"Wrong password"});
            }
        });
    });
});

// profile
// passport.authenticate('jwt',{session:false}) second params to say that this route is protected
// the request needs to have header with token to access it
router.get('/profile',passport.authenticate('jwt',{session:false}),(req,res,next)=>{
    res.json({
        user:req.user
    });
});

 module.exports = router;
