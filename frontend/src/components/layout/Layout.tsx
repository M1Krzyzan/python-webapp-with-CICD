import React from "react";
import { Box } from "@mui/material";
import Main from "./Main.tsx";
import Sidebar from "./Sidebar.tsx";
import Header from "./Header.tsx";

const Layout = (): React.JSX.Element => {
  return (
    <Box
      gridTemplateRows={"6rem 1fr auto"}
      gridTemplateColumns={"220px auto"}
      display={"grid"}
      style={{ minHeight: "100vh" }}
    >
      <Sidebar />
      <Header />
      <Main />
    </Box>
  );
};

export default Layout;