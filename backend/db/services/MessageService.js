const { TableFields } = require("../../utils/constants");
const message = require("../models/message");

class MessageService {
  static saveMessage = (req) => {
    return new ProjectionBuilder(async function () {
      const result = await message.create({
        [TableFields.name]: req.user.name,
        [TableFields.email]: req.body.email,
        [TableFields.message]: req.body.message,
      });
      return result;
    });
  };
  static getMessages = (req) => {
    return new ProjectionBuilder(async function () {
      const filter = {};
      const page   = +req.query.page;
      const limit  = +req.query.limit;
      console.log("page limit", page, limit);
      const pageOption = {};
      if (page && limit) {
        const skip = (page - 1) * limit;
        pageOption.skip = skip;
        pageOption.limit = limit;
      }
      if (req.query.name) {
        filter.name = {
          $regex: req.query.name,
          $options: "i",
        };
      } 
      return await message.find(filter, this, pageOption);
    });
  };

  static deleteMessage = (req) => {
    return new ProjectionBuilder(async function () {
      return await message.findByIdAndDelete(req.params.messageId);
    });
  };

  static getMessageCount = () => {
    return new ProjectionBuilder(async function () {
      return await message.find({}).count();
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
    this.withEmail = () => {
      projection[TableFields.email] = 1;
      return this;
    };
    this.withName = () => {
      projection[TableFields.name] = 1;
      return this;
    };
    this.withMessage = () => {
      projection[TableFields.message] = 1;
      return this;
    };
    this.withCreatedAt = () => {
      projection[TableFields.createdAt] = 1;
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
module.exports = MessageService;
