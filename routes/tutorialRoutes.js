import express from "express";
import authController from "../controllers/authController.js";
import tutorialController from "../controllers/tutorialController.js";

const tutorialRouter = express.Router();

tutorialRouter
  .route("/")
  .get(tutorialController.getAllTutorial())
  .post(
    authController.protect,
    authController.restrictTo(["admin"]),
    tutorialController.createTutorial()
  );

tutorialRouter
  .route("/:id")
  .get(tutorialController.getTutorial())
  .patch(
    authController.protect,
    authController.restrictTo(["admin"]),
    tutorialController.updateTutorial()
  )
  .delete(
    authController.protect,
    authController.restrictTo(["admin"]),
    tutorialController.deleteTutorial()
  );

export default tutorialRouter;
