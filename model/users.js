const { parse } = require('csv-parse');
const fs = require('fs');
const dataFilePath = "data.csv";
const ID_PLACE = 0;

let csvData = [];
let idToUser = new Map();

function GetCsvData(id) {
    if (csvData.length !== 0)
        return csvData;
    fs.createReadStream(dataFilePath)
        .pipe(
            parse({
                delimiter: ','
            }))
        .on('data', function (dataRow) {
            csvData.push(dataRow);
        })
        .on('end', function () {
            BuildIdToUserMap(csvData);
        })
}

function BuildIdToUserMap(dataArr) {
    dataArr.forEach(row => {
        idToUser.set(row[ID_PLACE], row);
    });
    console.log(idToUser.get("9f38c275-2fa3-550b-b661-c7997de1b796"));
}

module.exports = {
    getUserById: async function (id) {
        console.log(`getUserById called with id: ${id}`);
        if (idToUser.size === 0) {
            if (csvData.length === 0) {
                 GetCsvData(id);
            }
        } 
        return idToUser.get(id);
    },

    getUsersByAge: async function (age) {
        console.log(`getUsersByAge called with age: ${age}`);

        // Add implementation here

        return [];
    },

    getUsersByCountry: async function (country) {
        console.log(`getUsersByCountry called with country: ${country}`);

        // Add implementation here

        return [];
    },

    getUsersByName: async function (name) {
        console.log(`searchUsersByName called with name: ${name}`);

        // Add implementation here

        return [];
    },

    deleteUser: async function (id) {
        console.log(`deleteUser called with id: ${id}`);
        // Add implementation here

        return;
    }
}