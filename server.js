const express = require("express");
const mongoose = require("mongoose");
const app = express();
const passport = require('passport');



//body parser

app.use(express.urlencoded({extended: false}));
app.use(express.json())
//mongodb connect
const db = require("./config/keys").mongoURI;
mongoose.connect(db,{useNewUrlParser: true, useFindAndModify:false })
.then(()=>console.log("MongoDB Connected"))
.catch((err)=> console.log(err))

//routes
const posts = require("./routes/api/posts");
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");

//passport middleware
app.use(passport.initialize());
require('./config/passport')(passport);

//routes middleware
app.use("/api/users", users);
app.use("/api/posts",posts);
app.use("/api/profile",profile);
app.get('/', (req,res)=>res.send("hello there"));

const port = process.env.PORT || 3000;

app.listen(port, ()=>{
    console.log(`Server started on port ${port}`);
}) 