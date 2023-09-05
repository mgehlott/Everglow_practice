const Utils = require("../utils/utils");
const path = require("path");
const fs = require("fs");

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
