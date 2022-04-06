require('dotenv').config()

const mongoose = require('mongoose')
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser')
const SignUpSchema = require('./models/signupModel');
// Google Auth
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = '796501784500-d5ifk7n7b0qnt710dgcf6i9rlcq1gnph.apps.googleusercontent.com'
const client = new OAuth2Client(CLIENT_ID);


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

app.set('view engine', 'ejs');
app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'));

app.get('/', (req, res)=>{
    res.render('index')
})

app.get('/login', (req,res)=>{
    res.render('login');
})

app.post('/login', (req,res)=>{
    let token = req.body.token;

    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        });
        const payload = ticket.getPayload();
        const userid = payload['picture']
            
            
            const signUp = new SignUpSchema({
                userName : payload['name'],
                userEmail :  payload['email'],
                userPicture :  payload['picture']
            })
            const registered = await signUp.save()
            console.log(userid);

      }
      verify()
      .then(()=>{
          res.cookie('session-token', token);
          res.send('success')
      })
      .catch(console.error);
      

})




function checkAuthenticated(req, res, next){

    let token = req.cookies['session-token'];

    let user = {};
    async function verify() {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        });
        const payload = ticket.getPayload();
        user.name = payload.name;
        user.email = payload.email;
        user.picture = payload.picture;
      }
      verify()
      .then(()=>{
          req.user = user;
          next();
      })
      .catch(err=>{
          res.redirect('/login')
      })

}


app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})