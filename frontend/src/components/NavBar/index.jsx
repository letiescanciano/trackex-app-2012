import React from "react";
import logo from "./logo.svg";

import styled, { css } from "styled-components";

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
  padding: 8px 16px;
  margin-bottom: 8px;
  ${(props) =>
    props.active &&
    css`
      background: #ff7661;
      font-weight: bold;
    `};
`;

const Logo = styled.img`
  padding: 32px;
  width: 150px;
`;
const NavBar = (props) => {
  return (
    <Container>
      <Logo src={logo} />
      <List>
        <Item active={false}>Dashboard</Item>
        <Item active>Calendar</Item>
        <Item>Transactions</Item>
      </List>
    </Container>
  );
};
export { NavBar };
