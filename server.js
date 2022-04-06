const express = require("express");
const mongoose = require("mongoose");
// const jwt = require("jsonwebtoken");

const server = express();

const PORT = 8000;

server.get("/",(req,res)=>{
    res.send("Server Started on default route");
})

server.get("/login",(req,res)=>{
    res.send("Getting from login");
})

server.listen(PORT,()=>{
    console.log("Server Connected");
})