const jwt = require("jsonwebtoken");
const UserService = require("../db/services/UserService");
const { TableFields, ApiResponseCode } = require("../utils/constants");

exports.auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer", "").trim();
    console.log(token);
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log("token", token, decoded);
    const user = await UserService.getUserById(
      decoded[TableFields.ID]
    ).execute();
    console.log("auth user", user);
    if (user) {
      user.name = user[TableFields.firstName] + user[TableFields.lastName];
      req.user = user;
      next();
    } else {
      return res.json({
        status: ApiResponseCode.AuthError,
        message: "Invalid auth token",
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
