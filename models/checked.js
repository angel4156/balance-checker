const mongoose = require('mongoose')

const CheckedSchema = new mongoose.Schema({
  privateKey: {
    type: String,
    required: true,
  },
})

module.exports = mongoose.model('Checked', CheckedSchema);