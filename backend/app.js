require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

const decodeToken = require("./middlewares/auth");
const firebase = require("./config/firebase");
const User = require("./models/User");
const Transaction = require("./models/Transaction");
const corsOptions = {
  origin: "http://localhost:3000",
};

app.use(cors(corsOptions));

app.use(express.json()); // for parsing application/json

mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((x) => {
    console.log(`Connected to Mongo! Database name: ${x.connections[0].name}`);
  })
  .catch((err) => console.log(err));

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  console.log("email", email);
  console.log("password", password);
  try {
    // Create user in Firebase
    const firebaseUser = await firebase.app
      .auth()
      .createUserWithEmailAndPassword(email, password);
    console.log("firebaseUser", firebaseUser);
    // Create user in our DB (and include firebaseId)
    const dbUser = await User.create({
      email: email,
      firebaseId: firebaseUser.user.uid,
    });
    console.log("dbUser", dbUser);

    if (dbUser) {
      res.status(200).json(firebaseUser);
    } else {
      res.status(404).json({ message: "Bad request" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json(e.message);
  }
  // Return created user
});

app.use(decodeToken);
app.get("/transactions", async (req, res) => {
  try {
    const user = await User.findOne({ firebaseId: req.user.uid });
    const transactions = await Transaction.find({ userId: user._id });

    res.status(200).json(transactions);
  } catch (err) {
    console.log(err);
  }
});

app.post("/transactions", async (req, res) => {
  console.log("req.body", req.body);
  const { name, date, amount, category, type } = req.body;
  const user = await User.findOne({ firebaseId: req.user.uid });

  const newTransaction = {
    name,
    date,
    amount,
    category,
    type,
    userId: user._id,
  };
  try {
    const createdTransaction = await Transaction.create(newTransaction);
    console.log(createdTransaction);
    if (createdTransaction) {
      res.status(201).json(createdTransaction);
    }
  } catch (err) {
    console.log(err);
  }
});

app.put("/transactions/:id", async (req, res) => {
  const { id } = req.params;
  console.log("req.body,", req.body);
  try {
    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      {
        ...req.body,
      },
      { new: true }
    );
    if (updatedTransaction) {
      res.status(200).json(updatedTransaction);
    } else {
      res.status(404).json({ message: "Resource not found" });
    }
  } catch (err) {
    console.log(err);
  }
});

app.delete("/transactions/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedTransaction = await Transaction.findByIdAndDelete(id);
    if (deletedTransaction) {
      res.status(200).json(deletedTransaction);
    } else {
      res.status(404).json({ message: "Resource not found" });
    }
  } catch (e) {
    console.log(err);
  }
});

app.listen(process.env.PORT || 3002, () =>
  console.log(`Server listening on port ${process.env.PORT}!`)
);
