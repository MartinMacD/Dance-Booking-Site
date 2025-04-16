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
            this.init(); // Initialise the database if file doesn't exist
        } else {
            // File exists or no dbFilePath is provided
            this.db = new Datastore({ filename: dbFilePath, autoload: true });
            console.log("DB connected to " + dbFilePath);
        }
    }

    init(){
        this.db.insert({
            classID: 'cl001',
            courseID: 'co001',
            name: 'Aerobics Class',
            date: 'Thursday, 24th April 2025',
            time: '3 pm',
            description: 'Come and join us for aerobics!',
            location: 'Glasgow',
            price: '£5'
        })
        this.db.insert({
            classID: 'cl002',
            courseID: 'co001',
            name: 'Ballet Class',
            date: 'Wednesday, 23rd April 2025',
            time: '3 pm',
            description: 'Learn how to ballet!',
            location: 'Glasgow',
            price: '£5'
        })
        this.db.insert({
          classID: 'cl003',
          courseID: '',
          name: 'Ballroom Dancing Class',
          date: 'Friday, 25th April 2025',
          time: '6 pm',
          description: 'We will explain how ballroom dancing works.',
          location: 'Glasgow',
          price: '£10'
        })
        this.db.insert({
          classID: 'cl004',
          courseID: '',
          name: 'Salsa Class',
          date: 'Wednesday, 23rd April 2025',
          time: '4 pm',
          description: 'Come learn how to salsa.',
          location: 'Glasgow',
          price: '£15'
        })
        this.db.insert({
          classID: 'cl005',
          courseID: '',
          name: 'Contemporary Dance Class',
          date: 'Wednesday, 23rd April 2025',
          time: '10 am',
          description: 'Learn the modern dances of today.',
          location: 'Glasgow',
          price: '£10'
        })
        this.db.insert({
          classID: 'cl006',
          courseID: 'co002',
          name: 'Tap dance class',
          date: 'Wednesday, 30th April 2025',
          time: '9 pm',
          description: 'Come tap with us!.',
          location: 'Glasgow',
          price: '£10'
        })
        console.log("db inserted dance class");
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
                console.log("Error inserting document", name);
            } else {
                console.log("document inserted into the database", doc);
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
                    console.log("function getAllClasses returns: ", classes);
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
            this.db.findOne({ classID: classId }, function (err, classSession) {
                if (err) {
                    reject(err);
                } else {
                    resolve(classSession);
                    console.log("getClassById returns:", classSession);
                }
            });
        });
    }

    deleteClass(classID) {
        return new Promise((resolve, reject) => {
          this.db.remove({ classID: classID }, {}, function (err, numRemoved) {
            if (err) {
              reject(err);
            } else {
                console.log(`Class with classID ${classID} deleted`);
              resolve(numRemoved);
            }
          });
        });
      }

      deleteClassesByCourseId(courseID) {
        return new Promise((resolve, reject) => {
          this.db.remove({ courseID: courseID }, { multi: true }, (err, numRemoved) => {
            if (err) {
              reject(err);
            } else {
              console.log(`Deleted ${numRemoved} classes for course ${courseID}`);
              resolve(numRemoved);
            }
          });
        });
      }

      updateClass(classID, updatedData) {
        return new Promise((resolve, reject) => {
          this.db.update({ classID: classID }, { $set: updatedData }, {}, (err, numReplaced) => {
            if (err) {
              reject(err);
            } else {
              console.log(`Updated ${numReplaced} classes with classID ${classID}`);
              resolve(numReplaced);
            }
          });
        });
      }
      
    
}
module.exports = classDAO;