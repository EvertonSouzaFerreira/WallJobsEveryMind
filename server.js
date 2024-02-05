const express = require("express");
const bodyParser = require("body-parser");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
const port = 3000;
const mongoUrl =
  "mongodb+srv://everton:82CRjMgQbqE4RhFx@cluster0.h5v7cj1.mongodb.net/?retryWrites=true&w=majority";
const dbName = "produtos";

app.use(express.static("public"));
app.use(bodyParser.json());

MongoClient.connect(mongoUrl, (err, client) => {
  if (err) {
    console.error("Error connecting to MongoDB:", err);
    return;
  }

  console.log("Connected to MongoDB");

  const db = client.db(dbName);
  const produtosCollection = db.collection("produtos");

  app.get("/products", async (req, res) => {
    const produtos = await produtosCollection.find().toArray();
    res.json({ products: produtos });
  });

  app.post("/products", async (req, res) => {
    const { nome, codigo, descricao, preco } = req.body;
    const result = await produtosCollection.insertOne({
      nome,
      codigo,
      descricao,
      preco,
    });
    console.log(`Product added with ID: ${result.insertedId}`);
    res.json({ id: result.insertedId });
  });

  app.put("/products/:id", async (req, res) => {
    const { nome, codigo, descricao, preco } = req.body;
    const id = new ObjectId(req.params.id);
    const result = await produtosCollection.updateOne(
      { _id: id },
      { $set: { nome, codigo, descricao, preco } }
    );
    console.log(`Product updated with ID: ${id}`);
    res.json({ changes: result.modifiedCount });
  });

  app.delete("/products/:id", async (req, res) => {
    const id = new ObjectId(req.params.id);
    const result = await produtosCollection.deleteOne({ _id: id });
    console.log(`Product deleted with ID: ${id}`);
    res.json({ changes: result.deletedCount });
  });

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
});
