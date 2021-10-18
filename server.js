const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Port = process.env.port || 4004;
require('dotenv').config();
const StockUser = require('./stockUser'); 
app.use(express.json())

// database config
const uri = process.env.DATABASE_URL;
const connectDB = async()=>{
    await mongoose.connect(uri);
    console.log('database is succesfully connected');
}
connectDB();



app.get('/register', async (req, res) => {
    try{
        const users = await User.find();
        res.status(200).send({
            message: 'it worked',
            users
        })
    } catch(err) {  
        res.status(500).send({
            message: 'error'
        })
    }
})


app.post('/register', async (req, res) => {
    // console.log(req.body);
    if (req.body.collection == 'StockUser'){
        // add 'find' statement to see if user is already registered.
        bcrypt.hash(req.body.password, 10, function(err, hashedPassword){
            if(err) {
                console.log("got here")
                res.send({
                    error: err
                })
            }
            let user = new StockUser ({
                email: req.body.email,
                password: hashedPassword
            }) 
            user.save()
            .then(user => {
                res.json({
                    Registered: true
                })
            })
            .catch(error => {
                res.json({
                    message: 'error'
                })
            })
        }) 
    }
});





app.listen(Port, () => console.log('Server is running'));