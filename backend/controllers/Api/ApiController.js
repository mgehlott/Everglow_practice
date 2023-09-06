const OccasionService = require("../../db/services/OccasionService");
const { ApiResponseCode } = require("../../utils/constants");

exports.getAllOccasionType = async (req, res) => {
  try {
    const occasions = await OccasionService.getAllOccasion().execute();
    res.json({
      status: ApiResponseCode.ResponseSuccess,
      result: {
        data: occasions,
        message: "Successful",
      },
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: ApiResponseCode.ResponseFail,
      result: {
        data: [],
        message: error.message,
      },
    });
  }
};

exports.getAllCandleType = async (req, res) => {};
