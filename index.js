const express = require('express');
const app = express();
const db = require('./db/connection')

app.get('/', (req, res) => {
    res.send('Hello world')
})

app.use('/users', require('./routes/users'))

db.connect(() => {
    app.listen(8080, () => console.log("Server listening"))
});