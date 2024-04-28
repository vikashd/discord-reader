const fs = require("fs");
const { MESSAGES_DIR } = require("./config");

function copyAttachments({ src }) {
  const pages = fs
    .readdirSync(`${MESSAGES_DIR}/${src}`, {
      withFileTypes: true,
    })
    .filter((file) => {
      if (file.isDirectory()) {
        return true;
      }
    })
    .sort((a, b) => parseInt(a.name, 10) - parseInt(b.name, 10));

  const destDir = `${__dirname}/../../../../public/img/chats/${src}`;

  fs.rmSync(destDir, { recursive: true, force: true });
  fs.mkdirSync(destDir, { recursive: true });

  const promisesAll = [];

  pages.forEach(({ name, path }, i) => {
    const attachments = `${path}/${name}/attachments`;

    promisesAll.push(
      new Promise((resolve, reject) => {
        fs.readdir(attachments, (err) => {
          if (err) {
            console.log("Error copying", err.message);
            reject("Error copying");
            return;
          }

          console.log(`cp '${src}/${name}' attachments`);
          fs.cpSync(attachments, `${destDir}/${name}`, { recursive: true });
          resolve(`${src}/${name}`);
        });
      })
    );
  });

  return Promise.all(promisesAll);
}

module.exports = copyAttachments;
