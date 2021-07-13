const express = require("express");
const app = express();
const low = require("lowdb");
const lodashId = require("lodash-id");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("db.json");
const db = low(adapter);

db._.mixin(lodashId);
db.defaults({ transactions: [] }).write();

app.use(express.json()); // for parsing application/json
app.get("/transactions", (req, res) => {
  const transactions = db.get("transactions").value();
  //console.log("transactions", transactions);
  res.status(200).send("<h1>hola</h1>");
});

app.post("/transactions", (req, res) => {
  console.log("req.body", req.body);
  const { name, date, amount, category, type } = req.body;

  const newTransaction = {
    name,
    date,
    amount,
    category,
    type,
    created_at: new Date(),
    updated_at: new Date(),
  };
  db.get("transactions").insert(newTransaction).write();
  res.status(201).json(db.get("transactions").value());
});

app.listen(3001, () => console.log("Server listening on port 3001!"));
