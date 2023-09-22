const { check, validationResult } = require("express-validator");
const Utils = require("../utils/utils");
const NewsFeedService = require("../db/services/NewsFeedService");
const { ApiResponseCode } = require("../utils/constants");
const CandleService = require("../db/services/CandleService");
const CampaignService = require("../db/services/CampaignService");
const OccasionService = require("../db/services/OccasionService");
const UserService = require("../db/services/UserService");
const MessageService = require("../db/services/MessageService");
const path = require("path");
const fs = require("fs");

exports.addNewsFeed = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = Utils.extractErrors(errors.array());
    console.log(extractedErrors);
    console.log("error");
    return res.json({
      status: ApiResponseCode.ValidationMsg,
      errors: extractedErrors,
    });
  }
  console.log("file newsfeed", req.file);
  try {
    const feed = await NewsFeedService.addNewsFeed(req).execute();
    console.log("added feed", feed);
    if (feed) {
      res.status(ApiResponseCode.ResponseSuccess).json({
        status: ApiResponseCode.ResponseSuccess,
        result: feed,
      });
    }
  } catch (error) {
    res.status(ApiResponseCode.ResponseSuccess).json({
      status: ApiResponseCode.ResponseFail,
      error: error.message,
    });
  }
};

exports.deleteNewsFeed = async (req, res, next) => {
  if (!req.params.newsFeedId) {
    return res.status(ApiResponseCode.ResponseFail).json({
      status: ApiResponseCode.ResponseFail,
      error: "Invalid feed id",
    });
  }
  try {
    const deletedFeed = await NewsFeedService.deleteNewsFeed(
      req.params.newsFeedId
    ).execute();
    res.status(ApiResponseCode.ResponseSuccess).json({
      status: ApiResponseCode.ResponseSuccess,
      result: "NewsFeed Deleted",
    });
  } catch (error) {
    res.status(ApiResponseCode.ResponseFail).json({
      status: ApiResponseCode.ResponseFail,
      error: error.message,
    });
  }
};

exports.deleteCampaign = async (req, res) => {
  if (!req.params.campaignId) {
    return res.status(ApiResponseCode.ResponseFail).json({
      status: ApiResponseCode.ResponseFail,
      error: "Invalid Campaign id",
    });
  }
  try {
    const deletedCampaign = await CampaignService.deleteCampaign(
      req.params.campaignId
    ).execute();
    res.status(ApiResponseCode.ResponseSuccess).json({
      status: ApiResponseCode.ResponseSuccess,
      message: "Campaign Deleted",
      result: deletedCampaign,
    });
  } catch (error) {
    res.status(ApiResponseCode.ResponseFail).json({
      status: ApiResponseCode.ResponseFail,
      error: error.message,
    });
  }
};

exports.addCandle = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = Utils.extractErrors(errors.array());
    console.log(extractedErrors);
    res.json({
      status: ApiResponseCode.ResponseFail,
      errors: extractedErrors,
    });
  }

  console.log("candle icon", req.file);
  try {
    const addedCandle = await CandleService.addCandle(req).execute();
    console.log(addedCandle);
    if (addedCandle) {
      res.json({
        status: ApiResponseCode.ResponseSuccess,
        result: addedCandle,
      });
    } else {
      res.json({
        status: ApiResponseCode.ResponseFail,
        error: "something went wrong",
      });
    }
  } catch (error) {
    res.json({
      status: ApiResponseCode.ResponseFail,
      error: error.message,
    });
  }
};

exports.deleteCandle = async (req, res, next) => {
  try {
    if (!req.params.candleId) {
      return res.json({
        status: ApiResponseCode.ResponseFail,
        error: "Invalid candle id",
      });
    }
    //delete from candle collection
    const deleted = await CandleService.deleteCandle(
      req.params.candleId
    ).execute();
    //delete candle from campaign
    await CampaignService.deleteCandle(req.params.candleId);
    res.json({
      status: ApiResponseCode.ResponseFail,
      result: "candle deleted",
    });
  } catch (error) {
    res.json({
      status: ApiResponseCode.ResponseFail,
      error: error.message,
    });
  }
};

