import React, { useState, useEffect } from "react";
import styled from "styled-components";
import "./App.css";
import { NavBar } from "./components/NavBar";
import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import EditIcon from "@material-ui/icons/Edit";
const data = [
  {
    id: 0,
    date: "22/04/2021",
    name: "Coffee",
    category: "eating_out",
    amount: 4.5,
    type: "expense",
  },
  {
    id: 1,
    date: "22/04/2021",
    name: "Coffee",
    category: "eating_out",
    amount: 4.5,
    type: "expense",
  },
  {
    id: 2,
    date: "22/04/2021",

    name: "April payroll",
    category: "salary",
    amount: 4500,
    type: "income",
  },
  {
    id: 3,
    date: "22/04/2021",

    name: "Coffee",
    category: "eating_out",
    amount: 4.5,
    type: "expense",
  },
  {
    id: 4,
    date: "22/04/2021",
    name: "Coffee",
    category: "eating_out",
    amount: 4.5,
    type: "expense",
  },
  {
    id: 5,
    date: "22/04/2021",
    name: "Coffee",
    category: "eating_out",
    amount: 4.5,
    type: "expense",
  },
];

const Table = styled.table`
  width: 80%;
  text-align: left;
  padding: 64px;
`;
const HeadCell = styled.td`
  padding: 16px 0;
  width: 20%;
`;

const TableCell = styled.td`
  padding: 8px 0;
  width: 20%;
`;

const Amount = styled.p`
  color: ${({ type }) => (type === "expense" ? "#FF7661" : "#00E4C6")};
`;

function App() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    //our code
    //common actions
    //fetching data from an API
    setTransactions(data);
    console.log("transactcions (state)", transactions);
  }, []);

  const handleDelete = (id) => {
    console.log("deleting row", id);
    const _transactions = [...transactions].filter(
      (transaction) => transaction.id !== id
    );
    setTransactions(_transactions);
    console.log("transactcions (state)", transactions);
  };
  return (
    <div className='layout'>
      <NavBar />
      <Table>
        <thead>
          <tr>
            <HeadCell>Date</HeadCell>
            <HeadCell>Name</HeadCell>
            <HeadCell>Category</HeadCell>
            <HeadCell>Amount</HeadCell>
            <HeadCell></HeadCell>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => {
            return (
              <tr key={transaction.id}>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>{transaction.name}</TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell>
                  <Amount type={transaction.type}>{transaction.amount}</Amount>
                </TableCell>
                <TableCell>
                  <EditIcon style={{ marginRight: "16px" }} />
                  <DeleteForeverIcon
                    style={{ color: "#FF7661" }}
                    onClick={() => handleDelete(transaction.id)}
                  />
                </TableCell>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </div>
  );
}

export default App;
