const fs = require("fs");
const { MESSAGES_DIR } = require("./config");

function split({ channel, target = channel, messagesPerPage = 1000 }) {
  const dir = MESSAGES_DIR;
  let response;

  try {
    response = fs.readFileSync(`${dir}/${channel}.json`, {
      encoding: "utf-8",
      flag: "r",
    });
  } catch (e) {
    console.log(e.message);
    return;
  }

  const data = JSON.parse(response).reverse();

  writeFilesFromData({ target, data, messagesPerPage });
}

// split and save messages to separate files/pages
async function writeFilesFromData({ target, data, messagesPerPage = 1000 }) {
  const dir = MESSAGES_DIR;

  fs.rmSync(`${dir}/${target}`, { recursive: true, force: true });

  const pages = Math.ceil(data.length / messagesPerPage);

  const promisesAll = [];

  for (let i = 0; i < pages; i++) {
    const pageData = data.slice(
      i * messagesPerPage,
      i * messagesPerPage + messagesPerPage
    );

    const targetDir = `${dir}/${target}/${i + 1}`;

    promisesAll.push(
      new Promise((resolve) => {
        fs.mkdir(`${targetDir}`, { recursive: true }, (err) => {
          if (err) {
            console.log(err);
            resolve("done");
            return;
          }

          fs.writeFile(
            `${targetDir}/data.json`,
            JSON.stringify(pageData),
            (err) => {
              if (err) {
                console.error(err);
                return;
              }

              console.log(`Write file ${targetDir}`);
              resolve("done");
            }
          );
        });
      })
    );
  }

  return Promise.all(promisesAll);
}

module.exports = { split, writeFilesFromData };