exports.updateCandle = async (req, res, next) => {
  try {
    console.log("candle id", req.params.candleId);
    if (!req.params.candleId) {
      console.log(!req.params.candleId);
      return res.json({
        status: ApiResponseCode.ResponseFail,
        error: "Invalid candle id",
      });
    }

    //update from candle collection
    const updated = await CandleService.updateCandle(req).execute();
    //update candle from campaign
    await CampaignService.updateCandles(req).execute();
    res.status(ApiResponseCode.ResponseSuccess).json({
      status: ApiResponseCode.ResponseSuccess,
      result: updated,
      message: "Candle Updated",
    });
  } catch (error) {
    res.json({
      status: ApiResponseCode.ResponseFail,
      error: error.message,
    });
  }
};

exports.updateOccasion = async (req, res, next) => {
  if (!req.params.occasionId) {
    return res.status(ApiResponseCode.ResponseFail).json({
      status: ApiResponseCode.ResponseFail,
      message: "Update Occasion fails",
      error: "Invalid Occasion Id",
    });
  }

  try {
    const updatedOccasion = await OccasionService.updateOccasion(req).execute();
    await CampaignService.updateOccasions(req).execute();
    res.status(ApiResponseCode.ResponseSuccess).json({
      status: ApiResponseCode.ResponseSuccess,
      result: updatedOccasion,
      message: "Occasion Updated",
    });
  } catch (error) {
    console.log("catch -----------", error);
    res.status(ApiResponseCode.ResponseFail).json({
      status: ApiResponseCode.ResponseFail,
      message: "Update Operation Fails",
      error: error.message,
    });
  }
};

exports.updateNewsFeed = async (req, res) => {
  if (!req.params.newsFeedId) {
    return res.status(ApiResponseCode.ResponseFail).json({
      status: ApiResponseCode.ResponseFail,
      message: "Update Newsfeed fails",
      error: "Invalid Newsfeed Id",
    });
  }

  try {
    const updatedFeed = await NewsFeedService.updateNewsFeed(req).execute();
    res.status(ApiResponseCode.ResponseSuccess).json({
      status: ApiResponseCode.ResponseSuccess,
      result: updatedFeed,
      message: "Newsfeed Updated",
      error: "",
    });
  } catch (error) {
    res.status(ApiResponseCode.ResponseFail).json({
      status: ApiResponseCode.ResponseFail,
      message: "Update Newsfeed Fails",
      error: error.message,
    });
  }
};

