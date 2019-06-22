const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let UserSchema = new Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    mobile:{type:String,required:true},
    password:{type:String,requried:true},
    country:{type:String},
})
const Users = mongoose.model("Users",UserSchema);
let taskSchema = new Schema({
    taskTitle:{type:String,required:true},
    taskDate:{type:Date,required:true},
    taskPomoAsgn:{type:Number,required:true},
    userAsgn:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users'
    }
})

const Tasks = mongoose.model("Tasks",taskSchema);
module.exports={Users,Tasks};