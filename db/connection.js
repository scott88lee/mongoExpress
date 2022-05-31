let { MongoClient } = require('mongodb');
let uri = 'mongodb+srv://test:pwd@homage.cecrjtt.mongodb.net/?retryWrites=true&w=majority'

let mongodb;
let client;

function connect(callback) {
    MongoClient.connect(uri, (err, db) => {
        if (err) { console.log(err) }
        else {
            console.log('MongoDB connected.')
            client = db;
            mongodb = db.db('test');
            callback();
        }
    });
}

function query() {
    return mongodb;
}

function mongoClient() {
    return client;
}

module.exports = {
    connect,
    query,
    mongoClient
};