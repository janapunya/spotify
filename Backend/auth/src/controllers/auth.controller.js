const userModel = require('../models/user.model')
const jwt =require('jsonwebtoken');

async function userData(profile){
    try{
        let user = await userModel.findOne({email:profile.emails[0].value})
        if (!user) {
            user = await userModel.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                imgurl: profile.photos[0].value,
            });

        }
        return user;
    }
    catch(err){
        console.log("Error in userData:", err);
        throw err;
    }
}

async function findUser(email) {
    try {
      const user = await userModel.findOne(email)
      return user;
    } catch (err) {
      console.log("Error in findUserById:", err);
      throw err;
    }
  }




module.exports={
    userData,
   findUser
}