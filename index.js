require('dotenv').config();

const express = require('express');
const app = express();
const db = require('./db/connection')

app.get('/', (req, res) => {
    res.send('Hello world')
})

app.use('/users', require('./routes/users'))
app.use('/orders', require('./routes/orders'))

const PORT = process.env.PORT || 4000
db.connect(() => {
    app.listen(PORT, () => console.log(`Listening: ${PORT}`))
});