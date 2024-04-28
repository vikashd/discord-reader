const fs = require("fs");
const https = require("https");
const { MESSAGES_DIR } = require("./config");

async function downloadAttachments({ channel, target = channel }) {
  const dir = MESSAGES_DIR;
  const channelDir = `${dir}/${channel}`;
  const targetDir = `${dir}/${target}`;
  let pages = [];

  console.log(channelDir);

  try {
    pages = fs
      .readdirSync(`${channelDir}`, { withFileTypes: true })
      .filter((file) => {
        if (file.isDirectory()) {
          return file.name;
        }
      });
  } catch (e) {
    console.log(e.message);
    return;
  }

  const errors = [];

  pages.sort((a, b) => parseInt(a.name, 10) - parseInt(b.name, 10));

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const folder = page.name;

    const response = fs.readFileSync(`${page.path}/${page.name}/data.json`, {
      encoding: "utf-8",
      flag: "r",
    });

    const data = JSON.parse(response);

    const attachments = data
      .filter(({ attachments }) => attachments.length)
      .map(({ attachments }) => attachments)
      .flat();

    if (attachments.length) {
      console.log(`[${page.name}] ${attachments.length} file(s) to download`);

      const dest = `${targetDir}/${folder}/attachments`;

      fs.rmSync(dest, { recursive: true, force: true });
      fs.mkdirSync(dest, { recursive: true });

      const responses = attachments.map(({ id, url, filename: name }, i) => {
        return new Promise((resolve) => {
          const { filename, shortName } = generateFilename({ id, name });

          downloadTo(`${url}`, `${dest}/${filename}`, (e) => {
            resolve(
              e
                ? { index: i, filename, shortName, error: e }
                : { id: i, filename, shortName }
            );
          });
        });
      });

      await Promise.all(responses)
        .then((data) => {
          if (data.error) {
            errors.push({ page: page.name, data });
            console.log("\x1b[31m", `[${page.name}] error`, "\x1b[0m", data);
          } else {
            console.log(
              "\x1b[32m",
              `[${page.name}] done`,
              "\x1b[0m",
              data.map(({ id, shortName }) => {
                return { id, file: shortName };
              })
            );
          }
        })
        .catch((data) =>
          console.log("\x1b[31m", `[${page.name}] error`, "\x1b[0m", data)
        )
        .finally(() => {
          console.log(
            "\n----------------------------------------------------------------------------------"
          );
        });
    } else {
      console.log(`[${page.name}] - no attachments`);
    }
  }

  if (errors.length) {
    console.log("Errors");
    console.log(errors);
  }
}

function downloadTo(url, dest, cb) {
  const file = fs.createWriteStream(dest);

  return https
    .get(url, function (response) {
      response.pipe(file);
      file.on("finish", function () {
        file.close(cb); // close() is async, call cb after close completes.
      });
    })
    .on("error", function (err) {
      // Handle errors
      fs.unlink(dest, () => {
        console.log("\x1b[0m", `'${dest}' was deleted`);
      }); // Delete the file async. (But we don't check the result)
      if (cb) cb(err.message);
    });
}

function generateFilename({ id, name }) {
  const [, namewithoutExtension, extension] = name.match(/(.+)(\.\w+)/) || [];

  let str = namewithoutExtension ? namewithoutExtension.substring(0, 5) : name;
  str = str === name ? name : `${str}...${extension}`;

  return { filename: `${id}_${name}`, shortName: `${id}_${str}` };
}

module.exports = downloadAttachments;
