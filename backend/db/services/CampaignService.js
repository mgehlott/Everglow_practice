const { TableFields } = require("../../utils/constants");
const campaign = require("../models/campaign");
const Utils = require("../../utils/utils");
const storage = require("../../utils/storage");
const { Folders } = require("../../utils/metadata");
const CandleService = require("./CandleService");

class CampaignService {
  static createCampaign = (req) => {
    return new ProjectionBuilder(async function () {
      console.log("date", req.body.startDate);
      const date = Utils.getDateFormat(req.body[TableFields.startDate]);
      const creator = {
        [TableFields.name]: req.user[TableFields.name],
        [TableFields.email]: req.user[TableFields.email],
        [TableFields.userId]: req.user[TableFields.ID],
      };
      console.log("creator", creator);
      const newCampaign = new campaign();
      newCampaign[TableFields.creator] = creator;
      console.log(JSON.parse(req.body[TableFields.candleType]));
      console.log(JSON.parse(req.body[TableFields.occasionType]));
      newCampaign[TableFields.candleType] = JSON.parse(
        req.body[TableFields.candleType]
      );
      newCampaign[TableFields.occasionType] = JSON.parse(
        req.body[TableFields.occasionType]
      );
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
          console.log(filename);

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
      return await campaign.aggregate([
        {
          $addFields: {
            imageUrl: {
              $concat: [
                storage.getUrlParentDir(Folders.CampaignImage),
                "$image",
              ],
            },
          },
        },
      ]);
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
      console.log(req.params.campaignId);
      const result = await campaign.findByIdAndUpdate(
        req.params.campaignId,
        {
          $push: { [TableFields.comments]: data },
        },
        { new: true }
      );
      console.log("res", result);
      return result;
    });
  };

  static deleteComment = (req) => {
    return new ProjectionBuilder(async function () {
      const campaignId = req.body.campaignId;
      const commentId = req.params.commentId;
      console.log(campaignId, commentId);
      return await campaign.findByIdAndUpdate(campaignId, {
        $pull: {
          [TableFields.comments]: { [TableFields.ID]: commentId },
        },
      });
    });
  };

  static deleteCandle = (id) => {
    return new ProjectionBuilder(async function () {
      return await campaign.updateMany(
        {
          "candleType.candleId": id,
        },
        {
          $set: {
            [TableFields.candleType]: null,
          },
        }
      );
    });
  };
  static updateCandles = (req) => {
    return new ProjectionBuilder(async function () {
      const fetchedCandle = await CandleService.getCandleById(
        req.params.candleId
      );
      return await campaign.updateMany(
        {
          "candleType.candleId": req.params.candleId,
        },
        {
          $set: {
            [TableFields.candleType]: {
              [TableFields.title]: req.body.title,
              [TableFields.icon]: fetchedCandle[TableFields.icon],
            },
          },
        }
      );
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
      console.log("resturn");
      return await methodToExecute.call(projection);
    };
  }
}

module.exports = CampaignService;
