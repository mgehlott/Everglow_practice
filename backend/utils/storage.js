const Utils = require("../utils/utils");
const path = require("path");
const fs = require("fs");
const { rejects } = require("assert");

exports.addFile = async (parentDir, originalFileName, file) => {
  if (!originalFileName || !file) return "";
  let finalFileName = "";
  let tempFileName = Utils.generateRandomFileName(originalFileName);
  if (parentDir) {
    await createDirectories(parentDir);
    finalFileName = path.join(parentDir, tempFileName);
  } else {
    finalFileName = tempFileName;
  }
  try {
    await fs.writeFileSync(finalFileName, file);
    return tempFileName;
  } catch (error) {
    console.log(error);
    return "";
  }
};
exports.removeFile = async (parentDir, fileKey) => {
  if (!fileKey) return false;
  try {
    const isExist = await fs.existsSync(parentDir + "/" + fileKey);
    if (isExist) {
      await fs.unlink(parentDir + "/" + fileKey);
    }
    return true;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
exports.getFile = (parentDir, fileKey) => {
  return new Promise(async (resolve, rejects) => {
    try {
      const stream = await fs.readFile(parentDir + "/" + fileKey, "utf-8");
      resolve(stream);
    } catch (error) {
      resolve();
    }
  });
};
exports.getUrl = (parentDir, key) => {
  if (key) return this.getBaseURL() + parentDir + "/" + key;
  else return "";
};
exports.getUrlParentDir = (parentDir) => {
  if (parentDir) return this.getBaseURL() + parentDir + "/";
  else return "";
};
exports.getBaseURL = () => {
  return Utils.getBaseURL() + "/";
};
async function createDirectories(pathname) {
  const __dirname = path.resolve();
  pathname = pathname.replace(/^\.*\/|\/?[^\/]+\.[a-z]+|\/$/g, ""); // Remove leading directory markers, and remove ending /file-name.extension
  await fs.mkdirSync(
    path.resolve(__dirname, pathname),
    { recursive: true },
    (e) => {
      if (e) {
        console.error("Directory created error: ", e);
      }
    }
  );
}
