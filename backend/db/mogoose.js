const mongoose = require("mongoose");

mongoose.connection.on("connected", () => {
  console.log("Database connection Established");
});

mongoose.connection.on("reconnected", () => {
  console.log("Database connection Reestablished");
});

mongoose.connection.on("disconnected", () => {
  console.log("Database connection Disconnected");
});

mongoose.connection.on("error", (error) => {
  console.log("Database error " + error);
});

const initConnection = (callback) => {
  try {
    mongoose.connect(process.env.Database_URL);
  } catch (error) {
    console.log(error);
    return;
  }
  const db = mongoose.connection;
  db.once("open", function () {
    callback();
  });
};

module.exports = { initConnection, mongoose };
