import React from "react";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-text">
        <h1>Take Control of Your Finances Today</h1>
        <p>
          Tracking your expenses is the first step towards financial freedom.
          With our intuitive platform, you can categorize your spending and
          visualize your financial health effortlessly.
        </p>
        <div className="button-group">
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/register")}
          >
            Get Started
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => console.log("Learn More clicked")}
          >
            Learn More
          </Button>
        </div>
      </div>
      <div className="home-image">
        <div className="image-placeholder">Image Placeholder</div>
      </div>
    </div>
  );
};

export default Home;
