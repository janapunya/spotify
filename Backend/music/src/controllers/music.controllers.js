const { model } = require('mongoose');
const musicSchema = require('../models/music.model');
const imagekit = require('../services/imagekit');
const { v4 : uuidv4 } =require('uuid');
const jwt = require('jsonwebtoken');
const music = require('../models/music.model');

async function Add_music(req,res) {
    try{
        let cookie = req.cookies.auth_token;
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
        const {name} = req.body;
        const img = req.files.image[0];
        const audio = req.files.audio[0];
        const [imgUrl,audioUrl] = await Promise.all([
            imagekit(img.buffer.toString('base64'), uuidv4()),
            imagekit(audio.buffer.toString('base64'), uuidv4())
    ]);
    musicSchema.create({
        id:check.id,
        name,
        imgUrl,
        audioUrl
    })
    return res.status(200).json({
        stutas:true
    })
    }
    catch(err){
        console.log(err)
    }
}
async function allsongs(req,res) {
    try{
       
        let cookie = req.cookies.auth_token;
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
            const songs =await music.find({id:check.id});
            return res.json({
                songs
            })
        }
        catch(err){
            console.log(err)
        }
}

async function delete_song(req,res) {
    console.log("check")
    try{
        let cookie = req.cookies.auth_token;
        const {id} = req.body
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

            const responceData = await musicSchema.findByIdAndDelete(id);
            if(responceData){
                return res.json({
                    stutas: true
                })
            }
            else{
                return res.json({
                    stutas: false
                })
            }
    }
    catch(err){
        console.log(err);
        return res.json({
            stutas: false
        })
    }
}

async function songs(req,res) {
    try{
        console.log("check");
        const responceData = await musicSchema.find().sort({createdAt:-1}).limit(20);
        if(responceData){
            return res.json({
                stutas: true,
                responceData
            })
        }
        else{
            return res.json({
                stutas: false
            })
        }
    }
    catch(err){
        console.log(err);
        return res.json({
            stutas: false
        })
    }
}

module.exports ={
    Add_music,
    allsongs,
    delete_song,
    songs
}