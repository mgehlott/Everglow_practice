const { TableFields, UserTypes } = require("../../utils/constants");
const user = require("../models/user");
const Utils = require("../../utils/utils");
class UserService {
  static getUserByEmail = (email) => {
    return new ProjectionBuilder(async function () {
      if (email) {
        try {
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
        if (req.user)
        {
          fetchUser = await user.findById(req.user[TableFields.ID]);
        }
        else {
          fetchUser = await this.getUserByEmail(req.body.email);
        }
        const isValidPassword = fetchUser.isValidPassword(
          req.body.currentPassword
        );
        if (!isValidPassword) throw new Error('Wrong current password');
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
