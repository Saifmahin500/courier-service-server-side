require("dotenv").config();
const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require("cors");
const app = express();

const port = process.env.PORT || 5500;

// MiddleWare
app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r2uistf.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    const userCollection = client.db("DeliveryUser").collection("users")
    const DeliveryManCollection = client.db("DeliveryUser").collection("DeliveryMan")
    const BookParcelCollection = client.db("DeliveryUser").collection("Booking")

    // user related
    app.get("/users", async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })
    app.post("/users", async (req, res) => {
      const user = req.body;
      //   console.log(user);
      const result = await userCollection.insertOne(user);
      console.log(result);
      res.send(result);
    });
    app.delete("/users/:id", async(req,res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await userCollection.deleteOne(query);
      res.send(result)
    })
    app.patch("/users/admin/:id", async(req,res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const updatedDoc = {
        $set: {
          role : "admin"
        }
      }
      const result = await userCollection.updateOne(filter,updatedDoc);
      res.send(result)
    })


    // Delivery Man Related

    app.get("/TopDeliveryMan", async (req, res) => {
      const cursor = DeliveryManCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })
    // booking parcel related
    app.get("/BookingParcel", async (req, res) => {
      const email = req.query.email;
      const query = { email: email}
      const result = await BookParcelCollection.find(query).toArray();
      res.send(result)
    })
    
    app.post("/BookingParcel", async (req, res) => {
      const booking = req.body;
      const result = await BookParcelCollection.insertOne(booking);
      console.log(result);
      res.send(result);
    })

    
    app.delete("/BookingParcel/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await BookParcelCollection.deleteOne(query);
      res.send(result)
    })


    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get("/", (req, res) => {
  res.send("delivery is running...");
});

app.listen(port, () => {
  console.log(`Simple Crud is Running on port ${port}`);
});