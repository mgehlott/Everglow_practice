const { TableFields, ApiResponseCode } = require("../../utils/constants");
const candle = require("../models/candle");
const storage = require("../../utils/storage");
const { Folders } = require("../../utils/metadata");
class CandleService {
  static addCandle = (req) => {
    return new ProjectionBuilder(async function () {
      const newCandle = new candle();
      newCandle[TableFields.title] = req.body.title;
      try {
        if (req.file) {
          const filename = await storage.addFile(
            Folders.IconImage,
            req.file.originalname,
            req.file.buffer
          );
          console.log("image added", filename);
          newCandle[TableFields.icon] = filename;
        }
        return await newCandle.save();
      } catch (error) {
        throw error;
      }
    });
  };

  static deleteCandle = (id) => {
    return new ProjectionBuilder(async function () {
      try {
        const deleted = await candle.findByIdAndDelete(id);
        if (deleted && deleted[TableFields.icon].length > 0) {
          const isIconDeleted = await storage.removeFile(
            Folders.IconImage,
            deleted[TableFields.icon]
          );
        }
        return deleted;
      } catch (error) {
        console.log(error);
        throw error;
      }
    });
  };
  static updateCandle = (req) => {
    return new ProjectionBuilder(async function () {
      const currCandle = await candle.findById(req.params.candleId);
      console.log("currant candle", currCandle);
      if (!currCandle) throw new Error("Invalid candle id");
      if (req.body.title) {
        currCandle[TableFields.title] = req.body.title;
      }
      if (req.file) {
        if (currCandle[TableFields.icon].length > 0) {
          const isIconDeleted = await storage.removeFile(
            Folders.IconImage,
            currCandle[TableFields.icon]
          );
          console.log("candle icon removed", isIconDeleted);
        }
        const filename = await storage.addFile(
          Folders.IconImage,
          req.file.originalname,
          req.file.buffer
        );
        console.log("update candle icon added", filename);
        currCandle[TableFields.icon] = filename;
      }
      return await currCandle.save();
    });
  };

  static getCandleById = (id) => {
    return new ProjectionBuilder(async function () {
      return await candle.findById(id, this);
    });
  };

  static getAllCandles = () => {
    return new ProjectionBuilder(async function () {
      return await candle.aggregate([
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
}

class ProjectionBuilder {
  constructor(methodToExecute) {
    const projection = {
      populate: {},
    };

    this.withId = () => {
      projection[TableFields.ID] = 1;
      return this;
    };
    this.withTitle = () => {
      projection[TableFields.title] = 1;
      return this;
    };
    this.withIcon = () => {
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

module.exports = CandleService;
