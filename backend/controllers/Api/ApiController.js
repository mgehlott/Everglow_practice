const { check } = require("express-validator");
const NewsFeedService = require("../../db/services/NewsFeedService");
const OccasionService = require("../../db/services/OccasionService");
const { ApiResponseCode } = require("../../utils/constants");
const Utils = require("../../utils/utils");
const req = require("express/lib/request");
const CandleService = require("../../db/services/CandleService");
const path = require("path");
const fs = require("fs");

exports.getAllOccasionType = async (req, res) => {
  try {
    const occasions = await OccasionService.getAllOccasion().execute();
    res.status(ApiResponseCode.ResponseSuccess).json({
      status: ApiResponseCode.ResponseSuccess,
      data: occasions,
    });
  } catch (error) {
    console.log(error);
    res.status(ApiResponseCode.ResponseFail).json({
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
    const feeds = await NewsFeedService.getAllNewsFeed(req).execute();
    console.log(feeds);
    res.status(ApiResponseCode.ResponseSuccess).json({
      status: ApiResponseCode.ResponseSuccess,
      data: feeds,
    });
  } catch (error) {
    res.status(ApiResponseCode.ResponseFail).json({
      status: ApiResponseCode.ResponseFail,
      error: error.message,
    });
  }
};

exports.getAllCandleType = async (req, res) => {
  try {
    const candles = await CandleService.getAllCandles().execute();
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
    Utils.sendMail({
      to: "admin@gmail.com",
      subject: "New Message",
      text: req.body.message,
    });
    res.json({
      status: ApiResponseCode.ResponseSuccess,
      result: "Message sent !!",
    });
  } catch (error) {
    res.json({
      status: ApiResponseCode.ResponseFail,
      error: error.message,
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

exports.getAllCampaigns = async (req, res) => {
  try {
  } catch (error) {}
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
