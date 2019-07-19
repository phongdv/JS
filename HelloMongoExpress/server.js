const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const MongoClient = require("mongodb").MongoClient;
let db;
app.use(bodyParser.json());
app.post("/quotes", (req, res) => {
  console.log(req.body);
  var doc = req.body;
  db.collection("newbusiness")
    .insertOne(doc)
    .then(console.log(doc));
  console.log(doc);
  res.json(req.body);
});
const port = 9090;
MongoClient.connect(
  "mongodb://omni:omni@localhost:27017/admin",
  { useNewUrlParser: true },
  function(err, client) {
    if (err) throw err;
    db = client.db("admin");

    db.collection("newbusiness")
      .find()
      .toArray(function(err, result) {
        if (err) throw err;
        console.log(result.length);
      });
  }
);
app.listen(port, () => {
  console.log(`Express server have start at port ${port}`);
});
