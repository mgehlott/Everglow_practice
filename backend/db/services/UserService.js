const { TableFields, UserTypes } = require("../../utils/constants");
const user = require("../models/user");

class UserService {
  static getUserByEmail = (email) => {
    return new ProjectionBuilder(async function () {
      if (email) {
        try {
         const fetchedUser = await user.findOne({ [TableFields.email]: email });
          return fetchedUser;
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
        await newUser.save();
        return newUser;
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
