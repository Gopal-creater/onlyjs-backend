import express from "express";
import authController from "../controllers/authController.js";
import topicController from "../controllers/topicController.js";

const topicRouter = express.Router();

topicRouter
  .route("/")
  .get(topicController.getAllTopic())
  .post(
    authController.protect,
    authController.restrictTo(["admin"]),
    topicController.createTopic()
  );

topicRouter
  .route("/:id")
  .get(topicController.getTopic())
  .patch(
    authController.protect,
    authController.restrictTo(["admin"]),
    topicController.updateTopic()
  )
  .delete(
    authController.protect,
    authController.restrictTo(["admin"]),
    topicController.deleteTopic()
  );

export default topicRouter;
