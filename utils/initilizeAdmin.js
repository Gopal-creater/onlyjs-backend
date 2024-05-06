import User from "../models/userModel.js";
import catchAsync from "./catchAsync.js";

const initializeAdmin = catchAsync(async () => {
  //Check if admin already exist
  const admin = await User.findOne({ email: process.env.ADMIN_EMAIL });

  if (!admin) {
    const adminDetails = {
      name: process.env.ADMIN_NAME,
      email: process.env.ADMIN_EMAIL,
      password: process.env.ADMIN_PWD,
      passwordConfirm: process.env.ADMIN_PWD,
      role: "admin",
    };
    await User.create(adminDetails);
    console.log("---Initialized admin---");
  }
});

export default initializeAdmin;
