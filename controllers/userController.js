import User from "../models/userModel.js";
import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import factory from "./handlerFactory.js";

class UserController {
  filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach((el) => {
      if (allowedFields.includes(el)) {
        newObj[el] = obj[el];
      }
    });
    return newObj;
  };

  getMe = (req, res, next) => {
    req.params.id = req.user.id;
    next();
  };

  updateMe = catchAsync(async (req, res, next) => {
    //Dont allow user to update password
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError("Cannot update the password, User other way for it.", 400)
      );
    }

    //Filter document
    const filteredBody = filterObj(req.body, "name", "email");

    //Update user document
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: updatedUser,
    });
  });

  deleteMe = catchAsync(async (req, res, next) => {
    //Update user document
    await User.findByIdAndUpdate(req.user.id, { active: false });

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

  getAllUsers = () => factory.getAll(User);

  getUser = () => factory.getOne(User);

  createUser = () => factory.createOne(User);

  updateUser = () => factory.updateOne(User);

  deleteUser = () => factory.deleteOne(User);
}

// Exporting an instance of the UserController class
const userController = new UserController();
export default userController;
