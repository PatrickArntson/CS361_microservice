const mongoose = require('mongoose');

const stockUserSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    }
}); 


module.exports = mongoose.model('StockUser', stockUserSchema);