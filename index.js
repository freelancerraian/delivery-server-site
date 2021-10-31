const express = require("express");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8gdkh.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("Delivary");
    const servicesCollection = database.collection("services");
    const usersCollection = database.collection("users");
    const checkoutCollection = database.collection("checkout");

    // get API
    app.get("/services", async (req, res) => {
      const cursor = servicesCollection.find({});
      const services = await cursor.toArray();
      res.send(services);
    });

    app.get("/users", async (req, res) => {
      const cursor = usersCollection.find({});
      const users = await cursor.toArray();
      res.send(users);
    });

    app.get("/checkout", async (req, res) => {
      const cursor = checkoutCollection.find({});
      const checkout = await cursor.toArray();
      res.send(checkout);
    });

    // get single Services
    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await servicesCollection.findOne(query);
      console.log("load service", id);
      res.json(service);
    });

    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const users = await usersCollection.findOne(query);
      console.log("load users", id);
      res.json(users);
    });

    app.get("/checkout/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const checkout = await checkoutCollection.findOne(query);
      console.log("load checkout", id);
      res.json(checkout);
    });

    // Post API
    app.post("/services", async (req, res) => {
      const service = req.body;
      console.log("hit post", service);

      const result = await servicesCollection.insertOne(service);
      console.log(result);
      res.json(result);
    });

    app.post("/users", async (req, res) => {
      const users = req.body;
      console.log("hit post", users);

      const result = await usersCollection.insertOne(users);
      console.log(result);
      res.json(result);
    });

    app.post("/checkout", async (req, res) => {
      const checkout = req.body;
      console.log("hit post", checkout);

      const result = await checkoutCollection.insertOne(checkout);
      console.log(result);
      res.json(result);
    });

    // UPDATE API
    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const updatedUser = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updatedUser.name,
          email: updatedUser.email,
        },
      };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      console.log("update user", id);
      res.json(result);
    });

    // Delete API
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await servicesCollection.deleteOne(query);
      console.log("delete Id", result);

      res.json(result);
    });

    app.delete("/checkout/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await checkoutCollection.deleteOne(query);
      console.log("delete Id", result);

      res.json(result);
    });
  } finally {
   
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Running now");
});

app.listen(port, () => {
  console.log("Running Port", port);
});