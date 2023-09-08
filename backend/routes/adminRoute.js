const AdminAuthController = require("../controllers/AdminAuthController");
const AdminController = require("../controllers/AdminController");
const ImageHandler = require("../middlewares/imageHandler");
const ApiAuthMiddleware = require("../middlewares/apiAuth");
const AuthMiddleware = require("../middlewares/auth");
const CampaignController = require("../controllers/Api/CampaignController");
const UserAuthController = require("../controllers/Api/UserAuthController");

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

  //------------- Comments----------
  app.post(
    "/admin/deleteComment/:commentId",
    AuthMiddleware.adminAuth,
    CampaignController.validate("deleteComment"),
    CampaignController.deleteComment
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

  app.post(
    "/admin/updateCandle/:candleId",
    AuthMiddleware.adminAuth,
    ImageHandler.uploadSingle("icon"),
    AdminController.updateCandle
  );

  //---------occasion -----------
  app.post(
    "/admin/addOccasion",
    AuthMiddleware.adminAuth,
    ImageHandler.uploadSingle("icon"),
    AdminController.validate("addOccasion"),
    AdminController.addOccasion
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
    UserAuthController.validate('forgetAndUpdatePassword'),
    UserAuthController.forgetAndUpdatePassword
  );
};

module.exports = router;
