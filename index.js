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
   Users.find({'email':req.body.EmailId},(err,doc)=>{
       if(err){
           console.log(err)
       }
       else{
           console.log(req.body.EmailId);
           console.log(req.body.password);
           console.log(doc);
           if(doc[0].password===req.body.password){
               var sess = req.session
               console.log(sess);
               sess.userName = doc[0].name;
               sess.userId = doc[0]._id;
               console.log(sess.userName,sess.userId);
               res.redirect('http://localhost:3000/logged/');
           }
           else{
               res.send("Wrong Id/Password");
           }
            
            
       }
   })
      
})
server.post('/pomoAddTasks',(req,res)=>{
    console.log(req.body);
    let User = new Users();
    Users.findOne({'email':req.body.email},(err,doc)=>{
        if(err){
            console.log(err);
        }
        else{
            console.log(doc[0]);
            res.send("Already exist");
            let tasks = new Tasks();
            tasks.taskTitle = req.body.task;
            tasks.taskPomoAsgn = req.body.taskPomoNum;
            tasks.taskDate = req.body.taskDate;
            tasks.userAsgn = User._id;
            tasks.save();
        }
    })
})


server.get('/pomoTasks',(req,res)=>{
        Tasks.find((err,doc)=>{
            if(err){
                console.log(err)
            }
            else{
                res.send(doc)
            }
        })
    
})