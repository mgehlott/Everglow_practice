const { TableFields } = require("../../utils/constants");
const newsfeed = require("../models/newsfeed");
const storage = require("../../utils/storage");
const { Folders } = require("../../utils/metadata");

class NewsFeedService {
  static addNewsFeed = (req) => {
    return new ProjectionBuilder(async function () {
      const feed = new newsfeed();
      feed[TableFields.title] = req.body.title;
      feed[TableFields.description] = req.body.description;
      console.log("ff", feed);

      try {
        if (req.file) {
          const filename = await storage.addFile(
            Folders.NewsFeedImage,
            req.file.originalname,
            req.file.buffer
          );
          console.log("image added", filename);
          feed[TableFields.image] = filename;
        }
        console.log("return");
        return await feed.save();
      } catch (error) {
        console.log(error);
        throw error;
      }
    });
  };
  static getAllNewsFeed = (req) => {
    return new ProjectionBuilder(async function () {
      try {
        const pipeline = [];
        console.log("feed query", req.query);
        if (req.query.searchTerm && req.query.searchTerm.length > 0) {
          const matchStage = {
            $match: {
              [TableFields.title]: {
                $regex: req.query.searchTerm,
                $options: "i",
              },
            },
          };
          pipeline.push(matchStage);
        }

        pipeline.push({
          $addFields: {
            imageUrl: {
              $concat: [
                storage.getUrlParentDir(Folders.NewsFeedImage),
                "$image",
              ],
            },
          },
        });
        
        const page = +req.query.page;
        const limit = +req.query.limit;
        console.log("query", req.query, limit);
        if (page && limit) {
          const skip = (page - 1) * limit;
          pipeline.push({ $skip: skip }, { $limit: limit });
        }
        console.log("newsfeed", pipeline);
        const feeds = await newsfeed.aggregate(pipeline);
        return feeds;
      } catch (error) {
        throw error;
      }
    });
  };

  static updateNewsFeed = (req) => {
    return new ProjectionBuilder(async function () {
      const currFeed = await newsfeed.findById(req.params.newsFeedId);
      if (!currFeed) throw new Error("Invalid Newfeed Id");
      if (req.body.title) {
        currFeed[TableFields.title] = req.body.title;
      }
      if (req.body.description) {
        currFeed[TableFields.description] = req.body.description;
      }
      if (req.file) {
        if (currFeed[TableFields.image].length > 0) {
          const deleteImage = storage.removeFile(
            Folders.NewsFeedImage,
            currFeed[TableFields.image]
          );
          console.log("newsfeed image delete", deleteImage);
        }
        const filename = await storage.addFile(
          Folders.NewsFeedImage,
          req.file.originalname,
          req.file.buffer
        );
        console.log("image added to newsfeed", filename);
        currFeed[TableFields.image] = filename;
      }
      console.log("updated feed", currFeed);
      return await currFeed.save();
    });
  };

  static deleteNewsFeed = (params) => {
    return new ProjectionBuilder(async function () {
      try {
        const feed = await newsfeed.findByIdAndDelete(params);
        console.log("feed deleted", feed);
        if (feed && feed[TableFields.image].length > 0) {
          const deletedImage = await storage.removeFile(
            Folders.NewsFeedImage,
            feed[TableFields.image]
          );
          console.log("image deleted", deletedImage);
        }
        return feed;
      } catch (error) {
        console.log(error);
        throw error;
      }
    });
  };

  static getNewsFeedCount = () => {
    return new ProjectionBuilder(async function () {
      return await newsfeed.find({}).count();
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
    this.withTitleAndDesc = () => {
      projection[TableFields.title] = 1;
      projection[TableFields.description] = 1;
      return this;
    };
    this.withImageAndDate = () => {
      projection[TableFields.image] = 1;
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

module.exports = NewsFeedService;
