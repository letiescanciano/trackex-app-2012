require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");

const firebase = require("./config/firebase");
console.log(firebase);
const User = require("./models/User");
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
// app.get("/transactions", (req, res) => {
//   const transactions = db.get("transactions").value();
//   console.log("transactions", transactions);
//   res.status(200).send(transactions);
// });

// app.post("/transactions", (req, res) => {
//   console.log("req.body", req.body);
//   const { name, date, amount, category, type } = req.body;

//   const newTransaction = {
//     name,
//     date,
//     amount,
//     category,
//     type,
//     created_at: new Date(),
//     updated_at: new Date(),
//   };
//   const createdTransacion = db
//     .get("transactions")
//     .insert(newTransaction)
//     .write();
//   res.status(201).json(createdTransacion);
// });

// app.put("/transactions/:id", (req, res) => {
//   const { id } = req.params;
//   console.log("req.body,", req.body);
//   const { name, date, amount, category, type } = req.body;
//   const updatedTransaction = db
//     .get("transactions")
//     .updateById(id, {
//       name,
//       date,
//       amount,
//       category,
//       type,
//       updated_at: new Date(),
//     })
//     .write();
//   if (updatedTransaction) {
//     res.status(200).json(updatedTransaction);
//   } else {
//     res.status(404).json({ message: "Resource not found" });
//   }
// });

// app.delete("/transactions/:id", (req, res) => {
//   const { id } = req.params;
//   const deletedTransaction = db.get("transactions").removeById(id).write();
//   if (deletedTransaction) {
//     res.status(200).json(deletedTransaction);
//   } else {
//     res.status(404).json({ message: "Resource not found" });
//   }
// });

app.listen(process.env.PORT || 3002, () =>
  console.log(`Server listening on port ${process.env.PORT}!`)
);
