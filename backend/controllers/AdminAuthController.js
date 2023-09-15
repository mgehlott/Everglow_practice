const { check, validationResult } = require("express-validator");
const Utils = require("../utils/utils");
const { ApiResponseCode, TableFields } = require("../utils/constants");
const UserService = require("../db/services/UserService");
const { UserTypes } = require("../utils/constants");

exports.login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = Utils.extractErrors(errors.array());
    console.log(extractedErrors);
    return res.status(ApiResponseCode.ResponseFail).json({
      status: ApiResponseCode.ResponseFail,
      error: extractedErrors[0],
    });
  }
  try {
    const user = await UserService.getUserByEmail(req.body.email).execute();
    console.log(user);
    if (user && user[TableFields.userType].includes(UserTypes.Admin)) {
      const isValidPassword = await user.isValidPassword(req.body.password);
      const tempUser = user.toObject();
      delete tempUser[TableFields.password];
      if (isValidPassword) {
        const token = user.createAuthToken();
        res.status(ApiResponseCode.ResponseSuccess).json({
          status: ApiResponseCode.ResponseSuccess,
          user: tempUser,
          token: token,
        });
      } else {
        res.status(ApiResponseCode.ResponseFail).json({
          status: ApiResponseCode.ResponseFail,
          error: "Invalid password",
        });
      }
    } else {
      res.status(ApiResponseCode.ResponseFail).json({
        status: ApiResponseCode.ResponseFail,
        error: "Invalid email",
      });
    }
  } catch (error) {
    console.log(errors);
    res.json({
      status: ApiResponseCode.ResponseFail,
      error: error.message,
    });
  }
};

exports.changePassword = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = Utils.extractErrors(errors.array());
    console.log(extractedErrors);
    return res.json({
      status: ApiResponseCode.ResponseFail,
      errors: extractedErrors,
    });
  }
  try {
    const updateUser = await UserService.changePassword(req).execute();
    console.log(updateUser);
    if (updateUser) {
      res.json({
        status: ApiResponseCode.ResponseSuccess,
        result: "password updated !!",
      });
    } else {
      res.json({
        status: ApiResponseCode.ResponseFail,
        result: "something went wrong !!",
      });
    }
  } catch (error) {
    res.json({
      status: ApiResponseCode.ResponseFail,
      error: error.message,
    });
  }
};

exports.forgotPassword = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = Utils.extractErrors(errors.array());
    console.log(extractedErrors);
    return res.json({
      status: ApiResponseCode.ResponseFail,
      errors: extractedErrors,
    });
  }
  try {
    const user = await UserService.getUserByEmail(req.body.email).execute();
    if (!user) {
      return res.json({
        status: ApiResponseCode.ResponseFail,
        error: "Email is not registered",
      });
    }
    const otp = Math.floor(1000 + Math.random() * 9000);
    Utils.sendMail({
      to: req.body.email,
      subject: "Forgot password request !!",
      text: "",
      html: `<p> Please verify code to reset password : ${otp}</p>`,
    });
    user[TableFields.verificationCode] = otp;
    await user.save();
    res.json({
      status: 200,
      result: "Confirm code have send !!",
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
    case "login": {
      return [
        check("email", "Invalid email").exists().isEmail(),
        check("password", "Invalid password").exists().isLength({ min: 4 }),
      ];
    }
    case "changePassword": {
      return [
        check("currentPassword", "Invalid current password")
          .exists()
          .isLength({ min: 4 }),
        check("password", "Invalid password").exists().isLength({ min: 4 }),
      ];
    }
    case "forgotPassword": {
      return [check("email", "Invalid email").exists().isEmail()];
    }

    default:
      return [];
  }
};
