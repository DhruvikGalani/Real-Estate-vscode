import mongoose 
 from "mongoose";

 //create user json in mongoDB
 const userSchema = new mongoose.Schema({
    username:{
        type : String,
        require: true,
        unique : true,
    },
    email:{
        type : String,
        require: true,
        unique : true,
    },
    password:{
        type : String,
        require: true,
    }, 
 },{timestamps : true});

 const User = mongoose.model('User', userSchema);

 export default User;