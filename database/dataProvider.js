const fs = require('fs');
const readline = require('readline');
const AVLTree = require('binary-search-tree').AVLTree

const DB_FILE_NAME = "data.csv";

const userByIdMap = {};
const usersByCountryMap = new Map();
const ageTimestampTree = new AVLTree();

async function init() {
  const filestream = fs.createReadStream(DB_FILE_NAME);

  const rl = readline.createInterface({
    input: filestream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {
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
  userByIdMap[id] = { email, name, birthday, countryCode };
  addUserToCountry(id, countryCode);

}

function addUserToCountry(id, countryCode) {
  if (usersByCountryMap.has(countryCode)) {
    usersByCountryMap.get(countryCode).push(id);
  } else {
    usersByCountryMap.set(countryCode, [id]);
  }
}

function addUserToAgeTree(id, birthday) {
  
}

function getUserById(id) {
  return userByIdMap[id];
}

function getUserByCountry(countryCode) {
  let usersFromCountry = [];
  usersByCountryMap.get(countryCode)
    .forEach(Id => { usersFromCountry.push(getUserById(Id)) });
  return usersFromCountry;
}


module.exports = {
  init,
  getUserById,
  getUserByCountry
}