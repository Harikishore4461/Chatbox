const express = require('express')
const router = express.Router()
const uri = 'mongodb+srv://Hari:Harikishore@cluster0.bjl2j.mongodb.net/register?retryWrites=true&w=majority'
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true });

client.connect((err, dbInstance) => {
    if (err) {
        console.log(err)
    }
    else {

        console.log('connected to db')
    }
    const dbObject = dbInstance.db('register');
    const dbCollection = dbObject.collection('messages');
    router.post('/sent',(req,res)=>{
        // let name = req.params.name
        let message = req.body
        dbCollection.insertOne(message,(err,result)=>{
            if (err){
                console.log(err)
            }
            else{
                console.log('success')
            }
        })
    })
    router.get('/message',(req,res)=>{
        dbCollection.find().toArray((err, result) => {
            if (err) {
                console.log(err)
            }
            else {
                res.json(result)
            }
        })
    })
})
module.exports = router;