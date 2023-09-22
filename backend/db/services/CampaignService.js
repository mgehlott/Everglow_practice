const { TableFields } = require("../../utils/constants");
const campaign = require("../models/campaign");
const Utils = require("../../utils/utils");
const storage = require("../../utils/storage");
const { Folders } = require("../../utils/metadata");
const CandleService = require("./CandleService");
const OccasionService = require("./OccasionService");
const mongoose = require("mongoose");

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
      console.log("campagin", newCampaign);
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

  static deleteCampaign = (id) => {
    return new ProjectionBuilder(async function () {
      try {
        console.log("campaign delete");
        const deletedCampaign = await campaign.findByIdAndDelete(id);
        console.log("campaign deleted", deletedCampaign);
        if (deletedCampaign && deletedCampaign[TableFields.image].length > 0) {
          const isImageDeleted = await storage.removeFile(
            Folders.CampaignImage,
            deletedCampaign[TableFields.image]
          );
          console.log("campaign image deleted", isImageDeleted);
        }
      } catch (error) {
        throw error;
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
      console.log(req.params.campaignId);
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

  static getAllComments = (req) => {
    return new ProjectionBuilder(async function () {
      const pipeline = [];
      pipeline.push({
        $addFields: {
          "comments.campaign": "$title",
          "comments.campaignId": "$_id",
        },
      });
      if (req.query.campaign) {
        pipeline.push({
          $match: {
            _id: new mongoose.Types.ObjectId(req.query.campaign),
          },
        });
      }
      console.log(pipeline);
      if (req.query.campaign) {
        console.log(await campaign.find({ _id: req.query.campaign }));
      }
      return await campaign.aggregate(pipeline).project(this);
    });
  };

  static getCommentsCount = async (req) => {
    // const campaigns = await campaign.findById(
    //   new mongoose.Types.ObjectId(req.query.campaignId)
    // );
    // return await campaign[TableFields.comments].count();
  };

  static deleteComment = (req) => {
    return new ProjectionBuilder(async function () {
      console.log(req.body.campaignId, req.params.commentId);
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
      console.log(
        "campaing candle",
        await campaign.find({
          "candleType.candleId": req.params.candleId,
        })
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
  static updateOccasions = (req) => {
    return new ProjectionBuilder(async function () {
      const fetchedOccasion = await OccasionService.getOccasionById(
        req.params.occasionId
      ).execute();
      console.log(
        "log",
        await campaign.find({
          "occasionType.occasionId": req.params.occasionId,
        })
      );
      console.log("fetched occasion", fetchedOccasion);
      const updateDoc = {
        [TableFields.title]: fetchedOccasion[TableFields.title],
        [TableFields.icon]: fetchedOccasion[TableFields.icon],
        [TableFields.occasionId]: fetchedOccasion[TableFields.ID],
      };

      return await campaign.updateMany(
        {
          "occasionType.occasionId": req.params.occasionId,
        },
        {
          $set: {
            [TableFields.occasionType]: updateDoc,
          },
        }
      );
    });
  };
  static getAllCampaign = (req) => {
    return new ProjectionBuilder(async function () {
      try {
        const pipeline = [];
        console.log(req.query);
        const matchQuery = {};

        if (req.query.searchTerm && req.query.searchTerm.length > 0) {
          matchQuery[TableFields.title] = {
            $regex: req.query.searchTerm,
            $options: "i",
          };
        }
        if (req.query.startDate && req.query.startDate.length > 0) {
          matchQuery[TableFields.startDate] = {
            $gte: new Date(req.query.startDate),
          };
        }
        if (Object.keys(matchQuery).length > 0) {
          pipeline.push({
            $match: matchQuery,
          });
        }
        pipeline.push({
          $addFields: {
            imageUrl: {
              $concat: [
                storage.getUrlParentDir(Folders.CampaignImage),
                "$image",
              ],
            },
          },
        });
        const page = +req.query.page;
        const limit = +req.query.limit;
        if (page && limit) {
          const skip = (page - 1) * limit;
          pipeline.push({ $skip: skip }, { $limit: limit });
        }
        const results = await campaign.aggregate(pipeline);
        return results;
      } catch (error) {
        throw error;
      }
    });
  };

  static getCampaignsCount = async () => {
    return new ProjectionBuilder(async function () {
      return await campaign.find({}).count();
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
    this.withTitle = () => {
      projection[TableFields.title] = 1;
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
