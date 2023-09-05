const multer = require("multer");
const Utils = require("../utils/utils");
const { ValidationMsg, ApiResponseCode } = require("../utils/constants");

const isValidImageFile = (fileOriginalname) => {
  return Utils.isImageFile(fileOriginalname);
};

const uploader = multer({
  fileFilter: (req, file, cb) => {
    if (isValidImageFile(file.originalname) == false) {
      return cb(null, false, new Error(ValidationMsg.incorrectImage));
    }
    cb(null, true);
  },
});

class ImageHandler {
  static uploadSingle = function (fieldName) {
    const m1 = uploader.single(fieldName);

    const methodToExecute = async (req, res, next) => {
      console.log("multer");
      m1(req, res, function (err) {
        if (err) {
          console.log(err);
          return res.json({
            status: ApiResponseCode.ResponseFail,
            result: {
              message: "Something went wrong",
            },
          });
        } else {
          next();
        }
      });
    };
    return methodToExecute;
  };
}

module.exports = ImageHandler;
