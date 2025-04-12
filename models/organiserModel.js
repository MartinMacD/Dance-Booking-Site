const Datastore = require("gray-nedb");
const bcrypt = require('bcrypt');
const saltRounds = 10;

class organiserDAO{
    constructor(dbFilePath) {
        if (dbFilePath) {
            //embedded
            this.db = new Datastore({ filename: dbFilePath,
            autoload: true });
        } else {
            //in memory
            this.db = new Datastore();
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
}

const dao = new organiserDAO("organisers.db");
dao.init();

module.exports = dao;