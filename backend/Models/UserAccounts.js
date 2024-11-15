const mongoose = require("mongoose")

const Account_model = mongoose.Schema({

    userName: {type:String},
    userEmail: {type:String},
    userPassword: {type:String},
    userImage: {type:String},
    userStatus: {type:String},


})
 
// yaha modela ki value ko variable me likha ha
const UserAccount = mongoose.model("UserAccount", Account_model);
module.exports = { UserAccount };  // yaha model ko export kiya ha taki use karna mushkil na ho