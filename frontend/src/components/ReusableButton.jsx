import React from "react";
import PropTypes from "prop-types";
import { Button as MuiButton } from "@mui/material";

const CustomButton = ({ text, variant, color, onClick }) => {
  return (
    <MuiButton
      variant={variant} // 'contained' or 'outlined'
      color={color}     // 'primary' or 'secondary'
      onClick={onClick}
    >
      {text}
    </MuiButton>
  );
};

CustomButton.propTypes = {
  text: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(["contained", "outlined"]).isRequired,
  color: PropTypes.oneOf(["primary", "secondary"]).isRequired,
  onClick: PropTypes.func,
};

CustomButton.defaultProps = {
  onClick: () => {},
};

export default CustomButton;
