import Topic from "../models/topicModel.js";
import factory from "./handlerFactory.js";

class TopicController {
  getAllTopic = () => factory.getAll(Topic);

  getTopic = () => factory.getOne(Topic);

  createTopic = () => factory.createOne(Topic);

  updateTopic = () => factory.updateOne(Topic);

  deleteTopic = () => factory.deleteOne(Topic);
}

const topicController = new TopicController();
export default topicController;
