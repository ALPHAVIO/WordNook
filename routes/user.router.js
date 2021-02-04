const mongoose = require('mongoose');
const router = mongoose.Router();
const User = require('../models/User.model');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');


router.post("/sign-up", (req, res) => {
    
    const { firstName, lastName, userName, email, password } = req.body;

    // Check if all the fields are filled
    if(!firstName || !lastName || !userName || !email || !password){
        return res.status(422).json({error : "Please add all the fields!"});
    }

    // Check if the username or email already taken
    User.findOne({ email }, (err, doc) => {
        if(doc) {
            return res.status().json({error : "Email already taken!"});
        }
        User.findOne({userName}, (err , doc) => {
            if(doc){
                return res.status().json({error : "Username already taken!"});
            }

            bcrypt.hash(password, 12, (err, hashedPassword) => {
                const newUser = new User({
                    firstName,
                    lastName,
                    userName,
                    email,
                    password: hashedPassword
                });

                newUser.save((err, doc) => {
                    if(err || !doc){
                        return res.status(422).json({error : "Oops something went wrong!"});
                    }
                    
                    const token = jwt.sign({_id: doc._id}, process.env.SECRET_KEY);

                    //Send back the token to the user as a httpOnly cookie
                    res.cookie("token", token, {
                        httpOnly: true
                    })
                    res.json({
                        success : "Sign Up successful!",
                        user: {
                            id: doc._id,
                            name: doc.userName
                        }
                    });
                });
            });

        });
    });

});

router.post("/log-in", (req, res) => {

    const { userName, password } = req.body;
    
    if(!userName || !password){
        res.status(401).json({error : "Please add all the fields!"});
    }

    User.findOne({userName}, (err, doc) => {
        if(err || !doc){
            return res.status(401).json({error: "Invalid username or password!"});
        }

        bcrypt.compare(password, doc.password, (err, matched) => {
            if(err || !matched){
                return res.status(401).json({error : "Invalid usrname or password!"});
            }

            const token = jwt.sign({_id: doc._id, userName}, process.env.SECRET_KEY);

            res.cookie("token", token, {
                httpOnly: true
            });

            res.json({
                success: "Log In succesful!",
                user: {
                    id: doc._id,
                    name: doc.userName
                }
            });
        })
    })
});

module.exports = router;