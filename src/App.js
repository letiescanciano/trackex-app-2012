import React from "react";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import "./App.css";
import { NavBar } from "./components/NavBar";
import { TransactionsList } from "./components/Transactions/List";

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
function App() {
  return (
    <MuiThemeProvider theme={theme}>
      <div className='layout'>
        <NavBar />
        <TransactionsList />
      </div>
    </MuiThemeProvider>
  );
}

export default App;
