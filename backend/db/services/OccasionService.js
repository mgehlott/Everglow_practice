const { TableFields } = require("../../utils/constants");
const occasion = require("../models/occasion");

class OccasionService {
  static getAllOccasion = () => {
    return new ProjectionBuilder(async function () {
      return await occasion.find({}, this);
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
