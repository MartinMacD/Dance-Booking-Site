const Datastore = require("gray-nedb");
const bcrypt = require('bcrypt');
const saltRounds = 10;
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

    init(){
        this.db.insert({
            username: 'admin',
            password: '$2a$10$iPdRofLtpdX6AktgutC6FO.CCLgwdfwKPA2lcOKgzBs3svuaapXvy'
        });
        return this;
    }
    create(username, password) {
        const that = this;
        bcrypt.hash(password, saltRounds).then(function(hash) {
            var entry = {
                username: username,
                password: hash,
            };
            that.db.insert(entry, function (err) {
            if (err) {
            console.log("Can't insert user: ", username);
            }
            });
        });
    }
    lookup(organiser, cb) {
        this.db.find({'username': organiser}, function (err, entries) {
        if (err) {
            return cb(null, null);
        } else {
            if (entries.length == 0) {
                return cb(null, null);
            }
                return cb(null, entries[0]);
            }
        });
    }
    getAllOrganisers() {
        return new Promise((resolve, reject) => {
            this.db.find({}, function (err, organisers) {
                // If error occurs reject the Promise
                if (err) {
                    reject(err);
                } else {
                    resolve(organisers); // Resolve with data
                    console.log("function getAllOrganisers returns:", organisers); // Log for debugging
                }
            });
        });
    }
    
    deleteOrganiser(username) {
        return new Promise((resolve, reject) => {
            this.db.remove({ username: username }, {}, function (err, numRemoved) {
                // If error occurs reject the Promise
                if (err) {
                    reject(err);
                } else {
                    resolve(numRemoved); // Resolve with number of documents removed
                    console.log(`function deleteOrganiser removed ${numRemoved} organiser(s) with username: ${username}`);
                }
            });
        });
    }
    
}



const dao = new organiserDAO("organisers.db");

module.exports = dao;