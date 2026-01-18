const mongoose = require('mongoose');

const musicSchema = new mongoose.Schema({
    id:{
        type:String
    },
    name:{
        type:String
    },
    imgUrl:{
        type:String
    },
    audioUrl:{
        type:String
    }
},{
    timestamps:true
});

const music = mongoose.model('music',musicSchema)
module.exports = music;