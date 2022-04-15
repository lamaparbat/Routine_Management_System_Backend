const mongoose = require('mongoose')
const RoutineSchema = new mongoose.Schema({
    module_name: String,
    lecturer_name: String,
    group: String,
    room_name: String,
    block_name: String,
    timing: String,
  },
  {timestamps: true}
  )
  module.exports = mongoose.model('Routine', RoutineSchema);