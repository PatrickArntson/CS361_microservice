const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Port = process.env.port || 4004;
require('dotenv').config();
const StockUser = require('./stockUser'); 
app.use(express.json());

// database config
const uri = process.env.DATABASE_URL;
const connectDB = async()=>{
    await mongoose.connect(uri);
    console.log('database is succesfully connected');
}
connectDB();



// app.get('/register', async (req, res) => {
//     try{
//         const users = await User.find();
//         res.status(200).send({
//             message: 'it worked',
//             users
//         })
//     } catch(err) {  
//         res.status(500).send({
//             message: 'error'
//         })
//     }
// })


app.post('/register', async (req, res) => {
    // console.log(req.body);
    if (req.body.collection == 'StockUser'){
        // 'find' statement to see if user is already registered.
        try {
            var findUser = await StockUser.find({ 'email' : req.body.email}).exec();
        }   catch (err){
            return 'error occured';
        }
        if (findUser.length > 0){
            res.send({
                Already_registered : true,
                newly_registered: false
            })
            return;
        } 
        bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
            if(err) {
                res.send({
                    message: 'error'
                })
            }
            let user = new StockUser ({
                email: req.body.email,
                password: hashedPassword
            }) 
            await user.save()
            .then(user => {
                res.send({
                    Already_registered : false,
                    newly_registered: true
                }) 
            })
            .catch(error => {
                res.send({
                    message: 'error'
                })
            })
        }) 
        return;
    }
    return;
});


app.post('/login', async (req, res) => {
    if (req.body.collection == 'StockUser'){
        try {
            var findUser = await StockUser.find({ 'email' : req.body.email}).exec();
        } catch (err) {
            res.send({
                message: 'error'
            })
        }
        if (findUser.length == 1){
            bcrypt.compare(req.body.password, findUser[0].password, function(err, result){
                if (err){
                    res.send({
                        message: 'error'
                    })
                }
                if (result){
                    res.send({
                        Successful_login: true
                    })
                } else {
                    res.send({
                        Successful_login: false
                    })
                }
            });
        } else {
            res.send({
                User_not_found: true
            })
        }
    }
    return;
})




app.listen(Port, () => console.log('Server is running'));