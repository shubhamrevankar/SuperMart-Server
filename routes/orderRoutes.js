import express from "express";

import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import orderModel from "../models/orderModel.js";

const router = express.Router();

//ADD----------
const addOrder = async (req, res) => {
  try {
    const order = new orderModel({
      quantity: req.body.quantity,
      products: req.body.products,
      payment: req.body.payment,
      buyer: req.body.buyer,
    });
    await order.save();
    res.json({ ok: true });
  } catch (error) {
    res.status(500).send(error);
  }
};
router.post("/add-order", requireSignIn, addOrder);

//GET ALL------------
export const getAllOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};

router.get("/get-allorders", requireSignIn, getAllOrdersController);

// GET FOR SINGLE ----------------
const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error WHile Geting Orders",
      error,
    });
  }
};

router.get("/get-orders", requireSignIn, getOrdersController);

// STATUS ----------------

export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While Updateing Order",
      error,
    });
  }
};

router.put(
  "/order-status/:orderId",
  requireSignIn,
  isAdmin,
  orderStatusController
);

export default router;
