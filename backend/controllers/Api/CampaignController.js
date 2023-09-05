const { validationResult, check } = require("express-validator");
const { ApiResponseCode } = require("../../utils/constants");
const Utils = require("../../utils/utils");
const CampaignService = require("../../db/services/CampaignService");

exports.createCampaign = async (req, res) => {
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
  console.log("file", req.file);
  try {
    const newCampaign = await CampaignService.createCampaign(req).execute();
    if (newCampaign) {
      res.json({
        status: ApiResponseCode.ResponseSuccess,
        result: newCampaign,
      });
    }
  } catch (error) {
    res.json({
      status: ApiResponseCode.ResponseFail,
      result: "",
      message: error.message,
    });
  }
};

exports.getCampaign = async (req, res) => {
  try {
    const campaign = await CampaignService.getCampaignById(
      req.body.campaignId
    ).execute();
    res.json({
      status: ApiResponseCode.ResponseSuccess,
      result: campaign,
    });
  } catch (error) {
    res.json({
      status: ApiResponseCode.ResponseFail,
      result: "",
      error: error.message,
    });
  }
};

exports.addComment = async (req, res) => {
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
  try {
    const updatedCampaign = CampaignService.addComment(req);
    res.json({
      status: ApiResponseCode.ResponseSuccess,
      result: updatedCampaign,
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
    case "createCampaign": {
      return [
        check("occasionType", "Invalid occasion type").exists(),
        check("candleType", "Invalid candle type").exists(),
        check("visibility", "Invalid visibility mode").exists(),
        check("title", "Invalid title").exists(),
        check("description", "Invalid description").exists(),
        check("isCommentAllow", "Invalid value in comment allow").exists(),
        check("startDate", "Invalid startDate").exists(),
        check("duration", "Invalid duration").exists(),
      ];
    }
    case "addComment": {
      return [
        check("name", "Invalid user name").exists(),
        check("description", "Invalid description").exists(),
      ];
    }

    case "default":
      return [];
    default:
      return [];
  }
};
