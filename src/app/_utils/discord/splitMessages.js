const fs = require("fs");

function split({ channel, target = channel, messagesPerPage = 1000 }) {
  const dir = `${__dirname}/../../_messages`;
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

  fs.rmSync(`${dir}/${target}`, { recursive: true, force: true });

  const data = JSON.parse(response).reverse();
  const pages = Math.ceil(data.length / messagesPerPage);

  for (let i = 0; i < pages; i++) {
    const pageData = data.slice(i * 1000, i * 1000 + 1000);

    fs.mkdirSync(`${dir}/${target}/${i + 1}`, { recursive: true });

    fs.writeFile(
      `${dir}/${target}/${i + 1}/data.json`,
      JSON.stringify(pageData),
      (err) => {
        if (err) {
          console.error(err);
        }
      }
    );
  }

  console.log(`${pages} page(s) saved to '${dir}/${target}'`);
}

function run() {
  const [, , channel, target, messagesPerPage = 1000] = process.argv;
  split({ channel, target, messagesPerPage });
}

run();

// node splitMessages [channel] [target] [messagesPerPage]
