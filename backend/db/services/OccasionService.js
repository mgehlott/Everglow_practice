const { TableFields } = require("../../utils/constants");
const occasion = require("../models/occasion");
const storage = require("../../utils/storage");
const { Folders } = require("../../utils/metadata");

class OccasionService {
  static getAllOccasion = (req) => {
    return new ProjectionBuilder(async function () {
      const pipeline = [];
      pipeline.push({
        $addFields: {
          iconUrl: {
            $concat: [storage.getUrlParentDir(Folders.IconImage), "$icon"],
          },
        },
      });
      const page = +req.query.page;
      const limit = +req.query.limit;
      if (page && limit) {
        const skip = (page - 1) * limit;
        pipeline.push({ $skip: skip }, { $limit: limit });
      }
      return await occasion.aggregate(pipeline);
    });
  };
  static addOccasion = (req) => {
    return new ProjectionBuilder(async function () {
      const newOccasion = new occasion();
      newOccasion[TableFields.title] = req.body.title;
      newOccasion[TableFields.color] = req.body.color;
      try {
        if (req.file) {
          const filename = await storage.addFile(
            Folders.IconImage,
            req.file.originalname,
            req.file.buffer
          );
          console.log("occasion icon added", filename);
          newOccasion[TableFields.icon] = filename;
        }
        return await newOccasion.save();
      } catch (error) {
        throw error;
      }
    });
  };
  static updateOccasion = (req) => {
    return new ProjectionBuilder(async function () {
      const currOccasion = await occasion.findById(req.params.occasionId);
      if (!currOccasion) throw new Error("Invalid Occasion Id");
      if (req.body.title) {
        currOccasion[TableFields.title] = req.body.title;
      }
      if (req.body.color) {
        currOccasion[TableFields.color] = req.body.color;
      }
      console.log("file up occasion", req.file, req.body);
      if (req.file) {
        if (currOccasion[TableFields.icon].length > 0) {
          const isIconDeleted = storage.removeFile(
            Folders.IconImage,
            currOccasion[TableFields.icon]
          );
          console.log("occasion icon removed", isIconDeleted);
        }
        const filename = await storage.addFile(
          Folders.IconImage,
          req.file.originalname,
          req.file.buffer
        );
        console.log("update candle icon added", filename);
        currOccasion[TableFields.icon] = filename;
      }
      console.log("upadate", currOccasion);
      return await currOccasion.save();
    });
  };
  static getOccasionById = (id) => {
    return new ProjectionBuilder(async function () {
      return await occasion.findById(id);
    });
  };
  static getOccasionsCount = () => {
    return new ProjectionBuilder(async function () {
      return await occasion.find({}).count();
    });
  };
}

class ProjectionBuilder {
  constructor(methodToExecute) {
    const projection = {
      populate: {},
    };
    this.withID = () => {
      projection[TableFields.ID] = 1;
      return this;
    };
    this.withColorAndIcon = () => {
      projection[TableFields.color] = 1;
      projection[TableFields.icon] = 1;
      return this;
    };
    this.execute = async () => {
      if (Object.keys(projection.populate) == 0) {
        delete projection.populate;
      } else {
        projection.populate = Object.values(projection.populate);
      }
      return await methodToExecute.call(projection);
    };
  }
}

module.exports = OccasionService;
