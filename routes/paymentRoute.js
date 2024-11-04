const express = require("express");
const {
  // processPayment,
  sendStripeApiKey,
  processOrderOption,
} = require("../controller/paymentController");
const router = express.Router();
const { isAuthenticatedUser } = require("../middlewares/auth");

router.route("/payment/process").post(isAuthenticatedUser, processOrderOption);

router.route("/stripeapikey").get(isAuthenticatedUser, sendStripeApiKey);

module.exports = router;
