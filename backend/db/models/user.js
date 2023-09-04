const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const {
  TableFields,
  ValidationMsg,
  UserTypes,
  TableNames,
} = require("../../utils/constants");
const Utils = require("../../utils/utils");

const userSchema = mongoose.Schema(
  {
    [TableFields.firstName]: {
      type: String,
      trim: true,
      required: [true, ValidationMsg.firstNameEmpty],
    },
    [TableFields.lastName]: {
      type: String,
      trim: true,
      required: [true, ValidationMsg.lastNameEmpty],
    },
    [TableFields.email]: {
      type: String,
      trim: true,
      required: [true, ValidationMsg.emailEmpty],
    },
    [TableFields.password]: {
      type: String,
      trim: true,
    },
    [TableFields.userType]: {
      type: [
        {
          type: Number,
          enum: [UserTypes.Admin, UserTypes.Verified, UserTypes.Guest],
        },
      ],
    },
    [TableFields.verificationCode]: {
      type: Number,
    },
    [TableFields.createdAt]: {
      type: Date,
      trim: true,
      default: "",
    },
    [TableFields.updatedAt]: {
      type: Date,
      trim: true,
      default: "",
    },
  },
  {
    toObject: {
      transform: function (doc, ret) {
        delete ret.__v;
        delete ret.__updatedAt;
        return ret;
      },
    },
    toJson: {
      transform: function (doc, ret) {
        delete ret.__v;
        delete ret.__updatedAt;
        delete ret.__password;
        return ret;
      },
    },
  }
);

userSchema.methods.generateHash = async function (password) {
  return await bcrypt.hash(password, 8);
};

userSchema.methods.isValidPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.pre("save", async function (next) {
  if (this.isNew) {
    this[TableFields.createdAt] = this[TableFields.updatedAt] = Utils.getDate();
  } else {
    this[TableFields.updatedAt] = Utils.getDate();
  }
  // hash password here
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const user = mongoose.model(TableNames.User, userSchema);

module.exports = user;
