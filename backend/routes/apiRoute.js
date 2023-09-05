const UserAuthController = require("../controllers/Api/UserAuthController");
const ApiAuthMiddleware = require("../middlewares/apiAuth");
const CampaignController = require("../controllers/Api/CampaignController");
const ApiController = require("../controllers/Api/ApiController");
const ImageHandler = require("../middlewares/imageHandler");
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
  app.get("/api/getCampaign", CampaignController.getCampaign);

  app.post(
    "/api/addComment",
    ApiAuthMiddleware.auth,
    CampaignController.validate("addComment"),
    CampaignController.addComment
  );
  app.post(
    "/api/addGuestComment",
    CampaignController.validate("addComment"),
    CampaignController.addComment
  );
  //----occasion router------------------
  app.get(
    "/api/occasion",
    ApiAuthMiddleware.auth,
    ApiController.getAllOccasionType
  );
};

module.exports = router;
