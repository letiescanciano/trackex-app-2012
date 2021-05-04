import React, { useState, useEffect } from "react";

import styled from "styled-components";
import * as Yup from "yup";

import DeleteForeverIcon from "@material-ui/icons/DeleteForever";
import EditIcon from "@material-ui/icons/Edit";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import TextField from "@material-ui/core/TextField";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

import { Formik, Form } from "formik";

import { Debug } from "../../../aux/Debug";
import data from "./data.js";

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

const AddButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const FormWrapper = styled.div`
  padding: 16px;
  width: 380px;
  height: 100vh;
  overflow: scroll;
  background-color: #252f3d;
  color: white;
`;

const RadioOptionsWrapper = styled.div`
  display: flex;
  padding-top: 24px;
`;

const FieldsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const ActionsWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

const categories = [
  { value: "eating_out", label: "Eating out" },
  { value: "clothes", label: "Clothes" },
  { value: "electronics", label: "Electronics" },
  { value: "groceries", label: "Groceries" },
  { value: "other", label: "Other" },
];

const types = [
  { value: "expense", label: "Expense" },
  { value: "income", label: "Income" },
];

const TransactionsList = () => {
  const [transactions, setTransactions] = useState([]);
  const [openDrawer, setOpenDrawer] = useState(false);

  useEffect(() => {
    setTransactions(data);
  }, []);

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });

  const transactionSchema = Yup.object().shape({
    name: Yup.string().required("Required field"),
    date: Yup.string().required("Required field"),
    amount: Yup.number().required("Required field"),
    category: Yup.string().required("Required field"),
    type: Yup.string().required("Required field"),
  });

  const handleDelete = (id) => {
    const _transactions = [...transactions].filter(
      (transaction) => transaction.id !== id
    );
    setTransactions(_transactions);
  };

  const addTransactionToList = (data) => {
    console.log("Data", data);
    setTransactions([...transactions, { ...data }]);
  };
  return (
    <Container>
      <AddButtonWrapper>
        <Button
          variant='contained'
          color='primary'
          onClick={() => setOpenDrawer(true)}
        >
          + Add Transaction
        </Button>
      </AddButtonWrapper>
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
          {transactions.map(({ id, date, name, category, type, amount }) => {
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
                    onClick={(e) => {
                      console.log("I should open edit mode");
                      console.log(e, id);
                    }}
                  />
                  <DeleteForeverIcon
                    style={{ color: "#FF7661" }}
                    onClick={() => handleDelete(id)}
                  />
                </TableCell>
              </tr>
            );
          })}
        </tbody>
      </Table>

      {openDrawer && (
        <Drawer
          anchor='right'
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
        >
          <FormWrapper>
            <h2>New transaction</h2>
            <Formik
              initialValues={{
                name: "",
                amount: "",
                date: "",
                category: "eating_out",
                type: "expense",
              }}
              validationSchema={transactionSchema}
              onSubmit={(values, { setSubmitting }) => {
                console.log("Values onSubmit", JSON.stringify(values));
                addTransactionToList(values);
                setSubmitting(false);
                setOpenDrawer(false);
              }}
            >
              {({
                values,
                handleChange,
                touched,
                errors,
                isValid,
                isSubmitting,
              }) => (
                <>
                  <Form>
                    <FieldsWrapper>
                      <TextField
                        fullWidth
                        id='name'
                        name='name'
                        label='Name'
                        value={values.name}
                        onChange={handleChange}
                        error={touched.name && Boolean(errors.name)}
                        helperText={touched.name && errors.name}
                      />
                      <TextField
                        fullWidth
                        id='date'
                        name='date'
                        label='Date'
                        value={values.date}
                        onChange={handleChange}
                        error={touched.date && Boolean(errors.date)}
                        helperText={touched.date && errors.date}
                      />
                      <TextField
                        fullWidth
                        id='amount'
                        type='number'
                        name='amount'
                        label='Amount'
                        value={values.amount}
                        onChange={handleChange}
                        error={touched.amount && Boolean(errors.amount)}
                        helperText={touched.amount && errors.amount}
                      />
                    </FieldsWrapper>
                    <RadioOptionsWrapper>
                      <FormControl component='fieldset'>
                        <FormLabel component='legend'>Category</FormLabel>
                        <RadioGroup
                          aria-label='category'
                          name='category'
                          value={values.category}
                          onChange={handleChange}
                        >
                          {categories.map((category) => (
                            <FormControlLabel
                              value={category.value}
                              control={<Radio />}
                              label={category.label}
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormControl component='fieldset'>
                        <FormLabel component='legend'>Type</FormLabel>
                        <RadioGroup
                          aria-label='type'
                          name='type'
                          value={values.type}
                          onChange={handleChange}
                        >
                          {types.map(({ value, label }) => (
                            <FormControlLabel
                              value={value}
                              control={<Radio />}
                              label={label}
                            />
                          ))}
                        </RadioGroup>
                      </FormControl>
                    </RadioOptionsWrapper>
                    <ActionsWrapper>
                      <Button
                        variant='outlined'
                        color='primary'
                        onClick={() => setOpenDrawer(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant='contained'
                        color='primary'
                        type='submit'
                        disabled={!isValid || isSubmitting}
                      >
                        Save
                      </Button>
                    </ActionsWrapper>
                  </Form>
                  {/* <Debug /> */}
                </>
              )}
            </Formik>
          </FormWrapper>
        </Drawer>
      )}
    </Container>
  );
};

export { TransactionsList };
