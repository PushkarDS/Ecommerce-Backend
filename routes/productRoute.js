const express = require("express");
const {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductDetails,
  getAdminProducts,
  createProductReview,
  getProductReviews
} = require("../controller/productController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

const router = express.Router();

router.route("/products").get(getAllProducts);

router
  .route("/admin/products")
  .get(isAuthenticatedUser, authorizeRoles("Admin"), getAdminProducts);

  //New Product
router.route("/admin/product/new").post(isAuthenticatedUser,authorizeRoles("Admin"), createProduct);

router
  .route("/admin/product/:id")
  .put(isAuthenticatedUser,authorizeRoles("Admin"), updateProduct)
  .delete(isAuthenticatedUser,authorizeRoles("Admin"),deleteProduct);


router.get('/product/:id', getProductDetails)
module.exports = router;


router.route("/review")
.get(isAuthenticatedUser,getProductReviews)
.post(isAuthenticatedUser, createProductReview);