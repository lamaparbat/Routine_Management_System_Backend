// import packages
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const res = require("express/lib/response");

// server config
const server = express();
const PORT = 8000;
const DB_Connection = "mongodb+srv://ayush:Obo8YVj9oZ1Vdey8@cluster0.sxlof.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

// connecting database
mongoose.connect(DB_Connection, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Database connected!");
}).catch(err => {
    console.log(err);
});

// data structure
const userDetails = new mongoose.Schema({
    email: String,
    createdOn: String
})

// defining a model for user
const userModel = mongoose.model('details', userDetails);

// middleware
server.use(express.json());

// default routing
server.get("/", (req, res) => {
    res.send("Server Started on default route");
})

// generate token
const GenerateToken = (email) => {
    const token = jwt.sign({ id: email }, "secret_key");
    return token;
}

//verify
// jwt.verify(token,key);

// login routing
server.post("/login", (req, res) => {
    const { email } = req.body;

    // data mapping
    userModel.find({
        email: email
    }).then((data) => {
        if (data.length != 0) {
            try {
                return res.status(200).send({
                    message: "Logged in!",
                    token: GenerateToken(email)
                });
            } catch (error) {
                console.log(error);
            }
        }
    }).catch(err => {
        return res.status(500).send({
            message: "INTERNAL SERVER ERROR 500",
            token: null
        });
    })

    // check if user is new
    registerUser(res, email)
})

// Register new user
const registerUser = (res, email) => {
    const data = new userModel({
        email: email,
        createdOn: new Date().toLocaleDateString()
    })

    // save details to MongoDB
    data.save().then(() => {
        return resizeBy.status(200).json({
            message: "Registration Successful!",
            token: GenerateToken(email)
        });
    }).catch(err => {
        return res.status(500).send({
            message: "Registration Failed!",
            token: null
        });
    });
}



// port listner
server.listen(PORT, () => {
    console.log("Server Connected");
})