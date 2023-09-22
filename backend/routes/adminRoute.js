const AdminAuthController = require("../controllers/AdminAuthController");
const AdminController = require("../controllers/AdminController");
const ImageHandler = require("../middlewares/imageHandler");
const ApiAuthMiddleware = require("../middlewares/apiAuth");
const AuthMiddleware = require("../middlewares/auth");
const CampaignController = require("../controllers/Api/CampaignController");
const UserAuthController = require("../controllers/Api/UserAuthController");
const ApiController = require("../controllers/Api/ApiController");

const router = function (app) {
  //-------------Authentication--------------------
  app.post(
    "/admin/login",
    AdminAuthController.validate("login"),
    AdminAuthController.login
  );

  //--------- Newsfeed----------------------------
  app.post(
    "/admin/addNewsFeed",
    AuthMiddleware.adminAuth,
    ImageHandler.uploadSingle("image"),
    AdminController.validate("addNewsFeed"),
    AdminController.addNewsFeed
  );

  app.delete(
    "/admin/deleteNewsFeed/:newsFeedId",
    AuthMiddleware.adminAuth,
    AdminController.deleteNewsFeed
  );
  app.patch(
    "/admin/updateNewsFeed/:newsFeedId",
    AuthMiddleware.adminAuth,
    ImageHandler.uploadSingle("image"),
    AdminController.updateNewsFeed
  );
  //------------- Comments----------
  app.delete(
    "/admin/deleteComment/:commentId",
    AuthMiddleware.adminAuth,
    CampaignController.validate("deleteComment"),
    CampaignController.deleteComment
  );

  app.get(
    "/admin/comments",
    AuthMiddleware.adminAuth,
    CampaignController.getAllComments
  );
  app.get(
    "/admin/campaignName",
    AuthMiddleware.adminAuth,
    CampaignController.allCampaignName
  );

  //----------- candles ----------
  app.post(
    "/admin/addCandle",
    AuthMiddleware.adminAuth,
    ImageHandler.uploadSingle("icon"),
    AdminController.validate("addCandle"),
    AdminController.addCandle
  );
  app.delete(
    "/admin/deleteCandle/:candleId",
    AuthMiddleware.adminAuth,
    AdminController.deleteCandle
  );

  //--------campaigns -----------
  app.get(
    "/admin/campaigns",
    AuthMiddleware.adminAuth,
    CampaignController.getAllCampaigns
  );
  app.delete(
    "/admin/deleteCampaign/:campaignId",
    AuthMiddleware.adminAuth,
    AdminController.deleteCampaign
  );

  app.post(
    "/admin/updateCandle/:candleId",
    AuthMiddleware.adminAuth,
    ImageHandler.uploadSingle("icon"),
    AdminController.updateCandle
  );
  //-------------users-------------
  app.get(
    "/admin/users",
    AuthMiddleware.adminAuth,
    AdminController.getAllUsers
  );

  app.patch(
    "/admin/deactivateUser/:userId",
    AuthMiddleware.adminAuth,
    AdminController.deactivateUser
  );
  app.patch(
    "/admin/deleteUser/:userId",
    AuthMiddleware.adminAuth,
    AdminController.deleteUser
  );

  //---------occasion -----------
  app.post(
    "/admin/addOccasion",
    AuthMiddleware.adminAuth,
    ImageHandler.uploadSingle("icon"),
    AdminController.validate("addOccasion"),
    AdminController.addOccasion
  );

  app.get(
    "/admin/getAllOccasion",
    AuthMiddleware.adminAuth,
    ApiController.getAllOccasionType
  );

  app.patch(
    "/admin/updateOccasion/:occasionId",
    AuthMiddleware.adminAuth,
    ImageHandler.uploadSingle("icon"),
    AdminController.updateOccasion
  );
  // -------------- messages ---------
  app.get(
    "/admin/getMessages",
    AuthMiddleware.adminAuth,
    AdminController.getAllMessages
  );
  app.delete(
    "/admin/deleteMessage/:messageId",
    AuthMiddleware.adminAuth,
    AdminController.deleteMessage
  );

  // --------- password ----------
  app.patch(
    "/admin/updatePassword",
    AuthMiddleware.adminAuth,
    AdminAuthController.validate("changePassword"),
    AdminAuthController.changePassword
  );

  app.post(
    "/admin/forgotPassword",
    AdminAuthController.validate("forgotPassword"),
    AdminAuthController.forgotPassword
  );

  app.post(
    "admin/confirmCode",
    UserAuthController.validate("confirmCode"),
    UserAuthController.confirmCode
  );
  app.post(
    "admin/forgotUpdatePassword",
    UserAuthController.validate("forgetAndUpdatePassword"),
    UserAuthController.forgetAndUpdatePassword
  );

  //---------- other -------------

  app.post(
    "/admin/updateAboutUs",
    AuthMiddleware.adminAuth,
    AdminController.validate("updateAboutUs"),
    AdminController.updateAboutUs
  );

  app.post(
    "/admin/updatePrivacyPolicy",
    AuthMiddleware.adminAuth,
    AdminController.validate("updatePolicy"),
    AdminController.updatePolicy
  );
};

module.exports = router;
