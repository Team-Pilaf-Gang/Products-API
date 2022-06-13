require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();

const bodyParser = require('body-parser').json();

app.use(express.json());
app.use(bodyParser);

app.get('/', (req, res) = {
    // res.sendFile(path.join(__dirname, 'index.html'))
})

app.listen(process.env.PORT);
console.log(`Listening at port:`, process.env.PORT)