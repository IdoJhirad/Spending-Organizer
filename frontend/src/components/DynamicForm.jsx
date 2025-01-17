import React,{useState} from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import "../styles/DynamicForm.css"

/**
 * Dynamic form for all auth related forms
 */
const DynamicForm =({fields, onSubmit, title, submitText}) => {
    //initialize the fields of form data to empty string
    const [formData, setFormData] = useState(
        fields.reduce((acc, field) => {
            acc[field.name]="";
            return acc;
        },{})
    );
    const handleChange = (e)=>{
        const{name, value} = e.target; 
        setFormData({ ...formData, [name]: value});
    };

    const handleSubmit = (e)=> {
        e.preventDefault();
        onSubmit(formData);
    };
    return (
        <Box
            component="form"
            className="dynamic-form"
            onSubmit={handleSubmit}
        >
            <Typography variant="h5" className="dynamic-form-title" gutterBottom>
                {title}
            </Typography>
            {fields.map((field) => (
                <TextField
                    key={field.name}
                    id={field.name}
                    label={field.label}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required={field.required}
                    fullWidth
                    margin="normal"
                    type={field.type}
                />
            ))}
            <Button
                type="submit"
                variant="contained"
                className="dynamic-form-button"
            >
                {submitText}
            </Button>
        </Box>
    );
};

export default DynamicForm;

