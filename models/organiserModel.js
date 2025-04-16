//Used to create the database
const Datastore = require("gray-nedb");
//bcrypt is used for password hashing
const bcrypt = require('bcrypt');
//Sets number of salt rounds for bcrypt hashing
const saltRounds = 10;
//Used by node to read the filesystem
const fs = require('fs');

class organiserDAO{
    constructor(dbFilePath) {
        if (dbFilePath && !fs.existsSync(dbFilePath)) {
            // Check if the database file exists before creating datastore
            console.log("Database file not found, running init...");
            this.db = new Datastore({ filename: dbFilePath, autoload: true });
            this.init(); // Initialise the database if file doesn't exist
        } else {
            // File exists or no dbFilePath is provided
            this.db = new Datastore({ filename: dbFilePath, autoload: true });
            console.log("DB connected to " + dbFilePath);
        }
    }
    //init is being used to insert the admin account
    init(){
        this.db.insert({
            username: 'admin',
            password: '$2a$10$iPdRofLtpdX6AktgutC6FO.CCLgwdfwKPA2lcOKgzBs3svuaapXvy'
        });
        return this;
    }
    //This function creates a new organiser using username and password
    create(username, password) {
        const that = this;
        //Hashes the password using the saltrounds and then stores username and password in the model
        bcrypt.hash(password, saltRounds).then(function(hash) {
            var entry = {
                username: username,
                password: hash,
            };
            that.db.insert(entry, function (err) {
            //Display error if insertion failed
            if (err) {
            console.log("Can't insert user: ", username);
            }
            });
        });
    }
    //This function is used to find a specific organiser 
    lookup(organiser, cb) {
        this.db.find({'username': organiser}, function (err, entries) {
        if (err) {
            return cb(null, null);
        } else {
            //Return null if organiser isn't found
            if (entries.length == 0) {
                return cb(null, null);
            }
                //Return the found organiser if succesful
                return cb(null, entries[0]);
            }
        });
    }
    //This function gets all organisers from the model
    getAllOrganisers() {
        return new Promise((resolve, reject) => {
            this.db.find({}, function (err, organisers) {
                // If error occurs reject the Promise
                if (err) {
                    reject(err);
                    //If succesful, pass the required organisers out of the function
                } else {
                    resolve(organisers); 
                    console.log("function getAllOrganisers returns:", organisers); 
                }
            });
        });
    }
    
    //This function is used to delete an organiser using their username
    deleteOrganiser(username) {
        return new Promise((resolve, reject) => {
            this.db.remove({ username: username }, {}, function (err, numRemoved) {
                // If error occurs reject the Promise
                if (err) {
                    reject(err);
                } else {
                    //Returns how many organisers were deleted and what their usernames were
                    resolve(numRemoved); 
                    console.log(`function deleteOrganiser removed ${numRemoved} organiser(s) with username: ${username}`);
                }
            });
        });
    }
    
}



const dao = new organiserDAO("organisers.db");

module.exports = dao;