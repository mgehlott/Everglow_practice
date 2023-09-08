const mongoose = require("mongoose");
const Utils = require("../../utils/utils");
const {
  TableFields,
  ValidationMsg,
  Visibility,
  UserTypes,
  TableNames,
} = require("../../utils/constants");

const campaignSchema = mongoose.Schema(
  {
    [TableFields.creator]: {
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
      [TableFields.userId]: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        _id: false,
      },
    },
    [TableFields.occasionType]: {
      [TableFields.title]: {
        type: String,
        trim: true,
        required: [true, `Occasion ${ValidationMsg.titleEmpty}`],
      },
      [TableFields.color]: {
        type: String,
        trim: true,
        default: "",
      },
      [TableFields.icon]: {
        type: String,
        trim: true,
        default: "",
      },
      [TableFields.occasionId]: {
        type: mongoose.Schema.ObjectId,
        ref: "occasion",
        _id: false,
      },
    },

    [TableFields.candleType]: {
      [TableFields.title]: {
        type: String,
        trim: true,
        required: [true, `Candle ${ValidationMsg.titleEmpty}`],
      },
      [TableFields.icon]: {
        type: String,
        trim: true,
        default: "",
      },
      [TableFields.candleId]: {
        type: mongoose.Schema.ObjectId,
        ref: "candle",
        _id: false,
      },
    },

    [TableFields.visibility]: {
      type: Number,
      enum: [Visibility.Private, Visibility.Public],
    },
    [TableFields.title]: {
      type: String,
      trim: true,
      required: [true, `Campaign ${ValidationMsg.titleEmpty}`],
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
    [TableFields.isCommentAllow]: {
      type: Boolean,
      default: true,
    },
    [TableFields.startDate]: {
      type: Date,
      required: [true, TableFields.startDate],
    },
    [TableFields.duration]: {
      type: Number,
      required: [true, ValidationMsg.durationEmpty],
    },
    [TableFields.link]: {
      type: String,
      require: [true, ValidationMsg.linkEmpty],
    },
    [TableFields.comments]: [
      {
        [TableFields.name]: {
          type: String,
          trim: true,
          required: [true, ValidationMsg.nameEmpty],
        },
        [TableFields.description]: {
          type: String,
          trim: true,
          require: [true, ValidationMsg.descriptionEmpty],
        },
        [TableFields.userId]: {
          type: mongoose.Schema.ObjectId,
          ref: "user",
        },
      },
    ],
    [TableFields.joinedUsers]: [
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
        [TableFields.userType]: {
          type: [
            {
              type: Number,
              enum: [UserTypes.Admin, UserTypes.Guest, UserTypes.Verified],
            },
          ],
        },
      },
    ],
    [TableFields.createdAt]: {
      type: Date,
      default: "",
    },
    [TableFields.updatedAt]: {
      type: Date,
      default: "",
    },
  },
  {
    toObject: {
      transform: function (doc, ret) {
        delete ret.__v;
        delete ret.updatedAt;
        return ret;
      },
    },
    toJson: {
      transform: function (doc, ret) {
        delete ret.__v;
        delete ret.updatedAt;
        return ret;
      },
    },
  }
);

campaignSchema.pre("save", function (next) {
  if (this.isNew) {
    this[TableFields.createdAt] = this[TableFields.updatedAt] = Utils.getDate();
  } else {
    this[TableFields.updatedAt] = Utils.getDate();
  }
  next();
});

const campaign = mongoose.model(TableNames.Campaign, campaignSchema);

module.exports = campaign;
