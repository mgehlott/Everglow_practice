const { TableFields } = require("../../utils/constants");
const campaign = require("../models/campaign");
const Utils = require("../../utils/utils");
const storage = require("../../utils/storage");
const { Folders } = require("../../utils/metadata");

class CampaignService {
  static createCampaign = (req) => {
    return new ProjectionBuilder(async function () {
      const date = Utils.getDateFormat(req.body[TableFields.startDate]);
      const creator = {
        [TableFields.name]: req.user[TableFields.name],
        [TableFields.email]: req.user[TableFields.email],
        [TableFields.userId]: req.user[TableFields.ID],
      };
      const newCampaign = new campaign();
      newCampaign[TableFields.creator] = creator;
      newCampaign[TableFields.candleType] = req.body[TableFields.candleType];
      newCampaign[TableFields.occasionType] =
        req.body[TableFields.occasionType];
      newCampaign[TableFields.visibility] = req.body[TableFields.visibility];
      newCampaign[TableFields.title] = req.body[TableFields.title];
      newCampaign[TableFields.description] = req.body[TableFields.description];
      newCampaign[TableFields.isCommentAllow] =
        req.body[TableFields.isCommentAllow];
      newCampaign[TableFields.startDate] = date;
      newCampaign[TableFields.duration] = req.body[TableFields.duration];
      if (newCampaign) {
        try {
          const filename = await storage.addFile(
            Folders.CampaignImage,
            req.file.originalname,
            req.file.buffer
          );
          newCampaign[TableFields.image] = filename;
          return await newCampaign.save();
        } catch (error) {
          console.log(error);
          throw error;
        }
      }
    });
  };

  static getCampaignById = (id) => {
    return new ProjectionBuilder(async function () {
      return await campaign.findById(id, this);
    });
  };
  static addComment = (req) => {
    return new ProjectionBuilder(async function () {
      const data = {
        [TableFields.name]: req.body.name,
        [TableFields.description]: req.body.description,
      };
      if (req.user) {
        data[TableFields.userId] = req.user._id;
      }
      const campaign = await campaign.findByIdAndUpdate(req.params.campaignId, {
        $push: { [TableFields.comments]: data },
      });
      return campaign;
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
    this.withCreator = () => {
      projection[TableFields.creator] = 1;
      return this;
    };
    this.withOccasionAndCandleType = () => {
      projection[TableFields.occasionType] = 1;
      projection[TableFields.candleType] = 1;
      return this;
    };
    this.withBasicInfo = () => {
      projection[TableFields.title] = 1;
      projection[TableFields.description] = 1;
      projection[TableFields.image] = 1;
      projection[TableFields.isCommentAllow] = 1;
      projection[TableFields.visibility] = 1;
      return this;
    };
    this.withDateAndDuration = () => {
      projection[TableFields.startDate] = 1;
      projection[TableFields.duration] = 1;
      return this;
    };
    this.withLink = () => {
      projection[TableFields.link] = 1;
      return this;
    };
    this.withComments = () => {
      projection[TableFields.comments] = 1;
      return this;
    };
    this.withJoinedUser = () => {
      projection[TableFields.joinedUsers] = 1;
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

module.exports = CampaignService;
