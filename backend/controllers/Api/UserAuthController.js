const { check } = require("express-validator");
const { validationResult } = require("express-validator");
const Utils = require("../../utils/utils");
const { ApiResponseCode, TableFields } = require("../../utils/constants");
const UserService = require("../../db/services/UserService");

exports.userRegister = async (req, res, next) => {
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
    const user = await UserService.getUserByEmail(
      req.body[TableFields.email]
    ).execute();
    console.log("user ", user);
    if (user) {
      return res.json({
        status: ApiResponseCode.ValidationMsg,
        message: "Email is already exit",
      });
    } else {
      const newUser = await UserService.createUser(req).execute();
      const token = newUser.createAuthToken();
      return res.json({
        status: ApiResponseCode.ResponseSuccess,
        result: { user: newUser[TableFields.ID], token: token },
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: ApiResponseCode.ResponseFail,
      message: error.message,
    });
  }
};

exports.validate = (method) => {
  switch (method) {
    case "userRegister": {
      return [
        check("firstName", "Please enter first name").exists(),
        check("lastName", "Please enter last name").exists(),
        check("email", "Please enter email").exists().isEmail(),
        check("password", "Password length must be greater than 3")
          .exists()
          .isLength({ min: 4 }),
      ];
    }
    case "default":
      return [];
    default:
      return [];
  }
};
