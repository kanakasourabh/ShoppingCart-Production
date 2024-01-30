import express from "express";
import { isAdmin, requireSignIn } from "../middleware/authMiddleware.js";
import {
  braintreePaymentController,
  braintreeTokenController,
  createProductController,
  deleteProductController,
  getProductController,
  getSingleProductController,
  productCategoryController,
  productCountController,
  productFilterController,
  productListController,
  productphotoController,
  relatedProductController,
  searchProductController,
  updateProductController,
} from "../controllers/productController.js";
import formidable from "express-formidable";
const router = express.Router();

router.post(
  "/create-product",
  requireSignIn,
  isAdmin,
  formidable(),
  createProductController
);

router.get("/get-product", getProductController);

router.get("/get-product/:slug", getSingleProductController);

router.get("/product-photo/:pid", productphotoController);

router.delete("/delete-product/:pid", deleteProductController);

router.put(
  "/update-product/:pid",
  requireSignIn,
  isAdmin,
  formidable(),
  updateProductController
);

//filter Product

router.post("/product-filters", productFilterController);

//Product Count

router.get("/product-count", productCountController);

//Product Per Page

router.get("/product-list/:page", productListController);

//Search product
router.get("/search/:keyword", searchProductController);

//Similar Products

router.get("/related-product/:pid/:cid", relatedProductController);

//Category wise

router.get("/product-category/:slug", productCategoryController);

//Payment routes
//token
router.get("/braintree/token", braintreeTokenController);

//Payment
router.post('/braintree/payment', requireSignIn, braintreePaymentController)

export default router;
