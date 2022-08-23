const database = require('../database/dataProvider');

module.exports = {
    getUserById: async function(id){
        console.log(`getUserById called with id: ${id}`);

        return database.getUserById(id);
    },

    getUsersByAge: async function(age) {
        console.log(`getUsersByAge called with age: ${age}`);

        return database.getUsersByAge(age);
    },

    getUsersByCountry: async function(country) {
        console.log(`getUsersByCountry called with country: ${country}`);

        return database.getUserByCountry(country);

        return [];
    },

    getUsersByName: async function(name) {
        console.log(`searchUsersByName called with name: ${name}`);

        // Add implementation here

        return [];
    },

    deleteUser: async function(id) {
        console.log(`deleteUser called with id: ${id}`);
        // Add implementation here

        return;
    }
}