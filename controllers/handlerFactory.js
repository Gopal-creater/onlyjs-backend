import AppError from "../utils/appError.js";
import catchAsync from "../utils/catchAsync.js";
import aqp from "api-query-params";

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

  deleteOneBySlug = (Model) =>
    catchAsync(async (req, res, next) => {
      const { slug } = req.params;

      // Find the document by slug and delete it
      const doc = await Model.findOneAndDelete({ slug });

      if (!doc) {
        return next(new AppError("No document found with that slug", 404));
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

  updateOneBySlug = (Model) =>
    catchAsync(async (req, res, next) => {
      const filter = { slug: req.params.slug };
      const doc = await Model.findOneAndUpdate(filter, req.body, {
        new: true, // Return the updated document
        runValidators: true, // Validate the update against the model's schema
      });

      if (!doc) {
        return next(new AppError("No document found with that slug", 404));
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

  getOneBySlug = (Model, popOptions) =>
    catchAsync(async (req, res, next) => {
      let query = Model.findOne({ slug: req.params.slug });
      if (popOptions) query = query.populate(popOptions);

      const doc = await query;

      if (!doc) {
        return next(new AppError("No document found with that slug", 404));
      }

      res.status(200).json({
        status: "success",
        data: doc,
      });
    });

  getAll = (Model) =>
    catchAsync(async (req, res) => {
      // Parse query parameters using api-query-params
      const { filter, skip, limit, sort, projection, population } = aqp(
        req.query
      );

      //Deleting if any page sort and limit and fields exist in filter
      const excludedFields = ["page", "sort", "limit", "fields"];
      excludedFields.forEach((el) => delete filter[el]);

      // Options for mongoose-paginate-v2
      const options = {
        page: req.query.page * 1 || 1,
        limit: req.query.limit * 1 || 10,
        sort: sort || {},
        select: projection || "",
        populate: population || "",
      };

      const results = await Model.paginate(filter, options);

      res.status(200).json({
        status: "success",
        data: results,
      });
    });
}

const factory = new HandlerFactory();
export default factory;
