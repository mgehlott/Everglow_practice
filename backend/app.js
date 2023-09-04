const express = require("express");
const cors = require("cors");
require("dotenv").config();
const Db = require("./db/mogoose");
const apiRouter = require("./routes/apiRoute");

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());

apiRouter(app);

Db.initConnection(() => {
  app.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
  });
});
