// import packages
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

// server config
const server = express();
const PORT = 8000;
const DB_Connection = "mongodb+srv://ayush:Obo8YVj9oZ1Vdey8@cluster0.sxlof.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

// connecting database
mongoose.connect(DB_Connection, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Mongodb Database Connected!");
}).catch(err => {
    console.log(err);
});


// middleware 
server.use(express.json());


// default routing
server.get("/", (req, res) => {
    console.log("Server Started");
    res.send("Server Started");
});


// verifying jwt token
const VerifyJWT = (token, key) => {
    try {
        const res = jwt.verify(token, RMS);
        console.log("Verification Successfull!")
    } catch (err) {
        console.log("Verification Failed!");
    }
}


// generating jwt token
const GenerateJWT = (uid) => {
    const token = jwt.sign({ id: uid }, process.env.TOP_SECRET_KEY);
    return token;
}


// register new user
const registerNewUser = async (res, uid) => {
    // upload data to database
    const data = new studentModel({
        uid: uid,
        createdOn: new Date().toLocaleDateString()
    })

    try {
        // uploading the data to database 
        const response = await data.save();

        // sending response to the sender
        res.status(200).json({
            message: "Registration succesfull !",
            token: GenerateJWT(uid)
        });
    } catch (error) {
        res.status(500).json({
            message: "Registration failed !",
            token: null
        });
    }

}

// login routing
server.post("/login", async (req, res) => {
    // destructuring the incoming data 
    const { uid } = req.body;

    // database data mapping
    try {
        const data = await studentModel.find({ uid: uid });
        if (data.length != 0) {
            res.status(200).send({
                message: "Login succesfull !",
                token: GenerateJWT(uid)
            });
            return;
        }
    } catch (error) {
        // if issue found on server
        res.status(500).send({
            message: "500 Internal Server Error !",
            token: null
        });
        return;
    }

    // if user not found in database
    registerNewUser(res, uid);

});



// CRUD Routine Operation
// post routine data
server.post("/postRoutineData", (req, res) => {
    //destructuring incoming data
    const { module_name, lecturer_name, group, room_name, block_name, timing } = req.body;

    const data = new routineModel({
        module_name: module_name,
        lecturer_name: lecturer_name,
        group: group,
        room_name: room_name,
        block_name: block_name,
        timing: timing
    });

    data.save().then(() => {
        res.status(200).send("Routine Posted successfully !");
    }).catch(err => {
        res.status(500).send(err);
    });
});


// get routine data
server.get("/getRoutineData", (req, res) => {
    // getting data collection from routine db
    routineModel.find().then((data) => {
        res.status(200).send(data);
    }).catch(err => {
        res.status(500).send({
            message: "500 Internal Server Error !"
        });
    });

});

// update routine data
server.post("/updateRoutineData", (req, res) => {
    // get the routine doc id
    const { routineID, module_name } = req.body;
    routineModel.findByIdAndUpdate(routineID, {
        module_name: module_name
    }, (err, data) => {
        if (err) {
            res.status(500).send({
                message: "500 Internal Server Error !"
            });
        } else {
            res.status(200).send({
                message: "Routine Succesfully updated !!"
            });
        }
    })
});

// delete routine data
server.post("/deleteRoutineData", (req, res) => {
    // get the routine doc id
    const { routineID } = req.body;
    routineModel.remove({ _id: routineID }).then((data) => {
        res.status(200).send({
            message: "Routine Deleted Succesfully !"
        });
    }).catch(err => {
        res.status(500).send({
            message: "500 Internal Server Error !"
        });
    });
});

// port listner
server.listen(PORT, () => {
    console.log(`Server Connected to the port ${PORT}`);
});
