const express = require('express')
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require ( 'body-parser');
const cors = require('cors');
 


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1sg5c.mongodb.net/burj-al-arab?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true ,useUnifiedTopology: true });

const port = 5000
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

client.connect(err => {
  const collection = client.db("ema-jhon-store").collection("products");
  const orderCollection = client.db("ema-jhon-store").collection("orders");

  app.post('/addProduct',(req,res)=>{
      const product = req.body;
      collection.insertOne(product)
      .then(result =>{
        res.send(result)
      })
  })


  app.post('/addOrder',(req,res)=>{
    const order = req.body;
    orderCollection.insertOne(order)
    .then(result =>{
        res.send(result)
    })
})

  //load product from db
  app.get('/products',(req,res)=>{
      const search = req.query.search;
      console.log("kk",search)
      collection.find({name: {$regex: search}})
      .toArray((err,document) =>{
          res.send(document)
      })
  })

  //loadSingleproduct using params
  app.get('/product/:key',(req,res)=>{
      collection.find({key:req.params.key})
      .toArray((err,document) =>{
          res.send(document[0]);
      })
  })

  //get can not send data to server through req.body, 
  //get send data through paramroute req.params.key as dynamic route , through header
  //post can send through body 

  //get multiple datas by productsKeys
  app.post('/getProductsByKeys',(req,res)=>{
      const keys = req.body
      console.log(keys)
      collection.find({key: {$in : keys}})
      .toArray((err,document) =>{
          res.send(document)
      })
  })
});
 


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port)