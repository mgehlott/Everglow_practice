const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
