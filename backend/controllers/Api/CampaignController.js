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
    console.log("created", newCampaign);
    if (newCampaign) {
      return res.json({
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
      req.params.campaignId
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
    const updatedCampaign = await CampaignService.addComment(req).execute();
    console.log(updatedCampaign);
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

exports.deleteComment = async (req, res) => {
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
    const update = await CampaignService.deleteComment(req).execute();
    console.log("deleted", update);
    if (update) {
      res.json({
        status: ApiResponseCode.ResponseSuccess,
        result: "deleted",
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

exports.getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await CampaignService.getAllCampaign(req).execute();
    res.status(ApiResponseCode.ResponseSuccess).json({
      status: ApiResponseCode.ResponseSuccess,
      data: campaigns,
    });
  } catch (error) {
    res.status(ApiResponseCode.ResponseFail).json({
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
    case "deleteComment": {
      return [check("campaignId", "Invalid campaign id").exists()];
    }

    case "default":
      return [];
    default:
      return [];
  }
};
