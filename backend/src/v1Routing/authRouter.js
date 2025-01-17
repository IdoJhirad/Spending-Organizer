import { Router } from "express";
import {register,login, logout, verifyEmail,checkAuth,googleAuthCallback} from "../controller/authController.js"
const router = Router();
import verifyToken from "../middleware/verifyToken.js";
import passport from 'passport';
 router
    .post("/register", register)
    .post("/login", login)
    .post("/logout", logout)
    .get("/verify-email",verifyEmail)
    .get("/check-auth", verifyToken,checkAuth)
    // initiat google login and redirect to google
    .get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }))
    .get('/google/callback',
        passport.authenticate('google', { failureRedirect: '/login' ,session: false}), 
        googleAuthCallback
    )
export default router;


/*
    .post("/reset-password", authController.resetPassword)
    .post("/change-password", verifyToken ,authController.changePassword)
    .post("/reset-password/confirm", authController.changePasswordResetToken)
    */