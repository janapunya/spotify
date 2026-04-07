const { model } = require('mongoose');
const musicSchema = require('../models/music.model');
const imagekit = require('../services/imagekit');
const { v4 : uuidv4 } =require('uuid');
const jwt = require('jsonwebtoken');
const music = require('../models/music.model');

function getBearerToken(req) {
    const header = req.headers?.authorization || req.headers?.Authorization;
    if (!header || typeof header !== 'string') return null;
    const [type, token] = header.split(' ');
    if (type !== 'Bearer') return null;
    return token || null;
}

async function Add_music(req,res) {
    try{
        const token = getBearerToken(req);
            if (!token) {
                return res.json(
                    { stutas: false }
                )
            }
            const check = jwt.verify(token, process.env.JWT_COOKIE_SECRET);
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
       
        const token = getBearerToken(req);
            if (!token) {
                return res.json(
                    { stutas: false }
                )
            }
            const check = jwt.verify(token, process.env.JWT_COOKIE_SECRET);
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
    try{
        const token = getBearerToken(req);
        const {id} = req.body
            if (!token) {
                return res.json(
                    { stutas: false }
                )
            }
            const check = jwt.verify(token, process.env.JWT_COOKIE_SECRET);
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

async function SearchData(req,res) {
    const { query = "" } = req.body;
    try{
        const trimmedQuery = query.trim();

        if(trimmedQuery === ""){
            return res.json({
                songs:[]
            });
        }

        const escapedQuery = trimmedQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const songData = await musicSchema
            .find({ name: { $regex: escapedQuery, $options: 'i' } })
            .sort({ createdAt: -1 })
            .limit(20);

        return res.json({
            songs: songData
        });
    }
    catch(err){
        console.log(err);
        return res.status(500).json({
            songs: []
        });
    }
}

module.exports ={
    Add_music,
    allsongs,
    delete_song,
    songs,
    SearchData
}