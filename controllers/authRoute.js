import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    // console.log("registering...");
    // console.log(req.body);
    const { name, password, email, phone, address, answer } = req.body;
    if (!name || !email || !password || !phone || !address || !answer) {
      res.json({ success: false, message: "Enter all fields" });
    }
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      res.status(200).json({ success: false, message: "User already exists" });
    }
    const hpass = await hashPassword(password);

    const user = await new userModel({
      name,
      password: hpass,
      email,
      phone,
      address,
      answer,
    });

    user.save();

    res.status(201).json({
      success: true,
      message: "Successfully Registered",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ success: false, message: "Unknown error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { password, email } = req.body;
    if (!email || !password) {
      return res.send({ success: false, error: "Enter all fields" });
    }
    const user = await userModel.findOne({ email });

    // console.log(user);

    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "User Not Found" });
    }

    const checkPass = await comparePassword(password, user.password);

    if (!checkPass) {
      return res.send({
        success: false,
        error: "Invalid username or password",
      });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).send({
      success: true,
      message: "Successfully Logged",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email, newpassword, answer } = req.body;
    if (!email || !newpassword || !answer) {
      return res.send({ success: false, error: "Enter all fields" });
    }
    const user = await userModel.findOne({ email, answer });
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: "Wrong Email or answer" });
    }

    const hashed = await hashPassword(newpassword);

    await userModel.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

//update profile
export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;
    const user = await userModel.findById(req.user._id);
    //password
    if (password && password.length < 6) {
      return res.json({ error: "Passsword is required and 6 character long" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      {
        name: name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address,
      },
      { new: true }
    );
    res.status(200).send({
      success: true,
      message: "Profile Updated SUccessfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error WHile Update profile",
      error,
    });
  }
};

//orders
export const getOrdersController = async (req, res) => {
  try {
    const orders = await orderModel
      .find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
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
//orders
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

//order status
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

//getting users
export const getUsersController = async (req, res) => {
  try {
    const users = await userModel
      .find({ _id: { $ne: req.user._id } })
      .select("-answer")
      .select("-password");

    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While getting users",
      error,
    });
  }
};

//delete users
export const deleteUsersController = async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.params.id);
    // console.log(req.params.id);
    res.send({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error While deleting users",
      error,
    });
  }
};
