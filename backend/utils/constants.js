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
  message: "message",
  isActive: "isActive",
  isDeleted:'isDeleted'
  //commentDescription: "commentDescription",
  //newFeedTitle: "newFeedTitle",
};

const TableNames = {
  User: "users",
  Campaign: "campaigns",
  Occasion: "occasions",
  Candle: "candles",
  NewsFeed: "newsfeeds",
  Message: "messages",
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
  descriptionEmpty: "Description is required",
  incorrectImage: "Please upload an image file (JPG/PNG/JPEG)",
  messageEmpty: "Message is required",
};

const ApiResponseCode = {
  ResponseFail: 400,
  ClientOrServerError: 400,
  ResponseSuccess: 200,
  AuthError: 401,
  AccountDeleted: 403,
  NotFound: 404,
  ValidationMsg: 422,
  UnderMaintanance: 503,
  ForceUpdate: 426,
};

module.exports = {
  TableFields,
  TableNames,
  ValidationMsg,
  UserTypes,
  Visibility,
  ApiResponseCode,
};
