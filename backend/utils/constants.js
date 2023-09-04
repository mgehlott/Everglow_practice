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
  visibility: "visibility",
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
  occasionId: "occasionId",
  candleId: "candleId",
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

const Visibility = {
  Private: 0,
  Public: 1,
};

const ValidationMsg = {
  firstNameEmpty: "First Name is required !",
  lastNameEmpty: "Last Name is required",
  emailEmpty: "Email is required",
  nameEmpty: "Name is required",
  titleEmpty: "Title is required",
  startDateEmpty: "Start Date is required",
    durationEmpty: "Duration is required",
    linkEmpty: "Link is required",
  descriptionEmpty:"Description is required"
};

module.exports = {
  TableFields,
  TableNames,
  ValidationMsg,
  UserTypes,
  Visibility,
};
