import express from "express";
import {
  registerUser,
  loginUser,
  forgotPassword,
  updateProfileController,
  getOrdersController,
  getUsersController,
  deleteUsersController,
} from "./../controllers/authRoute.js";
import { isAdmin, requireSignIn } from "./../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/forgot-password", forgotPassword);

router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

router.put("/profile", requireSignIn, updateProfileController);

router.get("/orders", requireSignIn, getOrdersController);

router.get("/users", requireSignIn, isAdmin, getUsersController);

router.delete(
  "/delete-user/:id",
  requireSignIn,
  isAdmin,
  deleteUsersController
);

export default router;
