import React, { useState } from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import "./App.css";

import { TrackexProvider } from "./contexts/trackexContext";
import { AuthProvider } from "./contexts/AuthContext/index";
// import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";

import { AppRoutes } from "./components/AuthRoutes";
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#FF7661",
      contrastText: "#fff",
    },
    text: {
      primary: "#fff",
    },
  },
  overrides: {
    MuiInputLabel: {
      root: { color: "#fff", fontWeight: "normal" },
    },
    MuiInput: {
      underline: {
        "&:before": {
          borderBottom: "1px solid #FF7661",
        },
        "&:hover": {
          borderBottom: "1px solid #FF7661",
        },
      },
    },
    MuiFormLabel: {
      root: {
        color: "#fff",
        fontWeight: 600,
        paddingBottom: "16px",
      },
    },
    MuiRadio: {
      root: {
        color: "#fff",
      },
    },
    MuiIconButton: {
      label: { color: "#FF7661" },
    },
  },
});

// const client = new ApolloClient({
//   uri: "http://localhost:1337/graphql",
//   cache: new InMemoryCache(),
// });

function App() {
  return (
    <AuthProvider>
      <TrackexProvider>
        <MuiThemeProvider theme={theme}>
          <AppRoutes />
        </MuiThemeProvider>
      </TrackexProvider>
    </AuthProvider>
  );
}

export default App;
