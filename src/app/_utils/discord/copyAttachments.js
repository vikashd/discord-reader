const fs = require("fs");
const { MESSAGES_DIR } = require("./config");

function copyAttachments({ channel }) {
  const pages = fs
    .readdirSync(`${MESSAGES_DIR}/${channel}`, {
      withFileTypes: true,
    })
    .filter((file) => {
      if (file.isDirectory()) {
        return true;
      }
    })
    .sort((a, b) => parseInt(a.name, 10) - parseInt(b.name, 10));

  const destDir = `${__dirname}/../../../../public/img/chats/${channel}`;

  fs.rmSync(destDir, { recursive: true, force: true });
  fs.mkdirSync(destDir, { recursive: true });

  pages.forEach(({ name, path }, i) => {
    const attachments = `${path}/${name}/attachments`;

    fs.readdir(attachments, (err) => {
      if (!err) {
        console.log(`cp '${channel}/${name}' attachments`);
        fs.cpSync(attachments, `${destDir}/${name}`, { recursive: true });
      }
    });
  });
}

function run() {
  const [, , channel] = process.argv;

  copyAttachments({ channel });
}

run();
