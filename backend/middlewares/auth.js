const jwt = require("jsonwebtoken");
const UserService = require("../db/services/UserService");
const {
  TableFields,
  UserTypes,
  ApiResponseCode,
} = require("../utils/constants");

exports.adminAuth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer", "").trim();
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await UserService.getUserById(
      decoded[TableFields.ID]
    ).execute();
    console.log("auth useradmin", user, user[TableFields.userType]);
    if (user && user[TableFields.userType].includes(UserTypes.Admin)) {
      req.user = user;
      next();
    } else {
      return res.json({
        status: ApiResponseCode.AuthError,
        message: "Invalid admin auth token",
      });
    }
  } catch (error) {
    console.log(error);
    return res.json({
      status: ApiResponseCode.AuthError,
      message: "Invalid auth token",
    });
  }
};
