import React from 'react';
import { Box, TextField, Typography, Button, Link, Paper } from '@mui/material';
import '../styles/Login.css';

const Login = () => {
    return (
      <Box className="login-page">
        {/* Login Form Section */}
        <Paper elevation={3} className="login-form-container">
          <Typography variant="h4" color="primary" gutterBottom align="center">
            Spending Organizer
          </Typography>
          <form className="login-form">
            <TextField
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              margin="normal"
              required
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              variant="outlined"
              margin="normal"
              required
            />
            <Button variant="contained" color="primary" fullWidth className="login-button">
              Login
            </Button>
          </form>
          <Box className="login-links-container">
            <Link href="/forgot-password" variant="body2" className="highlight-link">
              Forgot Password?
            </Link>
            <Link href="/register" variant="body2" className="highlight-link">
              Create an Account
            </Link>
          </Box>
        </Paper>
  
        {/* Image Placeholder Section */}
        <Box className="login-image-container">
          <Box className="image-placeholder">
            Image Placeholder
          </Box>
        </Box>
      </Box>
    );
  };
  
  export default Login;