const mongoose = require("mongoose");
const {
  TableFields,
  ValidationMsg,
  TableNames,
} = require("../../utils/constants");

const candleSchema = mongoose.Schema({
  [TableFields.title]: {
    type: String,
    trim: true,
    required: [true, `Candle ${ValidationMsg.titleEmpty}`],
  },

  [TableFields.icon]: {
    type: String,
    default: "",
  },
});

const candle = mongoose.model(TableNames.Candle, candleSchema);

module.exports = candle;
