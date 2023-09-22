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
    res.status(ApiResponseCode.ResponseSuccess).json({
      status: ApiResponseCode.ResponseSuccess,
      result: updatedCampaign,
      message: "Comment Added",
      error: "",
    });
  } catch (error) {
    res.status(ApiResponseCode.ResponseFail).json({
      status: ApiResponseCode.ResponseFail,
      error: error.message,
      result: [],
      message: "Comment add failed",
    });
  }
};

exports.getAllComments = async (req, res) => {
  try {
    const comment = await CampaignService.getAllComments(req)
      .withComments()
      .execute();
    console.log("comments", comment);
    const results = [];
    comment.forEach((element) => {
      results.push(...element.comments);
    });
    console.log("result", results);
    const total = results.length;
    return res.status(ApiResponseCode.ResponseSuccess).json({
      status: ApiResponseCode.ResponseSuccess,
      result: results,
      total: total,
      message: "Successful",
      error: "",
    });
  } catch (error) {
    res.status(ApiResponseCode.ResponseFail).json({
      status: ApiResponseCode.ResponseFail,
      result: [],
      message: "Comment fetching failed",
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
      res.status(ApiResponseCode.ResponseSuccess).json({
        status: ApiResponseCode.ResponseSuccess,
        result: [],
        message: "comment deleted",
        error: "",
      });
    } else {
      res.status(ApiResponseCode.ResponseFail).json({
        status: ApiResponseCode.ResponseFail,
        error: "something went wrong",
        result: [],
        message: "Comment deletion failed",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(ApiResponseCode.ResponseFail).json({
      status: ApiResponseCode.ResponseFail,
      error: error.message,
      result: [],
      message: "Something went wrong",
    });
  }
};
exports.allCampaignName = async (req, res, next) => {
  try {
    const campaigns = await CampaignService.getAllCampaign(req)
      .withID()
      .withTitle()
      .execute();
    res.status(ApiResponseCode.ResponseSuccess).json({
      status: ApiResponseCode.ResponseSuccess,
      result: campaigns,
      error: "",
      message: "Campaign Fetch Successful",
    });
  } catch (error) {
    res.status(ApiResponseCode.ResponseFail).json({
      status: ApiResponseCode.ResponseFail,
      result: [],
      error: error.message,
      message: "Campaign Fetch Failed",
    });
  }
};

exports.getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await CampaignService.getAllCampaign(req).execute();
    const total = await (await CampaignService.getCampaignsCount()).execute();
    res.status(ApiResponseCode.ResponseSuccess).json({
      status: ApiResponseCode.ResponseSuccess,
      data: campaigns,
      total: total,
      message: "Campaigns fetched !!",
      error: "",
    });
  } catch (error) {
    res.status(ApiResponseCode.ResponseFail).json({
      status: ApiResponseCode.ResponseFail,
      error: error.message,
      result: [],
      message: "Campaigns fetch failed",
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
