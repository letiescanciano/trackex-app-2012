import React, { useState } from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import "./App.css";
import { NavBar } from "./components/NavBar";
import { TransactionsList } from "./components/Transactions/List";
import { TrackexProvider } from "./trackexContext";
// import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { Login } from "./components/Auth/Login";
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
  const [currentUser, setCurrentUser] = useState(undefined);
  console.log("currentUser", currentUser);
  return (
    <TrackexProvider>
      <MuiThemeProvider theme={theme}>
        {currentUser ? (
          <div className='layout'>
            <NavBar />
            <TransactionsList />
          </div>
        ) : (
          <Login setCurrentUser={setCurrentUser} />
        )}
      </MuiThemeProvider>
    </TrackexProvider>
  );
}

export default App;
