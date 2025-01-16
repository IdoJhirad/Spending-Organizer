import React from "react";
import { useNavigate } from "react-router-dom";
import CustomButton from "../components/ReusableButton";
import "../styles/Header.css";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="header-container">
      <h1 className="header-title">Spending Organizer</h1>
      <CustomButton
        text="Login"
        variant="contained"
        color="secondary" 
        onClick={() => navigate("/login")}
      />
    </header>
  );
};

export default Header;
