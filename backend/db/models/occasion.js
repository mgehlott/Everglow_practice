const mongoose = require("mongoose");
const {
  TableFields,
  ValidationMsg,
  TableNames,
} = require("../../utils/constants");

const occasionSchema = mongoose.Schema({
  [TableFields.title]: {
    type: String,
    trim: true,
    required: [true, `Occasion ${ValidationMsg.titleEmpty}`],
  },
  [TableFields.color]: {
    type: String,
    default: "",
  },
  [TableFields.icon]: {
    type: String,
    default: "",
  },
});

const occasion = mongoose.model(TableNames.Occasion, occasionSchema);

module.exports = occasion;
