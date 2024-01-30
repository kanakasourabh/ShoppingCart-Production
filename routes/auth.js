import express from "express";
import {
  adminController,
  authController,
  forgotPasswordController,
  getAllOrderController,
  getOrderController,
  loginController,
  orderStatusController,
  updateProfileController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", authController);
router.post("/login", loginController);
router.post("/forgot-password", forgotPasswordController);

router.get("/admin", requireSignIn, isAdmin, adminController);

//Protected USer route
router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(200).send({ ok: true });
});

//Protected admin route
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
  res.status(200).send({ ok: true });
});

//Update profile
router.put("/profile", requireSignIn, updateProfileController);

//Orders

router.get("/orders", requireSignIn, getOrderController);

//All orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrderController);

//order  Status Update
router.put('/order-status/:orderId', requireSignIn, isAdmin, orderStatusController)
export default router;
