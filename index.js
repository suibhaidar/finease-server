const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;


//middleware
app.use(cors());
app.use(express.json());

// 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@shaf.b7bzbcf.mongodb.net/?appName=Shaf`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

app.get('/', (req, res) => {
  res.send('finease server is running');
})


async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const db = client.db('ease-DB');
    const transactionCollection = db.collection('transactions')


    app.get('/transactions', async (req, res) => {
      const email = req.query.email;
      const query = {};
      if (email) {
        query.email = email;
      }
      const cursor = transactionCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    })

    

    app.post('/transactions', async (req, res) => {
      const data = req.body
      const email = req.body.email;
      console.log(data, email)
      const result = transactionCollection.insertOne(data)
      res.send({
        success: true
      })
    })

    app.patch('/transactions/:id', async (req, res) => {
      const id = req.params.id;
      const updateData = req.body;
      const query = { _id: new ObjectId(id) };
      const update = {
        $set: updateData,
      };

      const result = await transactionCollection.updateOne(query, update);
      res.send(result);
    });



   




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  }
  finally {

  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`my finease server is running on port: ${port}`)
})