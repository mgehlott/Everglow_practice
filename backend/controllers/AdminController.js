const { check, validationResult } = require("express-validator");
const Utils = require("../utils/utils");
const NewsFeedService = require("../db/services/NewsFeedService");
const { ApiResponseCode } = require("../utils/constants");
const CandleService = require("../db/services/CandleService");
const CampaignService = require("../db/services/CampaignService");
const OccasionService = require("../db/services/OccasionService");

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
      res.json({
        status: ApiResponseCode.ResponseSuccess,
        result: feed,
      });
    }
  } catch (error) {
    res.json({
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
    console.log(req.params.candleId);
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
    res.json({
      status: ApiResponseCode.ResponseFail,
      result: updated,
    });
  } catch (error) {
    res.json({
      status: ApiResponseCode.ResponseFail,
      error: error.message,
    });
  }
};

exports.addOccasion = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = Utils.extractErrors(errors.array());
    console.log(extractedErrors);
    res.json({
      status: ApiResponseCode.ResponseFail,
      errors: extractedErrors,
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
    default:
      return [];
  }
};
