const express = require("express");
const cors = require("cors");
require("dotenv").config();
const Db = require("./db/mogoose");
const apiRouter = require("./routes/apiRoute");
const adminRouter = require("./routes/adminRoute");
const path = require("path");
const bcrypt = require("bcrypt");
const { ApiResponseCode } = require("./utils/constants");

const app = express();
const PORT = process.env.PORT || 8000;
app.use(
  express.urlencoded({ extended: true, limit: "5gb", parameterLimit: 50000 })
);
app.use(express.json({ limit: "5gb" }));
app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use((req, res, next) => {
  console.log(req.url);
  next();
});
apiRouter(app);
adminRouter(app);
app.use((req, res, next) => {
  console.log("page not found");
  return res.status(ApiResponseCode.NotFound).json("page not found");
});
Db.initConnection(() => {
  app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
  });
});
