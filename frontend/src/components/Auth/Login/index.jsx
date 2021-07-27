import React from "react";
import styled from "styled-components";
import logo from "../../NavBar/logo.svg";

import * as Yup from "yup";
import { Formik, Form } from "formik";
import { Debug } from "../../../aux/Debug";
import { TextField } from "@material-ui/core";
import { Button } from "@material-ui/core";
import { authAPI } from "../../../services/auth";

const userSchema = Yup.object().shape({
  username: Yup.string().required("Required field"),
  password: Yup.string().required("Required field"),
});

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  justify-content: center;
`;
const Logo = styled.img`
  width: 150px;
`;

const Login = ({ setCurrentUser }) => {
  const handleSubmit = async (values) => {
    try {
      const { status, data } = await authAPI.login(values);
      console.log("response", data);
      if (status === 200) {
        setCurrentUser({ username: values.username, ...data });
      }
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <Container>
      <Logo src={logo} />
      <Formik
        initialValues={{}}
        validationSchema={userSchema}
        onSubmit={(values) => {
          handleSubmit(values);
        }}
      >
        {({ isSubmitting, isValid, values, handleChange, touched, errors }) => {
          return (
            <>
              <Form>
                <TextField
                  style={{ marginBottom: "16px" }}
                  fullWidth
                  id='username'
                  name='username'
                  label='Username'
                  value={values.username}
                  onChange={handleChange}
                  error={touched.username && Boolean(errors.username)}
                  helperText={touched.username && errors.username}
                />
                <TextField
                  style={{ marginBottom: "32px" }}
                  fullWidth
                  id='password'
                  name='password'
                  label='Password'
                  type='password'
                  value={values.password}
                  onChange={handleChange}
                  error={touched.password && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                />

                <Button
                  fullWidth
                  variant='contained'
                  color='primary'
                  type='submit'
                  disbled={!isValid || isSubmitting}
                >
                  Log in
                </Button>
              </Form>
              <Debug />
            </>
          );
        }}
      </Formik>
    </Container>
  );
};
export { Login };
