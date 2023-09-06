const { check } = require("express-validator");
const NewsFeedService = require("../../db/services/NewsFeedService");
const OccasionService = require("../../db/services/OccasionService");
const { ApiResponseCode } = require("../../utils/constants");
const Utils = require('../../utils/utils');
exports.getAllOccasionType = async (req, res) => {
  try {
    const occasions = await OccasionService.getAllOccasion().execute();
    res.json({
      status: ApiResponseCode.ResponseSuccess,
      result: {
        data: occasions,
        message: "Successful",
      },
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: ApiResponseCode.ResponseFail,
      result: {
        data: [],
        message: error.message,
      },
    });
  }
};

exports.getAllNewsFeed = async (req, res, next) => {
  try {
    const feeds = await NewsFeedService.getAllNewsFeed().execute();
    console.log(feeds);
    res.json({
      status: ApiResponseCode.ResponseSuccess,
      results: feeds,
    });
  } catch (error) {
    res.json({
      status: ApiResponseCode.ResponseFail,
      error: error.message,
    });
  }
};

exports.getAllCandleType = async (req, res) => {};

exports.sendMessage = async (req, res) => {
  try {
    Utils.sendMail({
      to: 'admin@gmail.com',
      subject: 'New Message',
      text: req.body.message
    });
     res.json({
       status: ApiResponseCode.ResponseSuccess,
       result:'Message sent !!'
     });
  } catch (error) {
    res.json({
      status: ApiResponseCode.ResponseFail,
      error:error.message
     })
  }
};
exports.validate = (method) => {
  switch (method) {
    case "sendMessage": {
      return [
        check("email", "Invalid email").exists().isEmail(),
        check("message", "Invalid message").exists(),
      ];
    }
    case "default":
      return [];
    default:
      return [];
  }
};
