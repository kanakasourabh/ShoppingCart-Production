import { comparePassword, hashPassword } from "../helpers/authHelpers.js";
import User from "../model/user.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import Order from "../model/OrderModel.js";

export const authController = async (req, res) => {
  try {
    const { name, email, address, phone, password, answer } = req.body;
    if (!name) {
      return res.send({ message: "name is required" });
    }
    if (!email) {
      return res.send({ message: "email is required" });
    }
    if (!address) {
      return res.send({ message: "address is required" });
    }
    if (!phone) {
      return res.send({ message: "phone is required" });
    }
    if (!password) {
      return res.send({ message: "password is required" });
    }
    if (!answer) {
      return res.send({ message: "Secret Answer is required" });
    }

    //existing user

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(200).send({
        success: false,
        message: "Already exits please login",
      });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await new User({
      name,
      email,
      address,
      phone,
      password: hashedPassword,
      answer,
    });
    await newUser.save();
    res.status(201).send({
      success: true,
      Message: "new USer Created",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error in Registration",
      error,
    });
  }
};

//post login

export const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Email not found",
      });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(200).send({
        success: false,
        message: "Invalid password",
      });
    }

    const token = await jwt.sign({ _id: user._id }, process.env.jwt_passcode, {
      expiresIn: "1d",
    });
    res.status(200).send({
      success: true,
      message: "Login Successfull",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
        phone: user.phone,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Login",
      error,
    });
  }
};

export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;

    if (!email) {
      res.status(400).send({
        message: "Email is required",
      });
    }
    if (!answer) {
      res.status(400).send({
        message: "Answer is required",
      });
    }
    if (!newPassword) {
      res.status(400).send({
        message: "newPassword is required",
      });
    }

    const user = await User.findOne({ email, answer });
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "Wrong email or answer",
      });
    }

    const hashed = await hashPassword(newPassword);
    await User.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password reset Successfully",
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

export const adminController = (req, res) => {
  res.send("jwt verified");
};

//Update Profile

export const updateProfileController = async (req, res) => {
  try {
    const { name, email, password, address, phone } = req.body;

    const user = await User.findById(req.user._id);
    //Password
    if (password && password.length < 6) {
      return res.json({ error: "password is required and 6 character long" });
    }
    const hashedPassword = password ? await hashPassword(password) : undefined;
    const updatedUser = await User.findByIdAndUpdate(
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
      message: "User updated successfully",
      updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error updating profile",
      error,
    });
  }
};

//order

export const getOrderController = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting orders",
      error,
    });
  }
};

//All Orders for Admin dashboard
export const getAllOrderController = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting orders",
      error,
    });
  }
};

//Order Status Controller
export const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while changing order Status",
      error,
    });
  }
};
