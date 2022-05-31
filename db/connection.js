let { MongoClient } = require('mongodb');
let uri = 'mongodb+srv://test:pwd@homage.cecrjtt.mongodb.net/?retryWrites=true&w=majority'

let mongodb;

function connect(callback) {
    MongoClient.connect(uri, (err, db) => {
        if (err) { console.log(err) }
        else {
            console.log('MongoDB connected.')
            mongodb = db.db('test');
            callback();
        }
    });
}
function query() {
    return mongodb;
}

module.exports = {
    connect,
    query,
};