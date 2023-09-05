const UserAuthController = require("../controllers/Api/UserAuthController");

const router = function (app) {
  //-------user route --------------
  app.post(
    "/api/register",
    UserAuthController.validate("userRegister"),
    UserAuthController.userRegister
  );
};

module.exports = router;
