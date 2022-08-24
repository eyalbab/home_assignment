const fs = require('fs');
const readline = require('readline');
const moment = require('moment');
const { AVLTree } = require('binary-search-tree');
const TrieSearch = require('trie-search');

const DB_FILE_NAME = "data.csv";

const userByIdMap = {};
const usersByCountryMapIndex = new Map();
const agesTreeIndex = new AVLTree({ unique: false });
const namesTrieIndex = new TrieSearch('name', { min: 3, ignoreCase: true, splitOnRegEx: false });

async function init() {
  const filestream = fs.createReadStream(DB_FILE_NAME);

  const rl = readline.createInterface({
    input: filestream,
    crlfDelay: Infinity
  });

  let isFirstLine = true;
  for await (const line of rl) {

    // First line contains headers
    if (isFirstLine) {
      isFirstLine = false;
      continue;
    }

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
  userByIdMap[id] = { id, email, name, birthday, countryCode };
  addUserToCountryIndex(id, countryCode);
  addUserToAgeTreeIndex(id, birthday);
  addUserToNameIndex(id, name);

}

function addUserToCountryIndex(id, countryCode) {
  if (usersByCountryMapIndex.has(countryCode)) {
    usersByCountryMapIndex.get(countryCode).push(id);
  } else {
    usersByCountryMapIndex.set(countryCode, [id]);
  }
}

function addUserToAgeTreeIndex(id, birthday) {
  const birthdayUnixTime = moment(birthday, 'DD/MM/YYYY').unix();
  agesTreeIndex.insert(birthdayUnixTime, id);
}

function addUserToNameIndex(id, name) {
  const nameSplit = name.split(" ");
  const fName = nameSplit[0];
  const lName = nameSplit[1];
  namesTrieIndex.map(name, id);
  if (fName.valueOf() !== lName.valueOf())    // for cases e.g Jacob Jacob
    namesTrieIndex.map(lName, id);
}

function getUserById(id) {
  return userByIdMap[id];
}

function getUsersByCountry(countryCode) {
  return usersByCountryMapIndex.get(countryCode)
    .map(id => getUserById(id));
}

function getUsersByAge(age) {
  age = Number(age);
  const lowerBoundUnix = moment().startOf('day').subtract(age + 1,
    'years').unix();
  const upperBoundUnix = moment().startOf('day').subtract(age, 'years').unix();
  const usersByAgeIds = agesTreeIndex.betweenBounds(
    { $lte: upperBoundUnix, $gt: lowerBoundUnix });
  return usersByAgeIds.map(id => getUserById(id));
}

function getUsersByName(name) {
  const usersByNameIds = namesTrieIndex.search(name);
  return usersByNameIds.filter(id => getUserById(id) != null).map(id => getUserById(id));
}

function deleteUser(id) {
  const userDetails = getUserById(id);
  deleteUserFromCountryIndex(id, userDetails['countryCode']);
  deleteUserFromAgesIndex(id, userDetails['birthday']);
  delete userByIdMap[id];

}

function deleteUserFromCountryIndex(id, countryCode) {
  let countryUsersIds = usersByCountryMapIndex.get(countryCode);
  usersByCountryMapIndex.set(countryCode, countryUsersIds.filter(IdItr => IdItr !== id));
}

function deleteUserFromAgesIndex(id, birthday) {
  let birthdayUnixTime = moment(birthday, 'DD/MM/YYYY').unix();
  agesTreeIndex.delete(birthdayUnixTime, id);
}

module.exports = {
  init,
  getUserById,
  getUsersByCountry,
  getUsersByAge,
  getUsersByName,
  deleteUser
}