const fs = require('fs');
const readline = require('readline');
const AVLTree = require('binary-search-tree').AVLTree;
const moment = require('moment');

const DB_FILE_NAME = "data.csv";

const userByIdMap = {};
const usersByCountryMap = new Map();
let agesTree = new AVLTree();

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
    if (id != "Id")         // first row of csv issue
      addUserToMemory(id, email, name, birthday, countryCode);
  }
}

function addUserToMemory(id, email, name, birthday, countryCode) {
  userByIdMap[id] = { email, name, birthday, countryCode };
  addUserToCountry(id, countryCode);
  addUserToAgeTree(id, birthday);

}

function addUserToCountry(id, countryCode) {
  if (usersByCountryMap.has(countryCode)) {
    usersByCountryMap.get(countryCode).push(id);
  } else {
    usersByCountryMap.set(countryCode, [id]);
  }
}

function addUserToAgeTree(id, birthday) {
  let unixTimestamp = moment(birthday, 'DD/MM/YYYY').unix();
  agesTree.insert(unixTimestamp, id);
}

function getUserById(id) {
  agesTree.insert(moment().unix(), id);
  return userByIdMap[id];
}

function getUserByCountry(countryCode) {
  let usersFromCountry = [];
  usersByCountryMap.get(countryCode)
    .forEach(id => { usersFromCountry.push(getUserById(id)) });
  return usersFromCountry;
}

function getUsersByAge(age) {
  let usersByAge = [];
  let currentTime = moment().startOf('day');    // start of => to get users born the same day only earlier than current time.
  let lowerBoundUnix = currentTime.subtract(age, 'years').unix();
  let upperBoundUnix = currentTime.add(1, 'years').unix();
  usersByAgeIds = agesTree.betweenBounds({ $lt: upperBoundUnix, $gte: lowerBoundUnix });
  usersByAgeIds.forEach(id => { usersByAge.push(getUserById(id)) });
  return usersByAge;
}

module.exports = {
  init,
  getUserById,
  getUserByCountry,
  getUsersByAge
}