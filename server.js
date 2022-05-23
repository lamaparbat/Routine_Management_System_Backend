//import packages
require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const swaggerUi = require('swagger-ui-express');
const jwt = require("./middleware/jwt.js");
const rmsLibrary = require("./rmsLibrary/index.js");
const studentModel = require("./dbModel/studentModel");
const teacherModel = require("./dbModel/teacherModel");
const routineModel = require("./dbModel/routineModel");
const notifModel = require("./dbModel/notificationModel");
const adminModel = require("./dbModel/adminModel");

const YAML = require("yamljs");
const swaggerDocs = YAML.load("./api.yaml");

// **** -> server config <- *******
const server = express();
const PORT = process.env.PORT || 8000;
const DB_Connection = "mongodb+srv://ayush:8dHWqFlZKDTR7tHK@cluster0.k10v2.mongodb.net/?retryWrites=true&w=majority"

// connecting database
mongoose.connect(DB_Connection, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Mongodb Database Connected!");
}).catch(err => {
    console.log(err);
});


//middleware 
server.use(express.json());
server.use(cookieParser());

server.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//default routing
server.get("/", (req, res) => {
    console.log("server started.....");
    res.send("Server started");
});


//login routing
server.post("/api/v4/student/Login", (req, res) => {
    // destructuring the incoming data 
    const { uid } = req.body;

    //verify the uid
    if ((uid.includes("np") && uid.includes("heraldcollege.edu.np") === false)) {
        return res.status(400).send({
            message: "Unverified users.",
            token: null
        });
    }

    // ***** database data mapping *****
    try {
        const data = studentModel.find({ uid: uid });
        if (data.length != 0) {
            return res.status(200).send({
                message: "Login succesfull !!",
                token: jwt.GenerateJWT(uid)
            });
        }
    } catch (error) {
        //if issue found on server, return message
        return res.status(500).send({
            message: "500 INTERNAL SERVER ERROR !!",
            token: null
        });
    }

    // if user not found in DB then register new user
    rmsLibrary.registerNewUser(res, uid);

});

//logout
server.post("/api/v4/Logout", async (req, res) => {
    //clear the cookies
    res.clearCookie();

    return res.status(200).send({
        message: "Logout succesfull !!"
    });
})


// ****** --> CRUD Routine Operation <-- *********
server.post("/api/v4/admin/postRoutineData", (req, res) => {
    //destructuring incoming data
    const { module_name, lecturer_name, group, room_name, block_name, timing } = req.body;

    const data = new routineModel({
        module_name: module_name,
        lecturer_name: lecturer_name,
        group: group,
        room_name: room_name,
        block_name: block_name,
        timing: timing,
        createdOn: new Date().toLocaleDateString()
    });

    data.save().then(async () => {
        //upload message to notification db
        const notifData = new notifModel({
            message: "Dear " + group + ", a new routine has recently published. Please see it once.",
            group: group,
            createdOn: new Date().toLocaleDateString()
        });

        try {
            const result = await notifData.save();
            if (result.message) {
                res.status(200).send({
                    message: "Routine posted successfully !!"
                });
            }
        } catch (error) {
            res.status(500).send(err);
        }
    }).catch(err => {
        res.status(500).send(err);
    });
});


//get routine data
server.get("/api/v4/admin/getRoutineData", jwt.VerifyJWT, (req, res) => {
    routineModel.find().then((data) => {
        res.status(200).send(data);
    }).catch(err => {
        res.status(500).send({
            message: "500 INTERNAL SERVER ERROR !!"
        });
    });

});

//update routine data
server.post("/api/v4/admin/updateRoutineData", (req, res) => {
    //get the routine doc id
    const { routineID, module_name } = req.body;
    routineModel.findByIdAndUpdate(routineID, {
        module_name: module_name
    }, (err, data) => {
        if (err) {
            res.status(500).send({
                message: "Internal Server Error !!"
            });
        } else {
            res.status(200).send({
                message: "Routine succesfully updated !!"
            });
        }
    })
});

