import express from "express";
import { registerUser, loginUser, forgotPassword, updateProfileController } from './../controllers/authRoute.js';
import { isAdmin, requireSignIn } from './../middlewares/authMiddleware.js';

const router = express.Router();

router.post("/register",registerUser);

router.post("/login",loginUser);

router.post("/forgot-password",forgotPassword);

router.get('/user-auth', requireSignIn, (req,res) => {
    res.status(200).send({ ok:true })
})

router.get('/admin-auth', requireSignIn, isAdmin, (req,res) => {
    res.status(200).send({ ok:true })
})

router.put("/password", requireSignIn, updateProfileController);

export default router