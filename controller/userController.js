const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncError");

const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");

//Register A User

exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password } = req.body;
  // console.log(req.body)
  console.log(name, email, password)
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: "This is a Sample Id",
      url: "profilePicUrl",
    },
  });

  sendToken(user, 201, res);

  // const token = user.getJWTToken();

  // res.status(201).json({
  //     success:true,
  //     token
  // })
});

//Login User

exports.logInUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  //Checking if user has given password and email both

  if (!email || !password) {
    return next(new ErrorHandler("Please Enter Email and Password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or Password", 401));
  }

  const isPasswordMatch = user.comparePassword(password);

  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid email or Password", 401));
  }

  sendToken(user, 200, res);

  // const token = user.getJWTToken();

  // res.status(200).json({
  //     success:true,
  //     token
  // })
});

//Logout User

exports.logoutUser = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged Out.",
  });
});

//Forgot Password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("User not Found", 404));
  }

  //Get ResetPassword Token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your Password Reset Token Is:- \n \n ${resetPasswordUrl} \n \n If you have not requested this email then please ignore it.`;

  try {
     await sendEmail({
      email: user.email,
      subject: `Ecommerce Password Recovery`,
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} Successfully.`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

//Reset Password

//Get User Details
exports.getUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  sendToken(user, 200, res);

  // res.status(200).json({
  //   success: true,
  //   user,
    
  // });
});

//Update User Password
exports.updatePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("password");
  // console.log(user)

  const isPasswordMatch = await user.comparePassword(req.body.oldPassword);
  console.log("2")  

  console.log(isPasswordMatch);

  if (!isPasswordMatch) {
    return next(new ErrorHandler("Old Password is Incorrect", 400));
  }
  if (req.body.newPassword !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password does not match", 400));
  }
  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});

//Update User Profile
exports.updateProfile = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
  };
  id= [req.user.id,req.body.name,req.body.email,req.body]
  console.log(newUserData,id)


  //We will add cloudinary Later

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true,
    runValidators: true,
    userFindAndModify: false,
  });

  res.status(200).json({
    success: true,
  });
});

//Get All Users (admin)
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

//Get Single User (admin)
exports.getSingleUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
    user,
  });
});


//Update User Role --Admin
exports.updateUserRole = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role:req.body.role
  };


  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    userFindAndModify: false,
  });

  if (!user) {
    return next(
      new ErrorHandler(`User does not exist with Id: ${req.params.id}`)
    );
  }

  res.status(200).json({
    success: true,
  });
});


//Delete User --Admin
exports.deleteUser = catchAsyncError(async (req, res, next) => {

  const user = await User.findByIdAndDelete(req.params.id);

    //We will Remove cloudinary Later

    if (!user) {
      return next(
        new ErrorHandler(`User does not exist with Id: ${req.params.id}`)
      );
    }

    // await user.remove();
  res.status(200).json({
    success: true,
    message:"User Account Deleted"
  });
});