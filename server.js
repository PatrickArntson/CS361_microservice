const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const bcrypt = require('bcrypt');
const Port = process.env.port || 4004;
require('dotenv').config(); 
app.use(express.urlencoded({ extended: true}));
app.use(express.json());


// Set up and connect to db
const uri = process.env.DATABASE_URL;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('database is sucessfuly connected')
});
// Database Collections
const patricksCollection = client.db("cs361_databases").collection("stockusers");
const joshsCollection = client.db("cs361_databases").collection("Josh");
const esthersCollection = client.db("cs361_databases").collection("Esther");



app.post('/register', async (req, res) => {
    try {
        // connect to the specified collection
        if (req.body.collection == 'StockUser'){
            var findUser = await patricksCollection.find({email: req.body['email']}).toArray();
        } 
        else if (req.body.collection == 'Josh'){
            var findUser = await joshsCollection.find({email: req.body['email']}).toArray();
        } 
        else if (req.body.collection == 'Esther'){
            var findUser = await esthersCollection.find({email: req.body['email']}).toArray();
        } 
    }   catch (err){
        res.send({
            errorMessage: 'error'
        })
        return console.log(err);
    }
    if (!findUser){
        res.send({
            errorMessage: 'Collection Not Found'
        })
        return;
    }
    if (findUser.length > 0){
        res.send({
            alreadyRegistered : true,
            newlyRegistered: false
        })
        return;
    } 
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        if(err) {
            res.send({
                errorMessage: 'error'
            })
            return console.log(err);
        }
        try {
            if (req.body.collection == 'StockUser'){
                await patricksCollection.insertOne({email: req.body['email'], password: hashedPassword})
            } 
            else if (req.body.collection == 'Josh'){
                await joshsCollection.insertOne({email: req.body['email'], password: hashedPassword})
            } 
            else if (req.body.collection == 'Esther'){
                await esthersCollection.insertOne({email: req.body['email'], password: hashedPassword})
            } 
            res.send({
                alreadyRegistered : false,
                newlyRegistered: true
            })
        } catch (err){
            res.send({
                errorMessage: 'error'
            })
            return console.log(err);
        }
    }) 
    return;
    // }
    return;
});


app.post('/login', async (req, res) => {
    if (req.body.collection == 'StockUser'){
        try {
            var findUser = await patricksCollection.find({email: req.body['email']}).toArray();
        } catch (err) {
            res.send({
                errorMessage: 'error'
            })
            return console.log(err);
        }
        if (findUser.length == 1){
            bcrypt.compare(req.body.password, findUser[0]['password'], function(err, result){
                if (err){
                    res.json({
                        errorMessage: 'error'
                    })
                    return console.log(err);
                }
                if (result){
                    res.json({
                        userNotFound: false,
                        successfulLogin: true
                    })
                } else {
                    res.json({
                        userNotFound: false,
                        successfulLogin: false
                    })
                }
            });
        } else {
            res.json({
                userNotFound: true,
                successfulLogin: false
            })
        }
    }
    else if (req.body.collection == 'Josh'){
        try {
            var findUser = await joshsCollection.find({email: req.body['email']}).toArray();
        } catch (err) {
            res.send({
                errorMessage: 'error'
            })
            return console.log(err);
        }
        if (findUser.length == 1){
            bcrypt.compare(req.body.password, findUser[0]['password'], function(err, result){
                if (err){
                    res.json({
                        errorMessage: 'error'
                    })
                    return console.log(err);
                }
                if (result){
                    res.json({
                        userNotFound: false,
                        successfulLogin: true
                    })
                } else {
                    res.json({
                        userNotFound: false,
                        successfulLogin: false
                    })
                }
            });
        } else {
            res.json({
                userNotFound: true,
                successfulLogin: false
            })
        }
    }
    else if (req.body.collection == 'Esther'){
        try {
            var findUser = await esthersCollection.find({email: req.body['email']}).toArray();
        } catch (err) {
            res.send({
                errorMessage: 'error'
            })
            return console.log(err);
        }
        if (findUser.length == 1){
            bcrypt.compare(req.body.password, findUser[0]['password'], function(err, result){
                if (err){
                    res.json({
                        errorMessage: 'error'
                    })
                    return console.log(err);
                }
                if (result){
                    res.json({
                        userNotFound: false,
                        successfulLogin: true
                    })
                } else {
                    res.json({
                        userNotFound: false,
                        successfulLogin: false
                    })
                }
            });
        } else {
            res.json({
                userNotFound: true,
                successfulLogin: false
            })
        }
    }
    else {
        res.send({
            errorMessage: 'Collection Not Found'
        })
    }
    return;
})




app.listen(Port, () => console.log('Server is running'));