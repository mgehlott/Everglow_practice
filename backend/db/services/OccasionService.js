const { TableFields } = require("../../utils/constants");
const occasion = require("../models/occasion");
const storage = require("../../utils/storage");
const { Folders } = require("../../utils/metadata");

class OccasionService {
  static getAllOccasion = () => {
    return new ProjectionBuilder(async function () {
      return await occasion.aggregate([
        {
          $addFields: {
            iconUrl: {
              $concat: [storage.getUrlParentDir(Folders.IconImage), "$icon"],
            },
          },
        },
      ]);
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
