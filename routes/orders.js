const express = require('express')
const router = express.Router()
const db = require('../db/connection')

router.get('/', async (req, res) => {
    Users = db.query().collection('users')

    let result = await Users.find({}).toArray().sort()
    console.log(result)
    res.send(result)
})

router.post("/webhook", async (req, res) => {
    Orders = db.query().collection('orders')
    
    let result = await Orders.insertOne(req.body)
    
    res.send(result)
})

module.exports = router