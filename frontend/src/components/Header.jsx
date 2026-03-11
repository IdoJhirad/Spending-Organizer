import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Header.css";
import { Button } from "@mui/material";

const Header = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!sessionStorage.getItem('token');

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('name');
    navigate('/login');
  };

  return (
    <header className="header-container">
      <h1
        className="header-title"
        style={{ cursor: 'pointer' }}
        onClick={() => navigate(isLoggedIn ? '/dashboard' : '/')}
      >
        Spending Organizer
      </h1>
      {isLoggedIn ? (
        <Button variant="contained" color="secondary" onClick={handleLogout}>
          Logout
        </Button>
      ) : (
        <Button variant="contained" color="secondary" onClick={() => navigate("/login")}>
          Login
        </Button>
      )}
    </header>
  );
};

export default Header;
