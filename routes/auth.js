const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { body, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken');
const JWT_SECRET = "Pankilisagoodboy";
const fetchuser = require('../middleware/fetchuser')

//Route 1 create a user uisng: POST "api/auth/". Does not require login.
router.post('/', [
    body('email', "Enter a valid email").isEmail(),
    body('name', "Name should be alteast 3 characters long").isLength({ min: 3 }),
    body('password', "Password must be of 8 characters").isLength({ min: 8 }),

], async (req, res) => {

    try {

        //if there are errors return Bad request and errors.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        //check if user with same email exist
        if (await User.findOne({ email: req.body.email })) {
            return res.status(400).json({ error: "user already exist" });
        }


        const salt = (await bcrypt.genSalt(10)).toString();
        const secpass = await bcrypt.hash(req.body.password, salt);
        //creating new user
        let user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: secpass
        })

        //sending jwt token to user.
        const data = {
            user: {
                id: user.id
            }

        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        res.json({ authtoken });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Some Error");
    }

})


//Route 2 authenticate a user uisng: POST "api/auth/login". Does not require login.

router.post('/login', [
    body('email', "Enter a valid email").isEmail(),
    body('password', "Password must be of 8 characters").isLength({ min: 8 }),

], async (req, res) => {
    let success = false;
    //if there are errors return Bad request and errors.
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email: email });

        if (!user) {
            return res.status(400).json({ success,errors: "please Enter a correct password" });
        }

        const passwordcompare = await bcrypt.compare(password, user.password);

        if (!passwordcompare) {
            return res.status(400).json({ success,errors: "please Enter a correct password" });
        }

        const payload = {
            user: {
                id: user.id
            }
        }
        success = true
        const authtoken = jwt.sign(payload, JWT_SECRET);
        res.send({ success, authtoken });

    } catch (error) {
        res.status(500).send({success,message:"Internal Server Error"});
    }

})


//Route 3 get userinfo using : POST "api/auth/getuser".require login.

router.post('/getuser', fetchuser, async (req, res) => {

    try {
        const userid = req.user.id;
        const user = await User.findById(userid).select("-password");
        res.send(user);

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }

})

module.exports = router