exports.addOccasion = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = Utils.extractErrors(errors.array());
    console.log(extractedErrors);
    return res.status(ApiResponseCode.ResponseFail).json({
      status: ApiResponseCode.ResponseFail,
      errors: extractedErrors,
      result: [],
    });
  }

  console.log("occasion icon", req.file);
  try {
    const addedOccasion = await OccasionService.addOccasion(req).execute();
    if (addedOccasion) {
      console.log("added occasion", addedOccasion);
      res.json({
        status: ApiResponseCode.ResponseSuccess,
        result: addedOccasion,
      });
    } else {
      res.json({
        status: ApiResponseCode.ResponseFail,
        error: "something went wrong",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: ApiResponseCode.ResponseFail,
      error: error.message,
    });
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    console.log(req.query);
    const allUsers = await UserService.getAllUser(req)
      .withBasicInfo()
      .withEmail()
      .withId()
      .withUserType()
      .withCreationDate()
      .execute();
    //console.log(allUsers);
    const totalUsers = await UserService.getUserCount().execute();
    res.status(ApiResponseCode.ResponseSuccess).json({
      status: ApiResponseCode.ResponseSuccess,
      result: allUsers,
      total: totalUsers,
      error: "",
    });
  } catch (error) {
    res.status(ApiResponseCode.ResponseFail).json({
      status: ApiResponseCode.ResponseFail,
      error: error.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  if (!req.params.userId) {
    return res.status(ApiResponseCode.ResponseFail).json({
      status: ApiResponseCode.ResponseFail,
      result: [],
      message: "Delete user failed",
      error: "Invalid User Id",
    });
  }
  try {
    const updateUser = await UserService.deleteUserById(req).execute();
    console.log(updateUser);
    res.status(ApiResponseCode.ResponseSuccess).json({
      status: ApiResponseCode.ResponseSuccess,
      result: updateUser,
      message: "User Deleted !!",
      error: "",
    });
  } catch (error) {
    res.status(ApiResponseCode.ResponseFail).json({
      status: ApiResponseCode.ResponseFail,
      result: [],
      message: "Delete user failed",
      error: error.message,
    });
  }
};

exports.getAllMessages = async (req, res, next) => {
  try {
    const messages = await MessageService.getMessages(req).execute();
    const total = await MessageService.getMessageCount().execute();
    res.status(ApiResponseCode.ResponseSuccess).json({
      status: ApiResponseCode.ResponseSuccess,
      result: messages,
      total: total,
      error: "",
    });
  } catch (error) {
    res.status(ApiResponseCode.ResponseFail).json({
      status: ApiResponseCode.ResponseFail,
      result: [],
      message: "Something went wrong",
      error: error.message,
    });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    if (!req.params.messageId) {
      return res.status(ApiResponseCode.ResponseFail).json({
        status: ApiResponseCode.ResponseFail,
        result: [],
        error: "Invalid Message Id",
      });
    }
    const result = await MessageService.deleteMessage(req).execute();
    res.status(ApiResponseCode.ResponseSuccess).json({
      status: ApiResponseCode.ResponseSuccess,
      result: [],
      message: "Message deleted",
      error: "",
    });
  } catch (error) {
    res.status(ApiResponseCode.ResponseFail).json({
      status: ApiResponseCode.ResponseFail,
      result: [],
      error: error.message,
    });
  }
};

exports.deactivateUser = async (req, res) => {
  if (!req.params.userId) {
    return res.status(ApiResponseCode.ResponseFail).json({
      status: ApiResponseCode.ResponseFail,
      result: [],
      error: "Invalid User Id",
    });
  }

  try {
    const result = UserService.deactivateUser(req).execute();
    res.status(ApiResponseCode.ResponseSuccess).json({
      status: ApiResponseCode.ResponseSuccess,
      result: result,
      message: "Successful !!",
      error: "",
    });
  } catch (error) {
    res.status(ApiResponseCode.ResponseFail).json({
      status: ApiResponseCode.ResponseFail,
      result: [],
      error: error.message,
    });
  }
};

exports.updateAboutUs = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = Utils.extractErrors(errors.array());
    console.log(extractedErrors);
    return res.status(ApiResponseCode.ResponseFail).json({
      status: ApiResponseCode.ResponseFail,
      errors: extractedErrors,
      result: [],
    });
  }
  try {
    const filePath = path.join(
      __dirname,
      "..",
      "storage",
      "app",
      "aboutUs.txt"
    );

    if (fs.existsSync(filePath)) {
      fs.writeFile(filePath, req.body.data, (err) => {
        if (err) {
          console.log(err);
          throw err;
        }
        console.log("done");
        return res.status(ApiResponseCode.ResponseSuccess).json({
          status: ApiResponseCode.ResponseSuccess,
          message: "About us updated!!",
          error: "",
          result: [],
        });
      });
      console.log("done");
    }
  } catch (error) {
    return res.status(ApiResponseCode.ResponseFail).json({
      status: ApiResponseCode.ResponseFail,
      message: "Update operation failed",
      error: error.message,
      result: [],
    });
  }
};
exports.updatePolicy = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = Utils.extractErrors(errors.array());
    console.log(extractedErrors);
    return res.status(ApiResponseCode.ResponseFail).json({
      status: ApiResponseCode.ResponseFail,
      errors: extractedErrors,
      result: [],
    });
  }
  try {
    const filePath = path.join(
      __dirname,
      "..",
      "storage",
      "app",
      "privacyPolicy.txt"
    );

    if (fs.existsSync(filePath)) {
      fs.writeFile(filePath, req.body.data, (err) => {
        if (err) {
          console.log(err);
          throw err;
        }
        console.log("done");
        return res.status(ApiResponseCode.ResponseSuccess).json({
          status: ApiResponseCode.ResponseSuccess,
          message: "Policy updated!!",
          error: "",
          result: [],
        });
      });
      console.log("done");
    }
  } catch (error) {
    return res.status(ApiResponseCode.ResponseFail).json({
      status: ApiResponseCode.ResponseFail,
      message: "Update operation failed",
      error: error.message,
      result: [],
    });
  }
};

exports.validate = (method) => {
  switch (method) {
    case "addNewsFeed": {
      return [
        check("title", "Invalid title").exists(),
        check("description", "Invalid description").exists(),
      ];
    }
    case "addCandle": {
      return [check("title", "Invalid title").exists()];
    }
    case "addOccasion": {
      return [
        check("title", "Invalid title").exists(),
        check("color", "Invalid color").exists(),
      ];
    }
    case "updateAboutUs": {
      return [check("data", "Invalid about us text").exists()];
    }
    case "updatePolicy": {
      return [check("data", "Invalid about us text").exists()];
    }
    default:
      return [];
  }
};
