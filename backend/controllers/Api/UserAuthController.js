const { validationResult, check } = require("express-validator");
const Utils = require("../../utils/utils");
const {
  ApiResponseCode,
  TableFields,
  UserTypes,
} = require("../../utils/constants");
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
    console.log("user ", user?.firstName);
    if (user) {
      return res.json({
        status: ApiResponseCode.ResponseFail,
        message: "Email is already exit",
      });
    } else {
      const newUser = await UserService.createUser(req).execute();
      //  const token = newUser.createAuthToken();

      return res.json({
        status: ApiResponseCode.ResponseSuccess,
        result: { user: newUser[TableFields.ID] },
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

exports.confirmCode = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = Utils.extractErrors(errors.array());
    console.log(extractedErrors);
    res.json({
      status: ApiResponseCode.ValidationMsg,
      errors: extractedErrors,
    });
  }

  try {
    // fetch user by email and verification code
    const user = await UserService.confirmCode(
      req.body.email,
      req.body.verificationCode
    )
      .withId()
      .withEmail()
      .withBasicInfo()
      .withUserType()
      .withVerificationCode()
      .execute();
    if (user) {
      const response = { message: "Verification Successful !!" };
      if (user[TableFields.userType].includes(UserTypes.Verified)) {
        const token = user.createAuthToken();
        response.token = token;
      }

      res.json({
        status: ApiResponseCode.ResponseSuccess,
        result: response,
      });
    } else {
      res.json({
        status: ApiResponseCode.ResponseFail,
        result: { message: "invalid code", token: "" },
      });
    }
  } catch (error) {
    res.json({
      status: ApiResponseCode.ResponseFail,
      result: { message: error.message, token: "" },
    });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = Utils.extractErrors(errors.array());
    console.log(extractedErrors);
    return res.json({
      status: ApiResponseCode.ValidationMsg,
      errors: extractedErrors,
    });
  }
  try {
    const user = await UserService.getUserByEmail(req.body.email).execute();
    console.log(user);
    if (user) {
      const isValidPassword = await user.isValidPassword(req.body.password);
      if (isValidPassword) {
        const otp = Math.floor(1000 + Math.random() * 9000);
        Utils.sendMail({
          to: user[TableFields.email],
          subject: "Login request !!",
          text: "",
          html: `<p> Please verify code for login: ${otp}</p>`,
        });
        user[TableFields.verificationCode] = otp;
        console.log(user);
        await user.save();
        res.json({
          status: ApiResponseCode.ResponseSuccess,
          result: {
            message: "Password verified",
            user: {
              [TableFields.ID]: user[TableFields.ID],
              [TableFields.email]: user[TableFields.email],
            },
          },
        });
      } else {
        res.json({
          status: ApiResponseCode.ResponseFail,
          result: {
            message: "Invalid password",
          },
        });
      }
    } else {
      res.json({
        status: ApiResponseCode.ResponseFail,
        result: {
          message: "Invalid email",
        },
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: ApiResponseCode.ResponseFail,
      result: {
        message: error.message,
      },
    });
  }
};

exports.confirmForgotPasswordRequest = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = Utils.extractErrors(errors.array());
    console.log(extractedErrors);
    res.json({
      status: ApiResponseCode.ValidationMsg,
      errors: extractedErrors,
    });
  }
  try {
    // fetch user by email and verification code
    const user = await UserService.confirmCode(
      req.body.email,
      req.body.verificationCode
    )
      .withId()
      .withEmail()
      .withBasicInfo()
      .withUserType()
      .withVerificationCode()
      .execute();
    if (user) {
      res.json({
        status: ApiResponseCode.ResponseSuccess,
        result: { message: "Verification Successful !!" },
      });
    } else {
      res.json({
        status: ApiResponseCode.ResponseFail,
        result: { message: "invalid code" },
      });
    }
  } catch (error) {
    res.json({
      status: ApiResponseCode.ResponseFail,
      result: { message: error.message },
    });
  }
};

exports.forgetAndUpdatePassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = Utils.extractErrors(errors.array());
    console.log(extractedErrors);
    res.json({
      status: ApiResponseCode.ValidationMsg,
      errors: extractedErrors,
    });
  }
  try {
    // fetch user by email and verification code
    console.log(req.body);
    const user = await UserService.updatePasswordForForgot(
      req.body.email,
      req.body.password
    )
      .withId()
      .withEmail()
      .withBasicInfo()
      .withUserType()
      .withVerificationCode()
      .execute();
    if (user) {
      const token = user.createAuthToken();
      res.json({
        status: ApiResponseCode.ResponseSuccess,
        result: { message: "Change Successful !!", token: token },
      });
    } else {
      res.json({
        status: ApiResponseCode.ResponseFail,
        result: { message: "invalid code" },
      });
    }
  } catch (error) {
    res.json({
      status: ApiResponseCode.ResponseFail,
      result: { message: error.message },
    });
  }
};

exports.updateProfile = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = Utils.extractErrors(errors.array());
    console.log(extractedErrors);
    return res.json({
      status: ApiResponseCode.ValidationMsg,
      errors: extractedErrors,
    });
  }

  try {
    const updatedUser = await UserService.updateUser(req).execute();
    res.json({
      status: ApiResponseCode.ResponseSuccess,
      result: updatedUser,
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
    case "login": {
      return [
        check("email", "Please enter email").exists().isEmail(),
        check("password", "Password length must be greater than 3")
          .exists()
          .isLength({ min: 4 }),
      ];
    }
    case "confirmCode": {
      return [
        check("email", "Please enter email").exists().isEmail(),
        check("verificationCode", "Please enter verification code ").exists(),
      ];
    }
    case "changePassword": {
      return [
        check("password", "Invalid password").exists().isLength({ min: 4 }),
      ];
    }
    case "confirmForgotPasswordRequest": {
      return [
        check("email", "Please enter email").exists().isEmail(),
        check("verificationCode", "Please enter verification code ").exists(),
      ];
    }
    case "forgetAndUpdatePassword": {
      return [
        check("email", "Please enter email").exists().isEmail(),
        check("password", "Invalid password").exists().isLength({ min: 4 }),
      ];
    }
    case "updateProfile": {
      return [
        check("email", "Please enter email").exists().isEmail(),
        check("firstName", "Invalid first name").exists(),
        check("lastName", "Invalid last name").exists(),
      ];
    }

    case "default":
      return [];
    default:
      return [];
  }
};
