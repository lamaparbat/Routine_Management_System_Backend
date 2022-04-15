require('dotenv').config()

const mongoose = require('mongoose')
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')

const GoogleAuth = require('./routes/auth.js');
const PORT = 8000;




//Database Connection

const url = `mongodb+srv://BishalDali:Bookofzeref123@cluster0.kqrke.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

mongoose.connect(
    url,
    {
        useNewUrlParser: true,

        useUnifiedTopology: true,   

        autoIndex: true, //make this also true
    },
    (err) => {
        if (err) {
            console.log('this is error', err.message);
        } else {
            console.log('DB connected');
        }
    }
);

// Middleware

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));
app.use('api/auth', GoogleAuth)






app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})