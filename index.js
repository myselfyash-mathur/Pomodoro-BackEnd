const express = require("express");
const server = express();
const session = require("express-session");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const dataModels = require('./dataModels.js');
let Users = dataModels.Users;
let Tasks = dataModels.Tasks;

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended:false}));
server.use(cors());
server.use(session({
    views:0,
    userName:'',
    secret: 'You@can_never.be/able+toFIND!',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}))
mongoose.connect('mongodb://localhost:27017/pomodorodb',{useNewUrlParser:true},(err)=>{
    if(err){
        console.log(err);
    }
    else{
        console.log("Database Connected");
    }
});
// let users = new Users()
// let tasks = new Tasks()
server.listen(8080,()=>{
    console.log("Server Started");
})
// server.get("/demo",(req,res)=>{
//     if(req.session.views){
//         req.session.views++;
//         res.json({views:req.session.views})
//         tasks.taskTitle='Make 2 Projects',
//         tasks.taskDate=Date.now(),
//         tasks.taskPomoAsgn=4,
//         tasks.userAsgn=yash._id
//         tasks.save((err)=>{
//             if(err){
//                 Tasks.find({}).populate('userAsgn').exec((err,tasks)=>{
//                     console.log(JSON.stringify(tasks,null,"\t"))
//                 })
//             }
//         })
//     }
//     else{
//         req.session.views=1
//         res.send("Welcome to the Demo page!!")
//         users.name="Yash Mathur",
//         users.email="yashmthr65@gmail.com",
//         users.mobile='8107592552',
//         users.password='yash123',
//         users.country='India'
//         users.save();
//     }
// })

server.post('/pomoLogin',(req,res)=>{
   Users.find({'email':req.body.email},(err,doc)=>{
       if(err){
           console.log(err)
       }
       else{
            console.log(req.body.name);
            console.log(req.body.email);
            console.log(req.body.UId);
            if(doc[0]){
                 res.send(doc[0])
            }
            else{
                console.log("No such User,Create New");
                 let nUser = new Users();
                 nUser.name = req.body.name;
                 nUser.email = req.body.email;
                 console.log("Created");
                 nUser.save();
            }
           }
        
   })
      
})
server.post('/pomoAddTasks',(req,res)=>{
    console.log("This is recived",req.body);
    Users.findOne({'email':req.body.email},(err,doc)=>{
        if(err){
            console.log(err);
        }
        else{
            if(doc){
            console.log("This is the data of person",doc);
            res.send("Already exist");
            Tasks.findOne({'taskTitle':req.body.task},{'userAsgn':doc._id},(err,Tdoc)=>{
                if(err){
                    console.log("Task Err of New")
                }
                else{
                    if(Tdoc){
                        console.log("Task Exist")
                        console.log(Tdoc)
                    }
                    else{
                        let tasks = new Tasks();
                        tasks.taskTitle = req.body.task;
                        tasks.taskPomoAsgn = req.body.taskPomoNum;
                        tasks.taskDate = req.body.taskDate;
                        tasks.userAsgn = doc._id;
                        tasks.save();
                        console.log("This is docs of tasks",tasks);
                        }
                        
                    }
                })
        }
            else{
                res.send("Doesnot Exist and Created New");
            }
        }
    })
})

server.post('/pomoTasks',(req,res)=>{
    Users.findOne({'email':req.body.email},(err,doc)=>{
        if(err){
            console.log(err)
        }
        else{
            console.log("This is the User",doc)
            if(doc){
                Tasks.find({'userAsgn':doc._id},(err,doc)=>{
                    if(err){
                        console.log("Error of Tasks")
                    }
                    else{
                        res.send(doc);
                    }
                })
            }
        }
    })
})




server.put('/updatePomo',(req,res)=>{
    Tasks.findOne({'taskTitle':req.body.taskTitle},(err,doc)=>{
        if(err){
            console.log(err)
        }
        else{
            console.log(doc)
            console.log(req.body);
            mongoose.set('useFindAndModify', false);
            Tasks.findOneAndUpdate({'taskTitle':req.body.taskTitle},{'taskPomoAsgn':req.body.taskPomoAsgn},(err,doc)=>{
                if(err){
                    console.log(err)
                }
                else{
                    console.log(doc)
                }
            })
            console.log("Updating the Value of Pomo")
        }
    })
})

server.delete('/deleteCompTasks/:taskTitle',(req,res)=>{
    console.log("Data Came",req.params)
    Tasks.findOneAndDelete({'taskTitle':req.params.taskTitle},(err,doc)=>{
        if(err){
            console.log("Deletion Error",err);
        }
        else{
            console.log("Deleted data",doc);
        }
    })
})