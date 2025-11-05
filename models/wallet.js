const mongoose = require('mongoose')

const WalletSchema = new mongoose.Schema({
  privateKey: {
    type: String,
    required: true,
  },
})

module.exports = mongoose.model('Wallet', WalletSchema);