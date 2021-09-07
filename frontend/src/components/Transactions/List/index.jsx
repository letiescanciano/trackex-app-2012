import React, { useState, useEffect } from "react";
import styled from "styled-components";

import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import EditIcon from "@material-ui/icons/Edit";
import Button from "@material-ui/core/Button";

import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import FormControl from "@material-ui/core/FormControl";
import SearchIcon from "@material-ui/icons/Search";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";

import { transactionsAPI } from "../../../services/transactions";

import { TransactionDrawer } from "../../Drawer";

import { TrackexContext } from "../../../contexts/trackexContext";
const Table = styled.table`
  width: 80%;
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

const Main = styled.div`
  width: 100%;
  display: flex;
  padding-top: 32px;
`;
const FiltersContainer = styled.div`
  width: 20%;
`;

// const TRANSACTIONS_LIST_QUERY = gql`
//   query {
//     transactions {
//       id
//       name
//       amount
//       date
//       category {
//         id
//         label
//         value
//       }
//       type {
//         id
//         label
//         value
//       }
//     }
//   }
// `;
const TransactionsList = () => {
  // const { loading, error, data } = useQuery(TRANSACTIONS_LIST_QUERY);
  // console.log("data", data);
  // console.log("loading", loading);
  // console.log("error", error);

  const [transactions, setTransactions] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [mode, setMode] = useState("add");
  const [selectedTransaction, setSelectedTransaction] = useState({});
  const [search, setSearch] = useState("");
  const [filteredTransactions, setFilteredTransactions] = useState([]);

  const ctx = React.useContext(TrackexContext);
  const [categories, setCategories] = useState(
    Object.keys(ctx.categories).reduce((acc, category) => {
      acc[category] = { label: ctx.categories[category], checked: false };
      return acc;
    }, {})
  );

  // {
  //   eating_out: { label: 'label1', checked: true},
  //   clothes: { label: 'label1', checked: true},
  // }
  const [types, setTypes] = useState(
    Object.keys(ctx.types).reduce((acc, type) => {
      acc[type] = { label: ctx.types[type], checked: false };
      return acc;
    }, {})
  );

  useEffect(() => {
    const getTransactions = async () => {
      try {
        const { data, status } = await transactionsAPI.all();
        if (status === 200) {
          setTransactions(data);
        }
      } catch (e) {
        console.log("err in read all", e);
      }
    };
    getTransactions();
  }, []);

  useEffect(() => {
    setFilteredTransactions(transactions);
  }, [transactions]);

  useEffect(() => {
    filterByName(search);
  }, [search]);

  useEffect(() => {
    filterByCategory();
  }, [categories]);

  useEffect(() => {
    filterByType();
  }, [types]);
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  const handleDelete = async (id) => {
    try {
      const { data, status } = await transactionsAPI.delete(id);
      console.log("data", data);
      console.log("status", status);
      if (status === 200) {
        const _transactions = [...transactions].filter(
          (transaction) => transaction._id !== id
        );
        setTransactions(_transactions);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleEdit = (id) => {
    //in here we'll edit the selected transaction
    console.log("edit id", id);
    // 1. set mode to Edit
    setMode("edit");
    // 2. I need to find the selected transaction in my transactions array
    const foundTransaction = transactions.find((transaction) => {
      return transaction._id === id;
    });
    // 3. I need to setSelectedTransaction to the one I found (save it in my state)
    setSelectedTransaction({
      ...foundTransaction,
      type: foundTransaction.type,
      category: foundTransaction.category,
    });
    // 4. open the drawer and fill out the form with the transaction data
    setOpenDrawer(true);
  };
  const addTransactionToList = async (transaction) => {
    const newTransaction = {
      ...transaction,
      category: ctx.categories.find(
        (cat) => cat.value === transaction.category
      ),
      type: ctx.types.find((cat) => cat.value === transaction.type),
    };
    console.log(newTransaction);

    try {
      const { data, status } = await transactionsAPI.create(newTransaction);
      // console.log("status", status);
      console.log("data", data);
      if (status === 201) {
        setTransactions([...transactions, { ...data }]);
      }
    } catch (err) {
      console.log("err in addTransaction", err);
    }
  };

  const editTransaction = async (transaction) => {
    console.log("transaction", transaction);

    try {
      const { data, status } = await transactionsAPI.update(transaction);
      console.log("data", data);
      console.log("status", status);
      if (status === 200) {
        // 1. Find the transaction index to edit in the array
        const transactionIndex = transactions.findIndex(
          (tr) => tr.id === transaction.id
        );
        // 2. Make a copy of our transactions state
        const _transactions = [...transactions];
        // 3. Replace the transaction that we need to edit
        _transactions[transactionIndex] = data;

        // console.log("_transactions", _transactions);
        // 4. Update our transactions (state) array
        setTransactions(_transactions);
      }
    } catch (e) {
      console.log("e", e);
    }
  };

  const filterByName = (search) => {
    const _filteredTransactions = transactions.filter((transaction) => {
      return transaction.name.toLowerCase().includes(search.toLowerCase());
    });

    setFilteredTransactions(_filteredTransactions);
  };

  const filterByCategory = () => {
    // we filter in our categories state object

    // const checked = Object.keys(categories).filter(category=>{
    //   return categories[category].checked === true
    // })
    const checked = Object.keys(categories).filter(
      (category) => categories[category].checked
    );

    // if no checkbox is selected --> original array
    // if some checkbox is checked --> filter

    if (checked.length === 0) {
      // console.log("go back to original array");
      setFilteredTransactions(transactions);
    } else {
      const _filteredTransactions = transactions.filter((transaction) => {
        return categories[transaction.category].checked === true;
      });
      setFilteredTransactions(_filteredTransactions);
      // console.log("_filteredTransactions", _filteredTransactions);
    }
  };

  const filterByType = () => {
    // we filter in our types state object
    const checked = Object.keys(types).filter((type) => types[type].checked);

    // if no checkbox is selected --> original array
    // if some checkbox is checked --> filter

    if (checked.length === 0) {
      // console.log("go back to original array");
      setFilteredTransactions(transactions);
    } else {
      const _filteredTransactions = transactions.filter((transaction) => {
        return types[transaction.type].checked === true;
      });
      setFilteredTransactions(_filteredTransactions);
      // console.log("_filteredTransactions", _filteredTransactions);
    }
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
      <Main>
        <FiltersContainer>
          <h2>Filters</h2>
          <h3>Category</h3>
          {categories &&
            Object.keys(categories).map((category) => {
              return (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={categories[category].checked}
                      onChange={(event) => {
                        const newCategoriesState = {
                          ...categories, // make a copy of all the categories
                          [category]: {
                            //label: categories[category].label,
                            ...categories[category], // we keep all the information of that category
                            checked: event.target.checked, // we update the "checked" property
                          },
                        };
                        // console.log("newCategoriesState", newCategoriesState);
                        setCategories(newCategoriesState);
                      }}
                      name={category}
                    />
                  }
                  label={categories[category].label}
                />
              );
            })}
          <h3>Types</h3>
          {types &&
            Object.keys(types).map((type) => {
              return (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={types[type].checked}
                      onChange={(event) => {
                        const newTypesState = {
                          ...types, // make a copy of all the Types
                          [type]: {
                            //label: Types[type].label,
                            ...types[type], // we keep all the information of that type
                            checked: event.target.checked, // we update the "checked" property
                          },
                        };
                        console.log("newTypesState", newTypesState);
                        setTypes(newTypesState);
                      }}
                      name={type}
                    />
                  }
                  label={types[type].label}
                />
              );
            })}
        </FiltersContainer>
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
                ({ _id, date, name, category, type, amount }) => {
                  return (
                    <tr key={_id}>
                      <TableCell>
                        {new Intl.DateTimeFormat("en-US").format(
                          new Date(date)
                        )}
                      </TableCell>
                      <TableCell>{name}</TableCell>
                      <TableCell>{ctx.categories[category]}</TableCell>
                      <TableCell>
                        <Amount type={type}>{formatter.format(amount)}</Amount>
                      </TableCell>
                      <TableCell>
                        <EditIcon
                          style={{ marginRight: "16px" }}
                          onClick={() => {
                            handleEdit(_id);
                          }}
                        />
                        <DeleteForeverIcon
                          style={{ color: "#FF7661" }}
                          onClick={() => handleDelete(_id)}
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
      </Main>
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
