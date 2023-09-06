const UserAuthController = require("../controllers/Api/UserAuthController");
const ApiAuthMiddleware = require("../middlewares/apiAuth");
const CampaignController = require("../controllers/Api/CampaignController");
const ApiController = require("../controllers/Api/ApiController");
const ImageHandler = require("../middlewares/imageHandler");
const AdminAuthController = require("../controllers/AdminAuthController");
const { TableFields } = require("../utils/constants");

const router = function (app) {
  //-------user route --------------
  app.post(
    "/api/register",
    UserAuthController.validate("userRegister"),
    UserAuthController.userRegister
  );
  app.post(
    "/api/login",
    UserAuthController.validate("login"),
    UserAuthController.login
  );
  app.post(
    "/api/confirmCode",
    UserAuthController.validate("confirmCode"),
    UserAuthController.confirmCode
  );

  //------- campaign route ------------
  app.post(
    "/api/createCampaign",
    ApiAuthMiddleware.auth,
    ImageHandler.uploadSingle([TableFields.image]),
    CampaignController.validate("createCampaign"),
    CampaignController.createCampaign
  );
  app.get("/api/getCampaign/:campaignId", CampaignController.getCampaign);

  app.post(
    "/api/addComment",
    ApiAuthMiddleware.auth,
    CampaignController.validate("addComment"),
    CampaignController.addComment
  );
  app.post(
    "/api/addGuestComment/:campaignId",
    CampaignController.validate("addComment"),
    CampaignController.addComment
  );
  app.post(
    "/api/addComment/:campaignId",
    ApiAuthMiddleware.auth,
    CampaignController.validate("addComment"),
    CampaignController.addComment
  );
  //----occasion router------------------
  app.get(
    "/api/occasion",
    ApiAuthMiddleware.auth,
    ApiController.getAllOccasionType
  );

  //-------------- newsfeed--------
  app.get("/api/newsfeed", ApiController.getAllNewsFeed);

  //--------password --------------------
  app.post(
    "/api/updatePassword",
    ApiAuthMiddleware.auth,
    AdminAuthController.validate("changePassword"),
    AdminAuthController.changePassword
  );

  app.post(
    "/api/forgotPassword",
    AdminAuthController.validate("forgotPassword"),
    AdminAuthController.forgotPassword
  );

  //------------- message -------------
  app.post(
    "/api/sendMessage",
    ApiAuthMiddleware.auth,
    ApiController.validate("sendMessage"),
    ApiController.sendMessage
  );
};

module.exports = router;
