const catchAsyncErrors = require("../middlewares/catchAsyncError");
const Order = require("../models/orderModel");

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.processPayment = catchAsyncErrors(async (req, res, next) => {
  const myPayment = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "inr",
    metadata: {
      company: "Ecommerce",
    },
  });

  res
    .status(200)
    .json({ success: true, client_secret: myPayment.client_secret });
});

exports.sendStripeApiKey = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY });
});

exports.processOrderOption = catchAsyncErrors(async (req, res, next) => {
  const {
    cashOnDelivery
  } = req.body;

  const paymentOption = await Order.create({
    cashOnDelivery:true
  });

  res.status(201).json({
    success: true,
    paymentOption
  });
});