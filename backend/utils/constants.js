const TableFields = {
  ID: "_id",
  firstName: "firstName",
  lastName: "lastName",
  email: "email",
  password: "password",
  verificationCode: "verificationCode",
  userType: "userType",
  creator: "creator",
  occasionType: "occasionType",
  candleType: "candleType",
  title: "title",
  //campaignTitle: "campaignTitle",
  image: "image",
  description: "description",
  //campaignDescription: "campaignDescription",
  isCommentAllow: "isCommentAllow",
  startDate: "startDate",
  duration: "duration",
  link: "link",
  comments: "comments",
  joinedUsers: "joinedUsers",
  //occasionTitle: "occasionTitle",
  color: "color",
  icon: "icon",
  // candleTitle: "candleTitle",
  name: "name",
  userId: "userId",
  createdAt: "createdAt",
  updatedAt: "updatedAt",
  //commentDescription: "commentDescription",
  //newFeedTitle: "newFeedTitle",
};

const TableNames = {
  User: "users",
  Campaign: "campaigns",
  Occasion: "occasions",
  Candle: "candles",
};

const UserTypes = {
  Admin: 1,
  Verified: 2,
  Guest: 3,
};

const ValidationMsg = {
  firstNameEmpty: "First Name is required !",
  lastNameEmpty: "Last Name is required",
  emailEmpty: "Email is required",
};

module.exports = { TableFields, TableNames, ValidationMsg, UserTypes };
