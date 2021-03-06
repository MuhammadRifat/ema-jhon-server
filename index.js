const express = require('express')
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser');
const cors = require('cors');


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.a7xog.mongodb.net/emaJhonStore?retryWrites=true&w=majority`;

const app = express()
app.use(bodyParser.json());
app.use(cors());

const port = 5000;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("emaJhonStore").collection("products");
  const ordersCollection = client.db("emaJhonStore").collection("orders");
  
    app.post('/addProduct', (req, res) => {
        const products = req.body;
        productCollection.insertMany(products)
        .then(result => {
            res.send(result.insertedCount > 0);
        })
    })

    app.get('/products', (req, res) => {
        productCollection.find({})
        .toArray( (err, documents) => {
            res.send(documents);
        })
    })

    app.get('/', (req, res) => {
        res.send("It's Working");
    })

    app.get('/product/:key', (req, res) => {
        productCollection.find({key: req.params.key})
        .toArray( (err, documents) => {
            res.send(documents[0]);
        })
    })

    app.post('/productByKeys', (req, res) => {
        const productKeys = req.body;
        productCollection.find({key: {$in: productKeys}})
        .toArray( (err, documents) => {
            res.send(documents);
        })
    })

    app.post('/addOrder', (req, res) => {
        const order = req.body;
        ordersCollection.insertOne(order)
        .then(result => {
            res.send(result.insertedCount > 0);
        })
    })

});

app.listen(process.env.PORT || port);