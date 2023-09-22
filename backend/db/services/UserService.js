const { TableFields, UserTypes } = require("../../utils/constants");
const user = require("../models/user");
const Utils = require("../../utils/utils");
class UserService {
  static getUserByEmail = (email) => {
    return new ProjectionBuilder(async function () {
      if (email) {
        try {
          console.log(email);
          return await user.findOne(
            {
              [TableFields.email]: email,
            },
            this
          );
        } catch (error) {
          console.log(error);
          throw error;
        }
      }
    });
  };

  static getAllUser = (req) => {
    return new ProjectionBuilder(async function () {
      const page = req.query.page;
      const limit = +req.query.limit;
      console.log("page limit", page, limit);
      const pageOption = {};
      if (page && limit) {
        const skip = (page - 1) * limit;
        pageOption.skip = skip;
        pageOption.limit = limit;
      }
      console.log("page option", pageOption);
      try {
        return await user.find(
          {
            [TableFields.userType]: { $nin: [UserTypes.Admin] },
            [TableFields.firstName]: {
              $regex: req.query.searchTerm,
              $options: "i",
            },
          },
          this,
          pageOption
        );
        // const users = await user
        //   .aggregate()
        //   .match({ [TableFields.userType]: { $nin: [UserTypes.Admin] } })
        //   .project(this)
        //   .addFields({
        //     name: { $concat: ["$firstName", " ", "$lastName"] },
        //   })
        //   .skip(skip)
        //   .limit(limit);
        // console.log(users);
        // return users;
      } catch (error) {
        throw new Error(error.message);
      }
    });
  };

  static deactivateUser = (req) => {
    return new ProjectionBuilder(async function () {
      const currUser = await user.findById(req.params.userId);
      if (!currUser) throw new Error("Invalid User id");

      console.log(currUser);
      currUser[TableFields.isActive] = !currUser[TableFields.isActive];
      return await currUser.save();
    });
  };

  static createUser = (req) => {
    return new ProjectionBuilder(async function () {
      try {
        const newUser = new user();
        newUser[TableFields.firstName] = req.body.firstName;
        newUser[TableFields.lastName] = req.body.lastName;
        newUser[TableFields.email] = req.body.email;
        newUser[TableFields.userType] = [UserTypes.Verified];
        const hashedPassword = await newUser.generateHash(req.body.password);
        newUser[TableFields.password] = hashedPassword;
        console.log(newUser);
        const otp = Math.floor(1000 + Math.random() * 9000);
        Utils.sendMail({
          to: newUser[TableFields.email],
          subject: "Account Created !!",
          text: "",
          html: `<p> Please verify code : ${otp}</p>`,
        });
        newUser[TableFields.verificationCode] = otp;
        await newUser.save();
        return newUser;
      } catch (error) {
        throw error;
      }
    });
  };
  static deleteUserById = (req) => {
    return new ProjectionBuilder(async function () {
      console.log(await user.findById(req.params.userId));
      return await user
        .findByIdAndUpdate(
          req.params.userId,
          {
            $set: {
              [TableFields.isDeleted]: 1,
            },
          },

          { new: true }
        )
        .select("-password");
    });
  };
  static confirmCode = (email, code) => {
    return new ProjectionBuilder(async function () {
      return await user.findOne(
        {
          [TableFields.email]: email,
          [TableFields.verificationCode]: code,
        },
        this
      );
    });
  };
  static getUserById = (id) => {
    return new ProjectionBuilder(async function () {
      return await user.findById(id, this);
    });
  };
  static changePassword = (req) => {
    return new ProjectionBuilder(async function () {
      try {
        let fetchUser;
        if (req.user) {
          fetchUser = await user.findById(req.user[TableFields.ID]);
        } else {
          fetchUser = await this.getUserByEmail(req.body.email).execute();
        }
        console.log("fu", fetchUser);
        const isValidPassword = await fetchUser.isValidPassword(
          req.body.currentPassword
        );
        console.log(
          "isvalid",
          isValidPassword,
          "current pass",
          req.body.currentPassword
        );
        if (!isValidPassword) throw new Error("Wrong current password");
        if (fetchUser) {
          fetchUser[TableFields.password] = await fetchUser.generateHash(
            req.body[TableFields.password]
          );
          return await fetchUser.save();
        }
      } catch (error) {
        throw error;
      }
    });
  };
  static updatePasswordForForgot = (email, password) => {
    return new ProjectionBuilder(async function () {
      try {
        const fetchUser = await UserService.getUserByEmail(email).execute();
        if (fetchUser) {
          fetchUser[TableFields.password] = await fetchUser.generateHash(
            password
          );
          return await fetchUser.save();
        } else {
          throw new Error("Invalid mail");
        }
      } catch (error) {
        throw error;
      }
    });
  };
  static updateUser = (req) => {
    return new ProjectionBuilder(async function () {
      try {
        const email = req.body.email;
        let isExist;
        if (email != req.user[TableFields.email]) {
          isExist = await UserService.getUserByEmail(email).execute();
        }
        if (isExist) {
          throw new Error("Email already exists");
        }
        return await user.findByIdAndUpdate(
          req.user[TableFields.ID],
          {
            $set: req.body,
          },
          { new: true }
        );
      } catch (error) {
        throw error;
      }
    });
  };

  static getUserCount = () => {
    return new ProjectionBuilder(async function () {
      return await user
        .find({ [TableFields.userType]: { $nin: [UserTypes.Admin] } })
        .count();
    });
  };
}

class ProjectionBuilder {
  constructor(methodToExecute) {
    const projection = {
      populate: {},
    };
    this.withId = () => {
      projection[TableFields.ID] = 1;
      return this;
    };
    this.withBasicInfo = () => {
      projection[TableFields.firstName] = 1;
      projection[TableFields.lastName] = 1;
      projection[TableFields.isActive] = 1;
      return this;
    };
    this.withUserType = () => {
      projection[TableFields.userType] = 1;
      return this;
    };
    this.withEmail = () => {
      projection[TableFields.email] = 1;
      return this;
    };
    this.withPassword = () => {
      projection[TableFields.password] = 1;
      return this;
    };
    this.withVerificationCode = () => {
      projection[TableFields.verificationCode] = 1;
      return this;
    };
    this.withCreationDate = () => {
      projection[TableFields.createdAt] = 1;
      return this;
    };

    this.execute = async () => {
      if (Object.keys(projection.populate) == 0) {
        delete projection.populate;
      } else {
        projection.populate = Object.values(projection.populate);
      }

      return await methodToExecute.call(projection);
    };
  }
}

module.exports = UserService;
