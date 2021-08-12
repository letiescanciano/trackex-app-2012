import React, { useContext } from "react";
import logo from "./logo.svg";

import styled, { css } from "styled-components";
import { Link, useLocation, useHistory } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext";

const Container = styled.div`
  border-right: 1px solid white;
  height: 100vh;
`;

const List = styled.ul`
  list-style-type: none;
  padding: 32px 0;
  margin: 0;
`;

const Item = styled.li`
  padding: 16px 24px;
  ${(props) =>
    props.active &&
    css`
      background: #ff7661;
      font-weight: bold;
    `};
  a {
    text-decoration: none;
    color: white;
  }
`;

const Logo = styled.img`
  padding: 32px;
  width: 150px;
`;

const links = [
  { label: "Dashboard", url: "/dashboard" },
  { label: "Calendar", url: "/calendar" },
  { label: "Transactions", url: "/" },
  { label: "Settings", url: "/settings" },
];
const NavBar = () => {
  const location = useLocation();
  const history = useHistory();

  const { firebase, setUser } = useContext(AuthContext);
  const handleLogout = () => {
    console.log("logout");
    firebase
      .auth()
      .signOut()
      .then(() => {
        setUser(null);
        history.push("/");
      });
  };
  return (
    <Container>
      <Logo src={logo} />
      <List>
        {links.map((link) => {
          const active = location.pathname === link.url;
          return (
            <Item active={active}>
              <Link to={`${link.url}`}>{link.label}</Link>
            </Item>
          );
        })}

        <Item onClick={handleLogout}>Logout</Item>
      </List>
    </Container>
  );
};
export { NavBar };
