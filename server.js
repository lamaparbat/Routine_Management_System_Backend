// import packages
const express = require("express");
const mongoose = require("mongoose");
// const jwt = require("jsonwebtoken");

// server config
const server = express();
const PORT = 8000;
const DB_Connection = "mongodb+srv://ayush:Obo8YVj9oZ1Vdey8@cluster0.sxlof.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
// connecting database
mongoose.connect(DB_Connection,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("Database connected!");
}).catch(err => {
    console.log(err);
});

// default routing
server.get("/",(req,res)=>{
    res.send("Server Started on default route");
})

// login routing
server.get("/login",(req,res)=>{
    res.send("Getting from login");
})

// port listner
server.listen(PORT,()=>{
    console.log("Server Connected");
})