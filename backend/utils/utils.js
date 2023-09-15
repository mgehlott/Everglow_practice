const nodemailer = require("nodemailer");

exports.getDate = () => {
  const d = new Date();
  return (
    d.getFullYear() +
    "-" +
    this.addZero(d.getMonth() + 1) +
    "-" +
    this.addZero(d.getDate()) +
    " " +
    this.addZero(d.getHours()) +
    ":" +
    this.addZero(d.getMinutes()) +
    ":" +
    this.addZero(d.getSeconds())
  );
};

exports.addZero = (i) => {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
};

exports.extractErrors = (errors) => {
  const extractErrors = [];
  console.log(errors);
  errors.map((err) => {
    let lastPath;
    if (extractErrors.length > 0) {
      lastPath = Object.keys(extractErrors[extractErrors.length - 1])[0];
    }

    if (lastPath !== err.path) extractErrors.push(err.msg);
  });
  return extractErrors;
};

exports.generateVerificationCode = () => {};

exports.sendMail = ({ to, subject, text = "", html = "" }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  });
  transporter
    .sendMail({
      from: "mk@gmail.com",
      to: to,
      subject: subject,
      text: text,
      html: html,
    })
    .then((res) => console.log("Mail send"))
    .catch((err) => console.log(err));
};

exports.isImageFile = (fileOriginalname) => {
  return fileOriginalname
    .toLocaleLowerCase()
    .match(
      /\.(jpg|jpeg|jpe|jif|jfif|jfi|png|bmp|webp|tiff|tif|dib|svg|svgz)$/
    ) == undefined
    ? false
    : true;
};
exports.getDateFormat = (d) => {
  console.log(d);
  d = new Date(d);
  return (
    d.getFullYear() +
    "-" +
    this.addZero(d.getMonth() + 1) +
    "-" +
    this.addZero(d.getDate())
  );
};
exports.generateRandomFileName = (filename) => {
  var ext = filename.split(".").pop();
  var random = Math.floor(Math.random() * 9000000000000000);
  let timestamp = new Date().getTime().toString();
  filename = timestamp + "_" + random + "." + ext;
  return filename;
};

exports.getBaseURL = () => {
  let baseURL = process.env.HOST;
  if (process.env.isProduction == "false") {
    baseURL += ":" + process.env.PORT;
  }
  return baseURL;
};
