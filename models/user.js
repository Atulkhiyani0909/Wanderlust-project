const { required } = require('joi');
const mongoose=require('mongoose');
const Schema=mongoose.Schema;
const passportLocalMongoose=require('passport-local-mongoose');
//this passport local mongoose auto created our username and password for the DB and we don't need to write it seprately and it will save our password in the salt and hashed form that will give more security to our password


const userSchema=new Schema({
    email:{
        type:String,
        required:true
    }
});


userSchema.plugin(passportLocalMongoose);
//pugin to our userSchema for the passport login for authentication

module.exports=mongoose.model("User",userSchema);

//for more go to the passpot npm package for strategies