const { ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');
const config = require("../configs/database.config");

const START_DB_CONNECTION = () => {
 mongoose.connect(config.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
 }).then(() => {
  console.log('Mongodb connection succesfull !!')
 })
  .catch((err) => {
   console.log(err)
  });
}

module.exports = START_DB_CONNECTION;