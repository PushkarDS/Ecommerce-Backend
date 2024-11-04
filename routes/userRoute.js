const express = require("express");
const {
  registerUser,
  logInUser,
  logoutUser,
  forgotPassword,
  getUserDetails,
  updatePassword,
  updateProfile,
  getAllUsers,
  getSingleUser,
  updateUserRole,
  deleteUser,
} = require("../controller/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

const router = express.Router();

router.route("/register").post(registerUser);

router.route("/login").post(logInUser);

router.route("/password/forgot").post(forgotPassword);

router.route("/logout").get(logoutUser);

router.route("/me").get(isAuthenticatedUser, getUserDetails);

router.route("/password/update").put(isAuthenticatedUser, updatePassword);

router.route("/me/update").put(isAuthenticatedUser, updateProfile);

router
  .route("/admin/users")
  .get(isAuthenticatedUser, authorizeRoles("Admin"), getAllUsers);

router
  .route("/admin/user/:id")
  .get(isAuthenticatedUser, authorizeRoles("Admin"), getSingleUser)
  .put(isAuthenticatedUser, authorizeRoles("Admin"), updateUserRole)
  .delete(isAuthenticatedUser,authorizeRoles("Admin"),deleteUser);

module.exports = router;
