import React, { useState } from 'react';
import { Box, TextField, Typography, Button, Link, Paper ,Alert} from '@mui/material';
import '../styles/Auth.css';
import DynamicForm from "../components/DynamicForm"
import apiClient from '../utils/axios';

const Register = () => {
    
    const [error, setError] = useState(""); 

    const registerFields = [
        { name: 'name', label: 'Name', type: 'text', placeholder: 'Enter your full name', required: true },
        { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter your email address', required: true },
        { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter your password', required: true },
        { name: 'phone_number', label: 'Phone Number', type: 'tel', placeholder: 'Enter your phone number', required: true },
      ];
    const handleSubmit = (formData) => {
        apiClient.post(`/api/v1/auth/register`,formData).then(response => {
        if(response.status === 201) {
            //move to login 
            navigate("/login")
        }
        }).catch(error=> {
            if (error.response && error.response.data && error.response.data.message) {
                setError(error.response.data.message);
            } else {
                setError("An unexpected server error occurred.");
            };
    
        });
    }
      
    return (
        <Box className="auth-page">
        <Paper elevation={3} className="auth-form-container">
        <Typography variant="h4" color="primary" gutterBottom align="center">
          Spending Organizer
        </Typography>
        <DynamicForm
          fields={registerFields}
          onSubmit={handleSubmit}
          title="Create new account"
          submitText="Register"
        />
        {error && <Alert severity="error" style={{ marginBottom: "16px" }}>{error}</Alert>}
        <Box className="auth-links-container">
          <Link href="/login" variant="body2" className="highlight-link">
          Already have an account?
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
export default Register;