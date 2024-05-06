import Tutorial from "../models/tutorialModal.js";
import factory from "./handlerFactory.js";

class TutorialController {
  getAllTutorial = () => factory.getAll(Tutorial);

  getTutorial = () => factory.getOne(Tutorial);

  createTutorial = () => factory.createOne(Tutorial);

  updateTutorial = () => factory.updateOne(Tutorial);

  deleteTutorial = () => factory.deleteOne(Tutorial);
}

const tutorialController = new TutorialController();
export default tutorialController;
