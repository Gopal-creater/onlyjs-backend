import express from "express";
import userController from "../controllers/userController.js";
import authController from "../controllers/authController.js";

const userRouter = express.Router();

//Routes for authentication
userRouter.route("/signup").post(authController.signup);
userRouter.route("/signin").post(authController.login);

userRouter.route("/forgot-password").post(authController.forgotPassword);
userRouter.route("/reset-password/:token").post(authController.resetPassword);
userRouter
  .route("/update-my-password")
  .patch(authController.protect, authController.updatePassword);

//Routes to update and delete user by themself
userRouter
  .route("/me")
  .get(authController.protect, userController.getMe, userController.getUser);
userRouter
  .route("/update-me")
  .patch(authController.protect, userController.updateMe);
userRouter
  .route("/delete-me")
  .delete(authController.protect, userController.deleteMe);

//Other user routes only for admin
userRouter
  .route("/")
  .get(
    authController.protect,
    authController.restrictTo(["admin"]),
    userController.getAllUsers()
  )
  .post(
    authController.protect,
    authController.restrictTo(["admin"]),
    userController.createUser()
  );

userRouter
  .route("/:id")
  .get(
    authController.protect,
    authController.restrictTo(["admin"]),
    userController.getUser()
  )
  .patch(
    authController.protect,
    authController.restrictTo(["admin"]),
    userController.updateUser()
  )
  .delete(
    authController.protect,
    authController.restrictTo(["admin"]),
    userController.deleteUser()
  );

export default userRouter;
