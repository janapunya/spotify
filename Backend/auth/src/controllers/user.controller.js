const user = require('../models/user.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { v4: uuidv4 } = require('uuid');
const imageUpload = require('../services/imagekit.io')

async function checkuser(req, res) {
    let cookie = req.cookies.auth_token;
    try {
        if (!cookie) {
            return res.json(
                { stutas: false }
            )
        }
        const check = jwt.verify(cookie, process.env.JWT_COOKIE_SECRET);
        if (!check) {
            return res.json({
                stutas: false
            })
        }
        const userData = await user.findById(check.id)
        return res.json({
            stutas: true,
            user: userData
        })
    } catch (err) {
        console.log(err)
    }
}

async function create_user(req, res) {
    const { name, email, password } = req.body;
    const img = req.file;
    try {
        const isUser = await user.findOne({ email });
        if (isUser) {
            return res.json({
                IsCreated: false,
                message: "User Already exist"
            })
        }

        const [imgURL, hash] = await Promise.all([
            imageUpload(img.buffer.toString('base64'), uuidv4()),
            bcrypt.hashSync(password, 15)
        ])

        const newuser = await user.create({
            name,
            email,
            imgurl: imgURL,
            password: hash
        })

        const token = jwt.sign({ email: newuser.email, id: newuser._id }, process.env.JWT_COOKIE_SECRET, { expiresIn: "1d" });
        res.cookie("auth_token", token, {
            httpOnly: true,
            sameSite: "none",
            secure: true,
            maxAge: 86400000,
        });

        return res.json({
            IsCreated: true,
            message: "user create succesfully"
        })

    } catch (err) {
        console.log(err);
    }
}

async function login_user(req, res) {
    try {
        const {email,password} = req.body;
        const userdata = await user.findOne({email});
        if(!userdata){
            return res.json({
                stutas:false,
            })
        }

        const pass = await bcrypt.compare(password, userdata.password);
 console.log(pass)
        if(pass){
            const token = jwt.sign({ email: userdata.email, id: userdata._id }, process.env.JWT_COOKIE_SECRET, { expiresIn: "1d" });
            res.cookie("auth_token", token, {
                httpOnly: true,
                sameSite: "none",
                secure: true,
                maxAge: 86400000,
            });
            return res.json({
                stutas:true,
                pass:true
            })
        }
        else{
            return res.json({
                stutas:true,
                pass:false,
            })
        }
    } catch (err) {
        console.log(err)
    }
}

async function update_user(req, res) {
    let cookie = req.cookies.auth_token;
    try {
        if (!cookie) {
            return res.json({
                stutas: false,
                message: "Not authenticated"
            })
        }
        const check = jwt.verify(cookie, process.env.JWT_COOKIE_SECRET);
        if (!check) {
            return res.json({
                stutas: false,
                message: "Invalid token"
            })
        }
        
        const { role } = req.body;
        
        if (role && !['User', 'Artist'].includes(role)) {
            return res.json({
                stutas: false,
                message: "Invalid role. Must be 'User' or 'Artist'"
            })
        }

        const updateData = {};
        if (role) updateData.role = role;

        const updatedUser = await user.findByIdAndUpdate(
            check.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return res.json({
                stutas: false,
                message: "User not found"
            })
        }

        return res.json({
            stutas: true,
            message: "User updated successfully",
            user: updatedUser
        })
    } catch (err) {
        console.log(err)
        return res.json({
            stutas: false,
            message: "Error updating user"
        })
    }
}

async function create_artist(req, res) {
    let cookie = req.cookies.auth_token;
    try {
        if (!cookie) {
            return res.json({
                stutas: false,
                message: "Not authenticated"
            })
        }
        const check = jwt.verify(cookie, process.env.JWT_COOKIE_SECRET);
        if (!check) {
            return res.json({
                stutas: false,
                message: "Invalid token"
            })
        }
        const userdata = await user.findByIdAndUpdate(check.id, { role: 'Artist' }, { new: true });
        if(!userdata){
            return res.json({
                stutas: false,
                message: "User not found"
            })
        }
        return res.json({
            stutas: true,
            message: "Artist created successfully",
            user: userdata
        })
    } catch (err) { 
        console.log(err)
        return res.json({
            stutas: false,
            message: "Error creating artist"
        })
    }
}

module.exports = {
    checkuser,
    create_user,
    login_user,
    update_user,
    create_artist
}