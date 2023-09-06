const mongoose = require("mongoose");
const {
  TableFields,
  ValidationMsg,
  TableNames,
} = require("../../utils/constants");
const Utils = require("../../utils/utils");

const newsfeedSchema = mongoose.Schema({
  [TableFields.title]: {
    type: String,
    trim: true,
    required: [true, `Feed ${ValidationMsg.titleEmpty}`],
  },
  [TableFields.image]: {
    type: String,
    trim: true,
    default: "",
  },
  [TableFields.description]: {
    type: String,
    trim: true,
    default: "",
  },
  [TableFields.createdAt]: {
    type: Date,
    default: "",
  },
  [TableFields.updatedAt]: {
    type: Date,
    default: "",
  },
});

newsfeedSchema.pre("save", function (next) {
  if (this.isNew) {
    this[TableFields.createdAt] = this[TableFields.updatedAt] = Utils.getDate();
  } else {
    this[TableFields.updatedAt] = Utils.getDate();
  }
  next();
});

const newsfeed = mongoose.model(TableNames.NewsFeed, newsfeedSchema);
module.exports = newsfeed;
