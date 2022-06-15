require('dotenv').config();
const express = require('express');
const app = express();

const path = require('path');
const bodyParser = require('body-parser').json();

const {getProducts, getOneProduct, getStyles, getRelated} = require('./controllers/index.js')

app.use(express.json());
app.use(bodyParser);

// routes
app.get('products/', getProducts);
app.get('products/:product_id', getOneProduct);
app.get('products/:product_id/styles', getStyles);
app.get('products/:product_id/related', getRelated);


app.listen(process.env.PORT);
console.log(`Listening at port:`, process.env.PORT)