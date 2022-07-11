const express = require('express')
const router = express.Router()
const db = require('../db/connection')
const { MongoClient } = require('mongodb')

router.get('/', async (req, res) => {
    Users = db.query().collection('users')

    let result = await Users.find({}).toArray().sort()
    console.log(result)
    res.send(result)
})

router.post("/proto", async (req, res) => {
    Orders = db.query().collection('orders')

    let result = await Orders.insertOne({name:"Scott", age:30})
    
    res.send(result)
})

router.get('/insertmany', async (req, res) => {
    function generatePerson() {
        let charset = "ACABABACIDIDIDODO"
        let name = ""
        for (let i = 0; i < 8; i++) {
            name += charset[Math.floor(Math.random() * charset.length)]
        }
        let age = Math.floor(Math.random() * 45) + 10
        let height = Math.floor(Math.random() * 50) + 150
        return {
            name, age, height
        }
    }

    let doc = []
    doc.push(generatePerson())
    doc.push(generatePerson())
    doc.push(generatePerson())

    Users = db.query().collection('users')
    await Users.insertMany(doc)
    res.send(doc)
})

router.get('/update', async (req, res) => {
    Users = db.query().collection('users')

    filter = { name: "Scott" }
    newData = { $set: { height: 180 } }
    let result = await Users.updateOne(filter, newData, { new: true })
    console.log(result)
    res.send(result)
})

router.get('/tx', async (req, res) => {
    const transactionOptions = {
        readConcern: { level: 'snapshot' },
        writeConcern: { w: 'majority' },
        maxCommitTimeMS: 1000
    };

    const client = db.mongoClient();
    const session = client.startSession();

    try {
        session.startTransaction(transactionOptions);
        Users = db.query().collection('users');
        Preferences = db.query().collection('preferences');
        //do your Tx here
        let scott = await Users.findOne({name:"Scott"}, {session})
        
        if (scott.age < 35) {
            let pref = await Preferences.findOne({name: scott.name}, {session})
            console.log(pref)
            let happy = true
            if (pref.happy){
                happy = !pref.happy
            }
            await Preferences.updateOne({name:"Scott"}, {$set:{happy:happy}}, {}, {session})
        } else {
            throw new Error('Too old')
        }

        await session.commitTransaction();
    } catch (error) {
        console.log('Encountered an error during the transaction: ' + error);
        await session.abortTransaction();
    } finally {
        await session.endSession();
        res.send('Done')
    }
})

module.exports = router