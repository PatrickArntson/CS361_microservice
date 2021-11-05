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
        res.json({
            errorMessage: 'error'
        })
        return console.log(err);
    }
    if (!findUser){
        res.json({
            errorMessage: 'Collection Not Found'
        })
        return;
    }
    if (findUser.length > 0){
        res.json({
            alreadyRegistered : true,
            newlyRegistered: false
        })
        return;
    } 
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        if(err) {
            res.json({
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
            res.json({
                alreadyRegistered : false,
                newlyRegistered: true
            })
        } catch (err){
            res.json({
                errorMessage: 'error'
            })
            return console.log(err);
        }
    }) 
    return;
});


app.post('/login', async (req, res) => {

    try {
        if (req.body.collection == 'StockUser'){
            var findUser = await patricksCollection.find({email: req.body['email']}).toArray();
        }
        else if (req.body.collection == 'Josh'){
            var findUser = await joshsCollection.find({email: req.body['email']}).toArray();
        }
        else if (req.body.collection == 'Esther'){
            var findUser = await esthersCollection.find({email: req.body['email']}).toArray();
        } else {
            res.json({
                errorMessage: 'Collection Not Found'
            })
            return console.log('Collection Not Found');
        }
    } catch (err) {
        res.json({
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
    return;
})

app.post('/reset-password', async (req, res) =>{
    bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        if(err) {
            res.json({
                errorMessage: 'error'
            })
            return console.log(err);
        }
        try {
            if (req.body.collection == 'StockUser'){
                await patricksCollection.updateOne({email: req.body.email}, { $set: {password: hashedPassword}});
            } 
            else if (req.body.collection == 'Josh'){
                await joshsCollection.updateOne({email: req.body.email}, { $set: {password: hashedPassword}});
            } 
            else if (req.body.collection == 'Esther'){
                await esthersCollection.updateOne({email: req.body.email}, { $set: {password: hashedPassword}});
            } else {
                res.json({
                    errorMessage: 'Collection Not Found'
                })
                return;
            }
            res.json({
                passwordChanged : true,
            })
        } catch (err){
            res.json({
                errorMessage: 'error'
            })
            return console.log(err);
        }
    }) 
})

app.post('/delete-user', async (req,res) => {
    try {
        if (req.body.collection == 'StockUser'){
            var findUser = await patricksCollection.find({email: req.body['email']}).toArray();
        }
        else if (req.body.collection == 'Josh'){
            var findUser = await joshsCollection.find({email: req.body['email']}).toArray();
        }
        else if (req.body.collection == 'Esther'){
            var findUser = await esthersCollection.find({email: req.body['email']}).toArray();
        } else {
            res.json({
                errorMessage: 'Collection Not Found'
            })
            return console.log('Collection Not Found');
        } 
    } catch (err) {
        res.json({
            errorMessage: 'error'
        })
        return console.log(err);
    }
    if (findUser.length == 1){
        bcrypt.compare(req.body.password, findUser[0]['password'], async function(err, result){
            if (err){
                res.json({
                    errorMessage: 'error'
                })
                return console.log(err);
            }
            if (result){
                try {
                    if (req.body.collection == 'StockUser'){
                        await patricksCollection.deleteOne({email: req.body.email});
                    }
                    else if (req.body.collection == 'Josh'){
                        await joshsCollection.deleteOne({email: req.body.email});
                    }
                    else if (req.body.collection == 'Esther'){
                        await esthersCollection.deleteOne({email: req.body.email});
                    }
                    res.json({
                        userDeleted: true,
                        incorrectPassword: false
                    })
                } catch (err){
                    res.json({
                        errorMessage: 'error'
                    })
                    return console.log('error');
                }
            } else {
                res.json({
                    userDeleted: false,
                    incorrectPassword: true
                })
            }
        });
    } else {
        res.json({
            userNotFound: true
        })
    }

})


app.listen(Port, () => console.log('Server is running'));