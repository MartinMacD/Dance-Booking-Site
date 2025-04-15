const Datastore = require("gray-nedb");

class enrolmentDAO {
    constructor(dbFilePath) {
        this.db = new Datastore({ filename: dbFilePath, autoload: true });
      }

      addEnrolment(classID, courseID, name, email){
        var enrolment = {
            classID: classID || null,
            courseID: courseID || null,
            name: name,
            email: email,
            dateEnrolled: new Date()
        };
        console.log("Enrolment created", enrolment);
        this.db.insert(enrolment, function (err, db) {
            if (err) {
                console.log("Error inserting enrolment for", name);
            } else {
                console.log("Enrolment inserted into the database", db);
            }
        });
      }

      getEnrolmentsByClassID(classID) {
        return new Promise((resolve, reject) => {
            this.db.find({ classID: classID }, function (err, enrolments) {
                if (err) {
                    reject(err);
                } else {
                    resolve(enrolments);
                    console.log("getEnrolmentsByClassID returns:", enrolments);
                }
            });
        });
    }
    
    
    getEnrolmentsByCourseID(courseID) {
        return new Promise((resolve, reject) => {
            this.db.find({ courseID: courseID }, function (err, enrolments) {
                if (err) {
                    reject(err);
                } else {
                    resolve(enrolments);
                    console.log("getEnrolmentsByCourseID returns:", enrolments);
                }
            });
        });
    }

    getEnrolmentsByEmail(email) {
        return new Promise((resolve, reject) => {
            this.db.find({ email: email }, function (err, enrolments) {
                if (err) {
                    reject(err);
                } else {
                    resolve(enrolments);
                    console.log("getEnrolmentsByEmail returns:", enrolments);
                }
            });
        });
    }
 }

 module.exports = enrolmentDAO;
    