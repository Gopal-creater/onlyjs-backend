import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import APIFeatures from "../utils/apiFeatures.js";

class HandlerFactory {
  deleteOne = (Model) =>
    catchAsync(async (req, res, next) => {
      const doc = await Model.findByIdAndDelete(req.params.id);

      if (!doc) {
        return next(new AppError("No document found with that ID", 404));
      }

      res.status(200).json({
        status: "success",
        data: null,
      });
    });

  updateOne = (Model) =>
    catchAsync(async (req, res, next) => {
      const doc = await Model.findOneAndUpdate(
        { _id: req.params.id },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

      if (!doc) {
        return next(new AppError("No document found with that ID", 404));
      }

      res.status(200).json({
        status: "success",
        data: doc,
      });
    });

  createOne = (Model) =>
    catchAsync(async (req, res) => {
      const doc = await Model.create(req.body);

      res.status(201).json({
        status: "success",
        data: doc,
      });
    });

  getOne = (Model, popOptions) =>
    catchAsync(async (req, res, next) => {
      let query = Model.findById(req.params.id);
      if (popOptions) query = query.populate(popOptions);

      const doc = await query;

      if (!doc) {
        return next(new AppError("No document found with that ID", 404));
      }

      res.status(200).json({
        status: "success",
        data: doc,
      });
    });

  getAll = (Model) =>
    catchAsync(async (req, res) => {
      const features = new APIFeatures(Model.find(), req.query)
        .filter()
        .sort()
        .limitFields();

      const results = await Model.paginate(features.query, {
        page: req.query.page * 1 || 1,
        limit: req.query.limit * 1 || 100,
      });

      res.status(200).json({
        status: "success",
        data: results,
      });
    });
}

const factory = new HandlerFactory();
export default factory;
