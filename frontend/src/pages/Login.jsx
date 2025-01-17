import React, { useState } from 'react';
import { Box, Typography, Link, Paper ,Alert} from '@mui/material';
import '../styles/Auth.css';
import DynamicForm from "../components/DynamicForm"
import apiClient from '../utils/axios';

const Login = () => {
  const [error, setError] = useState(""); 
  const handleSubmit =(formData) => {
    setError("");
    apiClient.post(`/api/v1/auth/login`,formData).then(response => {
      if(response.status === 201) {

        sessionStorage.setItem('name',response.data.name);
        // Save the token from the response
        const token = response.headers['authorization'].replace('Bearer ', '');
        sessionStorage.setItem('token', token); 
        //move to dahsboard 
        navigate("/dahsboard")
      }
    }).catch(error=> {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected server error occurred.");
      };
    });


  }
  const loginFields = [
    { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter your email', required: true },
    { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter your password', required: true },
];
    return (
      <Box className="auth-page">
      {/* Login Form Section */}
      <Paper elevation={3} className="auth-form-container">
        <Typography variant="h4" color="primary" gutterBottom align="center">
          Spending Organizer
        </Typography>
        <DynamicForm
          fields={loginFields}
          onSubmit={handleSubmit}
          title="Login"
          submitText="Login"
        />
                {error && <Alert severity="error" style={{ marginBottom: "16px" }}>{error}</Alert>}
        <Box className="auth-links-container">
          <Link href="/forgot-password" variant="body2" className="highlight-link">
            Forgot Password?
          </Link>
          <Link href="/register" variant="body2" className="highlight-link">
            Create an Account
          </Link>
        </Box>
      </Paper>

      {/* Image Placeholder Section */}
      <Box className="auth-image-container">
        <Box className="image-placeholder">Image Placeholder</Box>
      </Box>
    </Box>
    );
  };
  
  export default Login;