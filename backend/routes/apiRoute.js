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

  app.put(
    "/api/updateProfile",
    ApiAuthMiddleware.auth,
    UserAuthController.validate("updateProfile"),
    UserAuthController.updateProfile
  );

  // ----------- occasion ----------

  app.get(
    "/api/getAllOccasion",
    ApiAuthMiddleware.auth,
    ApiController.getAllOccasionType
  );

  //-------------candle -----------
  app.get(
    "/api/getCandlesType",
    ApiAuthMiddleware.auth,
    ApiController.getAllCandleType
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

  // app.post(
  //   "/api/addComment",
  //   ApiAuthMiddleware.auth,
  //   CampaignController.validate("addComment"),
  //   CampaignController.addComment
  // );
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

  app.patch(
    "/api/forgotPassword",
    AdminAuthController.validate("forgotPassword"),
    AdminAuthController.forgotPassword
  );

  app.patch(
    "/api/verifyForgotPasswordRequest",
    UserAuthController.validate("confirmForgotPasswordRequest"),
    UserAuthController.confirmForgotPasswordRequest
  );

  app.patch(
    "/api/updateForgotPassword",
    UserAuthController.validate("forgetAndUpdatePassword"),
    UserAuthController.forgetAndUpdatePassword
  );

  //------------- message -------------
  app.post(
    "/api/sendMessage",
    ApiAuthMiddleware.auth,
    ApiController.validate("sendMessage"),
    ApiController.sendMessage
  );

  // ------------- other routes -----------
  app.get("/api/aboutUs", ApiController.getAboutUs);
  app.get("/api/privacyPolicy", ApiController.getPrivacyPolicy);
  app.get("/api/termsAndCondition", ApiController.getTermsAndCondition);
};

module.exports = router;
