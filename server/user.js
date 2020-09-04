const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const uri = 'mongodb+srv://Hari:Harikishore@cluster0.bjl2j.mongodb.net/register?retryWrites=true&w=majority'
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(uri, { useUnifiedTopology: true , useNewUrlParser: true });

client.connect((err,dbInstance)=>{
    if(err){
        console.log(err)
    }
    else{
     
        console.log('connected to db')
    }
    const dbObject = dbInstance.db('register');
    const dbCollection = dbObject.collection('usersdata');
    function tokenVerification(req,res,next){
        if (!req.headers.authorization){
            return res.status(401).json("not authenticated")
        } 
        let token = req.headers.authorization.split(' ')[1]
        if (token == null){
            return res.status(401).send("Not Token Authenticated")
        }
        let payload = jwt.verify(token,'123')
        if(!payload){
            return res.status(401).send("Not Payload Authenticated")
        }
        req._id = payload.subject
        next()
    }
    router.post("/register", (request, response) => {
        const item = request.body;
        dbCollection.findOne({ email: item.email }, (error, result) => {
            if (error) throw error;
            else {

                if (result) {
                    return response.status(401).json({error:'This mail is already exist'})
                }
                else{
                    dbCollection.insertOne(item, (error, _result) => { // callback of insertOne
                        if (error) throw error;
                        let para = { subject: _result._id }
                        let token = jwt.sign(para, '123')
                        response.json({ token })
                    })

                }
            }
        })
    });

    router.post("/login", (request, response) => {
        const itemId = request.body
        console.log(itemId)
        dbCollection.findOne({ email: itemId.email }, (error, result) => {
            if (error) throw error;
            else{
                console.log(result)
                if (!result){
                    return response.status(401).json({error:"invalid mail"})
                }
                else 
                if(itemId.password !== result.password){
                    return response.status(401).json({ error: "invalid passowrd" })
                }
            }
            let user = result.username
            let para = { subject: result._id }
            let token = jwt.sign(para, '123')
            response.json({ user:user,token:token })
        });
    });

});




module.exports = router