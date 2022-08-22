const fs = require('fs');
const readline = require('readline');

const DB_FILE_NAME = "data.csv";

const userByIdMap = {};

async function init() {
    const filestream = fs.createReadStream(DB_FILE_NAME);

  const rl = readline.createInterface({
    input: filestream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
    // Each line in input.txt will be successively available here as `line`.
    const dataParts = line.split(',');
    const id = dataParts[0];
    const email = dataParts[1];
    const name = dataParts[2];
    const birthday = dataParts[3];
    const countryCode = dataParts[4];

    addUserToMemory(id, email, name, birthday, countryCode);
  }
}

function addUserToMemory(id, email, name, birthday, countryCode) {
  userByIdMap[id] = {email, name, birthday, countryCode};
}

function getUserById(id) {
  return userByIdMap[id];
}


module.exports = {
  init,
  getUserById
}