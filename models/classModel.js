const Datastore = require("gray-nedb");
//Used by node to read the filesystem
const fs = require("fs");

class classDAO {
    constructor(dbFilePath) {
        // Check if the database file exists before creating datastore
        if (dbFilePath && !fs.existsSync(dbFilePath)) {
            console.log("Database file not found, running init");
            // Create the Datastore instance if file doesn't exist
            this.db = new Datastore({ filename: dbFilePath, autoload: true });
            this.init(); // Initialize the database if file doesn't exist
        } else {
            // File exists or no dbFilePath is  provided
            this.db = new Datastore({ filename: dbFilePath, autoload: true });
            console.log("DB connected to " + dbFilePath);
        }
    }

    init(){
        this.db.insert({
            classID: 'cl001',
            courseID: 'co001',
            name: 'Dance class',
            date: 'Thursday',
            time: '3 pm',
            description: 'Dance class test',
            location: 'Glasgow',
            price: '£5'
        })
        this.db.insert({
            classID: 'cl002',
            courseID: 'co001',
            name: 'Dance class2',
            date: 'Wednesday',
            time: '3 pm',
            description: 'Dance class test',
            location: 'Glasgow',
            price: '£5'
        })
        console.log('db inserted dance class');
    }

    addClass(classID, courseID, name, date, time, description, location, price) {
        //Not allowed to call a variable class so called classHolder instead
        var classHolder = {
            classID: classID,
            courseID: courseID,
            name: name,
            date: date,
            time: time,
            description: description,
            location: location,
            price: price
        }
        console.log('Class created', classHolder);
        this.db.insert(classHolder, function (err, doc) {
            if (err) {
                console.log('Error inserting document', name);
            } else {
                console.log('document inserted into the database', doc);
            }
        })
    }

    getAllClasses() {
        return new Promise((resolve, reject) => {
            this.db.find({}, function (err, classes) {
                //if error occurs reject Promise
                if (err) {
                    reject(err);
                    //if no error resolve the promise & return the data
                } else {
                    resolve(classes);
                    //to see what the returned data looks like
                    console.log('function getAllClasses returns: ', classes);
                }
            })
        })
    }

    getClassesByCourseId(courseId) {
        return new Promise((resolve, reject) => {
            console.log("Getting classes for courseId:", courseId); // Ensure this is correctly passed
            
            this.db.find({ courseID: courseId }, function (err, classes) {
                if (err) {
                    reject(err);
                } else {
                    console.log("Classes received for courseID:", courseId, ":", classes);
                    resolve(classes);
                }
            });
        });
    }
    
    getClassById(classId) {
        return new Promise((resolve, reject) => {
            this.db.findOne({ id: classId }, function (err, classSession) {
                if (err) {
                    reject(err);
                } else {
                    resolve(classSession);
                    console.log("getClassById returns:", classSession);
                }
            });
        });
    }
    
}
module.exports = classDAO;