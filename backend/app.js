const express = require("express");
const app = express();
const low = require("lowdb");
const cors = require("cors");
const lodashId = require("lodash-id");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("db.json");
const db = low(adapter);
const jwt = require("jsonwebtoken");

db._.mixin(lodashId);
db.defaults({ transactions: [] }).write();

const corsOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));

app.use(express.json()); // for parsing application/json
app.get("/transactions", (req, res) => {
  const transactions = db.get("transactions").value();
  console.log("transactions", transactions);
  res.status(200).send(transactions);
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
  const createdTransacion = db
    .get("transactions")
    .insert(newTransaction)
    .write();
  res.status(201).json(createdTransacion);
});

app.put("/transactions/:id", (req, res) => {
  const { id } = req.params;
  console.log("req.body,", req.body);
  const { name, date, amount, category, type } = req.body;
  const updatedTransaction = db
    .get("transactions")
    .updateById(id, {
      name,
      date,
      amount,
      category,
      type,
      updated_at: new Date(),
    })
    .write();
  if (updatedTransaction) {
    res.status(200).json(updatedTransaction);
  } else {
    res.status(404).json({ message: "Resource not found" });
  }
});

app.delete("/transactions/:id", (req, res) => {
  const { id } = req.params;
  const deletedTransaction = db.get("transactions").removeById(id).write();
  if (deletedTransaction) {
    res.status(200).json(deletedTransaction);
  } else {
    res.status(404).json({ message: "Resource not found" });
  }
});

const allUsers = [
  {
    username: "leti",
    password: "leti1",
  },
  {
    username: "eli",
    password: "eli1",
  },
  {
    username: "xani",
    password: "xani1",
  },
];

const accessTokenSecret = "trackexaccesstoken";
const refreshTokenSecret = "trackexrefreshtoken";

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = allUsers.find(
    (user) => user.username === username && user.password === password
  );
  if (user) {
    //generate access token
    const accessToken = jwt.sign({ username: username }, accessTokenSecret, {
      expiresIn: "30m",
    });
    const refreshToken = jwt.sign({ username: username }, refreshTokenSecret);
    console.log("accessToken", accessToken);
    console.log("refreshToken", refreshToken);
    res.status(200).json({ accessToken, refreshToken });
  } else {
    res.status(401).json("User not found");
  }
});
app.listen(3001, () => console.log("Server listening on port 3001!"));
