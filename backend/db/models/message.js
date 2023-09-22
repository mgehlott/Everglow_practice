const mongoose = require("mongoose");
const {
  TableFields,
  ValidationMsg,
  TableNames,
} = require("../../utils/constants");

const messageSchema = mongoose.Schema(
  {
    [TableFields.name]: {
      type: String,
      trim: true,
      required: [true, ValidationMsg.nameEmpty],
    },
    [TableFields.email]: {
      type: String,
      trim: true,
      required: [true, ValidationMsg.emailEmpty],
    },
    [TableFields.message]: {
      type: String,
      trim: true,
      required: [true, ValidationMsg.messageEmpty],
    },
  },
  {
    timestamps: true,
    toObject: {
      transform: function (doc, ret) {
        delete ret.__v;
        delete ret.__updatedAt;
        console.log(ret);
        return ret;
      },
    },
    toJson: {
      transform: function (doc, ret) {
        delete ret.__v;
        delete ret.__updatedAt;
        console.log(ret);
        return ret;
      },
    },
  }
);

const message = mongoose.model(TableNames.Message, messageSchema);

module.exports = message;
