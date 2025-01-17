import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Header.css";
import { Button } from "@mui/material";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="header-container">
      <h1 className="header-title">Spending Organizer</h1>
      <Button
        text="Login"
        variant="contained"
        color="secondary" 
        onClick={() => navigate("/login")}
      >Login</Button>
    </header>
  );
};

export default Header;
