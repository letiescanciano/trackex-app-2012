import React, { useState, useEffect } from "react";

import styled from "styled-components";

import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import EditIcon from "@material-ui/icons/Edit";
import Button from "@material-ui/core/Button";

import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import SearchIcon from "@material-ui/icons/Search";

import data from "./data.js";

import { TransactionDrawer } from "../../Drawer";
const Table = styled.table`
  width: 100%;
  text-align: left;
  padding: 16px 0;
`;
const HeadCell = styled.td`
  padding: 16px 0;
  width: 20%;
`;

const TableCell = styled.td`
  padding: 8px 0;
  width: 23%;
  &(:last-of-type) {
    display: flex;
    justify-content: flex-end;
    width: 8%;
  }
`;

const Amount = styled.p`
  color: ${({ type }) => (type === "expense" ? "#FF7661" : "#00E4C6")};
`;

const Container = styled.div`
  width: 100%;
  padding: 64px;
`;

const ActionsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const AVAILABLE_MODES = {
  add: "add",
  edit: "edit",
  read: "read",
};

const TransactionsList = () => {
  const [transactions, setTransactions] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedTransaction, setSelectedTransaction] = useState({});
  const [search, setSearch] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setTransactions(data);
    }, 2000);
  }, []);

  useEffect(() => {
    setFilteredTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    console.log("useEffect search", search);
    filterByName(search);
  }, [search]);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  const handleDelete = (id) => {
    const _transactions = [...transactions].filter(
      (transaction) => transaction.id !== id
    );
    setTransactions(_transactions);
  };

  const handleEdit = (id) => {
    //in here we'll edit the selected transaction
    console.log("edit id", id);
    // 1. set mode to Edit
    setMode("edit");
    // 2. I need to find the selected transaction in my transactions array
    const foundTransaction = transactions.find((transaction) => {
      return transaction.id === id;
    });
    // 3. I need to setSelectedTransaction to the one I found (save it in my state)
    setSelectedTransaction(foundTransaction);
    // 4. open the drawer and fill out the form with the transaction data
    setOpenDrawer(true);
  };
  const addTransactionToList = (data) => {
    console.log("Data", data);
    setTransactions([...transactions, { ...data }]);
  };

  const editTransaction = (data) => {
    // console.log("data", data);
    // 1. Find the transaction index to edit in the array
    const transactionIndex = transactions.findIndex(
      (transaction) => transaction.id === data.id
    );
    // 2. Make a copy of our transactions state
    const _transactions = [...transactions];
    // 3. Replace the transaction that we need to edit
    _transactions[transactionIndex] = data;

    // console.log("_transactions", _transactions);
    // 4. Update our transactions (state) array
    setTransactions(_transactions);
  };

  const filterByName = (search) => {
    console.log("filterByName search", search);

    const _filteredTransactions = transactions.filter((transaction) => {
      return transaction.name.toLowerCase().includes(search.toLowerCase());
    });

    setFilteredTransactions(_filteredTransactions);
  };

  return (
    <Container>
      <ActionsWrapper>
        <FormControl style={{ width: "75%" }}>
          <Input
            id='search'
            value={search}
            startAdornment={
              <InputAdornment position='start'>
                <SearchIcon />
              </InputAdornment>
            }
            onChange={(event) => {
              console.log(event.target.value);
              setSearch(event.target.value);
            }}
          />
        </FormControl>
        <Button
          variant='contained'
          color='primary'
          onClick={() => setOpenDrawer(true)}
        >
          + Add Transaction
        </Button>
      </ActionsWrapper>
      {transactions.length > 0 ? (
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
            {filteredTransactions.map(
              ({ id, date, name, category, type, amount }) => {
                return (
                  <tr key={id}>
                    <TableCell>{date}</TableCell>
                    <TableCell>{name}</TableCell>
                    <TableCell>{category}</TableCell>
                    <TableCell>
                      <Amount type={type}>{formatter.format(amount)}</Amount>
                    </TableCell>
                    <TableCell>
                      <EditIcon
                        style={{ marginRight: "16px" }}
                        onClick={() => {
                          handleEdit(id);
                        }}
                      />
                      <DeleteForeverIcon
                        style={{ color: "#FF7661" }}
                        onClick={() => handleDelete(id)}
                      />
                    </TableCell>
                  </tr>
                );
              }
            )}
          </tbody>
        </Table>
      ) : (
        "Loading...."
      )}

      {openDrawer && (
        <TransactionDrawer
          mode={mode}
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
          transaction={selectedTransaction}
          addTransaction={addTransactionToList}
          editTransaction={editTransaction}
        />
      )}
    </Container>
  );
};

export { TransactionsList };
