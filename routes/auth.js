const express = require('express');
const router = express.Router();
const SignUpSchema = require('../models/signupModel');
// Google Auth
const {OAuth2Client} = require('google-auth-library');
const CLIENT_ID = '796501784500-d5ifk7n7b0qnt710dgcf6i9rlcq1gnph.apps.googleusercontent.com'
const client = new OAuth2Client(CLIENT_ID);


router.post('/login', (req,res)=>{
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

module.exports = router;