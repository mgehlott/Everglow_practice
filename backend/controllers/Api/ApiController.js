const { check } = require("express-validator");
const NewsFeedService = require("../../db/services/NewsFeedService");
const OccasionService = require("../../db/services/OccasionService");
const { ApiResponseCode } = require("../../utils/constants");
const Utils = require("../../utils/utils");

const CandleService = require("../../db/services/CandleService");
const path = require("path");
const fs = require("fs");
const MessageService = require("../../db/services/MessageService");

exports.getAllOccasionType = async (req, res) => {
  try {
    const occasions = await OccasionService.getAllOccasion(req).execute();
    const total = await OccasionService.getOccasionsCount().execute();
    res.status(ApiResponseCode.ResponseSuccess).json({
      status: ApiResponseCode.ResponseSuccess,
      data: occasions,
      message: "Occasion fetched successful",
      total: total,
      error: "",
    });
  } catch (error) {
    console.log(error);
    res.status(ApiResponseCode.ResponseFail).json({
      status: ApiResponseCode.ResponseFail,
      error: error.message,
      message: "Occasion fetch failed",
      result: [],
    });
  }
};

exports.getAllNewsFeed = async (req, res, next) => {
  try {
    const feeds = await NewsFeedService.getAllNewsFeed(req).execute();
    const total = await NewsFeedService.getNewsFeedCount().execute();
    console.log(feeds);
    res
      .status(ApiResponseCode.ResponseSuccess)
      .json({
        status: ApiResponseCode.ResponseSuccess,
        data: feeds,
        error: "",
        total: total,
      });
  } catch (error) {
    res.status(ApiResponseCode.ResponseFail).json({
      status: ApiResponseCode.ResponseFail,
      error: error.message,
      result: [],
      message: "Newsfeed fetch failed",
    });
  }
};

exports.getAllCandleType = async (req, res) => {
  try {
    const candles = await CandleService.getAllCandles(req).execute();
    res.json({
      status: ApiResponseCode.ResponseSuccess,
      result: {
        data: candles,
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

exports.sendMessage = async (req, res) => {
  try {
    const result = await MessageService.saveMessage(req).execute();
    if (result) {
      Utils.sendMail({
        to: "admin@gmail.com",
        subject: "New Message",
        text: req.body.message,
      });
      res.status(ApiResponseCode.ResponseSuccess).json({
        status: ApiResponseCode.ResponseSuccess,
        message: "Message sent !!",
        result: result,
        error: "",
      });
    }
  } catch (error) {
    res.status(ApiResponseCode.ResponseFail).json({
      status: ApiResponseCode.ResponseFail,
      error: error.message,
      message: "Message sending fails",
      result: [],
    });
  }
};

exports.getAboutUs = async (req, res) => {
  try {
    const filePath = path.join(
      __dirname,
      "../../",
      "storage",
      "app",
      "aboutUs.txt"
    );
    let pageContent = "";
    if (fs.existsSync(filePath)) {
      pageContent = fs.readFileSync(filePath, "utf-8");
    }
    res.status(ApiResponseCode.ResponseSuccess).json({
      status: ApiResponseCode.ResponseSuccess,
      result: pageContent,
      error: "",
    });
  } catch (error) {
    res.status(ApiResponseCode.ResponseSuccess).json({
      status: ApiResponseCode.ResponseFail,
      error: error.message,
      result: "",
    });
  }
};
exports.getTermsAndCondition = async (req, res) => {
  try {
    const filePath = path.join(
      __dirname,
      "../../",
      "storage",
      "app",
      "termAndCondition.txt"
    );
    let pageContent = "";
    if (fs.existsSync(filePath)) {
      pageContent = fs.readFileSync(filePath, "utf-8");
    }
    res.json({
      status: ApiResponseCode.ResponseSuccess,
      result: pageContent,
    });
  } catch (error) {
    res.json({
      status: ApiResponseCode.ResponseFail,
      error: error.message,
    });
  }
};
exports.getPrivacyPolicy = async (req, res) => {
  try {
    const filePath = path.join(
      __dirname,
      "../../",
      "storage",
      "app",
      "privacyPolicy.txt"
    );
    let pageContent = "";
    if (fs.existsSync(filePath)) {
      pageContent = fs.readFileSync(filePath, "utf-8");
    }
    res.json({
      status: ApiResponseCode.ResponseSuccess,
      result: pageContent,
    });
  } catch (error) {
    res.json({
      status: ApiResponseCode.ResponseFail,
      error: error.message,
    });
  }
};

exports.updateAboutUs = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractErrors = Utils.extractErrors(errors.array());
    console.log(extractErrors);
    return res.status(ApiResponseCode.ValidationMsg).json({
      status: ApiResponseCode.ValidationMsg,
      errors: extractErrors,
    });
  }
  try {
    const filePath = path.join(
      __dirname,
      "../../",
      "storage",
      "app",
      "aboutUs.txt"
    );
    fs.writeFile(filePath, req.body.data, (err) => {
      if (!err) {
        return res.json({
          status: ApiResponseCode.ResponseSuccess,
          result: "About us Updated",
        });
      }
    });
  } catch (error) {
    res.json({
      status: ApiResponseCode.ResponseFail,
      error: error.message,
    });
  }
};

exports.updatePolicy = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractErrors = Utils.extractErrors(errors.array());
    console.log(extractErrors);
    return res.status(ApiResponseCode.ValidationMsg).json({
      status: ApiResponseCode.ValidationMsg,
      errors: extractErrors,
    });
  }

  try {
    const filePath = path.join(
      __dirname,
      "../../",
      "storage",
      "app",
      "privacyPolicy.txt"
    );
    fs.writeFile(filePath, req.body.data, (err) => {
      if (!err) {
        return res.json({
          status: ApiResponseCode.ResponseSuccess,
          result: "Policy updated.",
        });
      }
    });
  } catch (error) {
    res.json({
      status: ApiResponseCode.ResponseFail,
      error: error.message,
    });
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
    case "updateAboutUs": {
      return [check("data", "Invalid data").exists()];
    }
    case "updatePolicy": {
      return [check("data", "Invalid data").exists()];
    }
    case "default":
      return [];
    default:
      return [];
  }
};
