import User from "../models/userModel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import { sendEmail } from "../utils/email.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";

class AuthController {
  createSendToken = async (user, statusCode, res) => {
    const token = await this.signToken(user._id);

    const cookieOptions = {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: req.secure || req.headers["x-forwarded-proto"] === "https",
    };

    res.cookie("jwt", token, cookieOptions);

    //Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
      status: "success",
      data: {
        user,
      },
    });
  };

  signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });
    this.createSendToken(newUser, 201, res);
  });

  signToken = (id) => {
    return new Promise((resolve, reject) => {
      jwt.sign(
        { id },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRES_IN,
        },
        (err, token) => {
          if (err) {
            reject(err);
          } else {
            resolve(token);
          }
        }
      );
    });
  };

  verifyToken = (token) => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });
  };

  login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    //Check if email and password exist
    if (!email || !password) {
      return next(new AppError("Please provide email and password!", 400));
    }

    //check if user exist and password is correct
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError("Incorrect email or password", 401));
    }

    //If everything of send response
    this.createSendToken(user, 200, res);
  });

  protect = catchAsync(async (req, res, next) => {
    //check if token present or not
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token || token === null) {
      return next(new AppError("User not logged in!", 401));
    }

    //verify token
    const decoded = await this.verifyToken(token);

    //check if user still exist
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
      return next(
        new AppError(
          "The user belonging to this token does no longer exist.",
          401
        )
      );
    }

    //check if email is verified - Not implementing in this project
    // if (!freshUser.isEmailVerified) {
    //   return next(new AppError("Please verify email to use the app.", 401));
    // }

    //Remainng to check if user changed password after the token was issued---------------

    //Grant acces to protected route
    req.user = freshUser;
    next();
  });

  restrictTo = (roles) => {
    return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
        return next(
          new AppError("You do not have permission to perform this action", 403)
        );
      }
      next();
    };
  };

  forgotPassword = catchAsync(async (req, res, next) => {
    //Get user based on posted email
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(new AppError("There is no user with email address", 404));
    }

    //Generate random reset token
    const resetToken = user.createPasswordResetToken();

    //Send it to user's email
    const resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/users/reset-password/${resetToken}`;

    const message = `Forgot your password? submit a patch request with your new password and password confirmation
     to : ${resetUrl}.\n If you didn't forget your password, please ignore this email.`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Your password reset token (valid for 10 min)",
        message,
      });

      await user.save({ validateBeforeSave: false });

      res.status(200).json({
        status: "success",
        message: "Token sent to email",
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetTokenExpires = undefined;

      await user.save({ validateBeforeSave: false });

      return next(
        new AppError(
          "There was an error sending the email. Try again later!",
          500
        )
      );
    }
  });

  resetPassword = catchAsync(async (req, res, next) => {
    //get user based on the token
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetTokenExpires: {
        $gt: Date.now(),
      },
    });

    //If token is not expired and there is user set the new password
    if (!user) {
      return next(new AppError("Token is invalid or has expired", 400));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpires = undefined;
    await user.save();

    //If everything ok log the user in and send token
    this.createSendToken(user, 200, res);
  });

  updatePassword = catchAsync(async (req, res, next) => {
    //Get user from collection
    const user = await User.findById(req.user.id).select("+password");

    //check if current posted password is correct
    if (
      !(await user.correctPassword(req.body.passwordCurrent, user.password))
    ) {
      return next(new AppError("Your current password is wrong.", 401));
    }

    //update the password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();

    //Log the user in and send token
    this.createSendToken(user, 200, res);
  });
}

// Exporting an instance of the TourController class
const authController = new AuthController();
export default authController;