//delete routine data
server.post("/api/v4/admin/deleteRoutineData", (req, res) => {
    //get the routine doc id
    const { routineID } = req.body;
    routineModel.remove({ _id: routineID }).then((data) => {
        res.status(200).send({
            message: "Routine succesfully deleted !!"
        });
    }).catch(err => {
        res.status(500).send({
            message: "500 INTERNAL SERVER ERROR !!"
        });
    });
});


// *********** ->  admin   <- **************
// Admin Login
server.post("/api/v4/admin/Login", (req, res) => {
    const { email, password } = req.body;

    //database mapping
    adminModel.find({ email: email, password: password }).then(data => {
        if (data.length > 0) {
            res.status(200).send({
                message: "Login succesfully.",
                token: jwt.GenerateJWT(email)
            });

        } else {
            res.status(412).send("Wrong email or password !!");
        }
    });
});

//register new user
server.post("/api/v4/admin/Signup", (req, res) => {
    const { email, password } = req.body;

    //search if user already exists ?
    adminModel.find({ email: email }).then(data => {
        if (data.length === 0) {
            //insert new admin data
            const data = new adminModel({
                email: email,
                password: password,
                createdOn: new Date().toDateString()
            });

            //final upload to db
            data.save().then(() => {
                res.status(201).send("Admin created succesfully !!");
            }).catch(err => {
                res.status(500).send("500. SERVER ERROR!!");
            })
        } else {
            res.status(412).send("User already exists !!");
        }
    }).catch(err => {
        console.log("500 SERVER ERROR !!");
    })


});


// *********** ->  Student   <- **************
// Student Login
server.post("/api/v4/student/Login", (req, res) => {
    const { email, password } = req.body;

    //database mapping
    studentModel.find({ email: email, password: password }).then(data => {
        if (data.length > 0) {
            res.status(200).send({
                message: "Login succesfully.",
                token: jwt.GenerateJWT(email)
            });

        } else {
            res.status(412).send("Wrong email or password !!");
        }
    });

});

//register new Student 
server.post("/api/v4/student/Signup", (req, res) => {
    //search if user already exists ?
    studentModel.find({ email: email }).then(data => {
        if (data.length === 0) {
            //insert new admin data
            const data = new adminModel({
                email: email,
                password: password,
                createdOn: new Date().toDateString()
            });

            //final upload to db
            data.save().then(() => {
                res.status(201).send("Student created succesfully !!");
            }).catch(err => {
                res.status(500).send("500. SERVER ERROR!!");
            })
        } else {
            res.status(412).send("User already exists !!");
        }
    }).catch(err => {
        console.log("500 SERVER ERROR !!");
    })

});


// *********** ->  Teachers   <- **************
// Teacher Login
server.post("/api/v4/teacher/Login", (req, res) => {
    const { email, password } = req.body;

    //database mapping
    teacherModel.find({ email: email, password: password }).then(data => {
        if (data.length > 0) {
            res.status(200).send({
                message: "Login succesfully.",
                token: jwt.GenerateJWT(email)
            });

        } else {
            res.status(412).send("Wrong email or password !!");
        }
    });

});

//register new Teacher 

server.post("/api/v4/teacher/Signup", (req, res) => {
    //search if user already exists ?
    teacherModel.find({ email: email }).then(data => {
        if (data.length === 0) {
            //insert new admin data
            const data = new adminModel({
                email: email,
                password: password,
                createdOn: new Date().toDateString()
            });

            //final upload to db
            data.save().then(() => {
                res.status(201).send("Teachers created succesfully !!");
            }).catch(err => {
                res.status(500).send("500. SERVER ERROR!!");
            })
        } else {
            res.status(412).send("User already exists !!");
        }
    }).catch(err => {
        console.log("500 SERVER ERROR !!");
    })
});


// ***** port listneer *****
server.listen(PORT, () => {
    console.log(`Listening to the port ${PORT}`);
});
