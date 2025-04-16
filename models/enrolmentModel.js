const Datastore = require("gray-nedb");

class enrolmentDAO {
    constructor(dbFilePath) {
        // Create the Datastore instance
        this.db = new Datastore({ filename: dbFilePath, autoload: true });
      }

      //This function is used to add a new enrolment, takes in multiple fields as parameters
      addEnrolment(classID, courseID, name, email){
        var enrolment = {
            classID: classID || null,
            courseID: courseID || null,
            name: name,
            email: email,
            dateEnrolled: new Date()
        };
        console.log("Enrolment created", enrolment);
        //If there's an issue, display an error, if succesful, display success message
        this.db.insert(enrolment, function (err, db) {
            if (err) {
                console.log("Error inserting enrolment for", name);
            } else {
                console.log("Enrolment inserted into the database", db);
            }
        });
      }

      //This function gets enrolments using classID
      getEnrolmentsByClassID(classID) {
        return new Promise((resolve, reject) => {
            //Try and find the enrolment using the classID
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
    
    //This function gets enrolments using courseID
    getEnrolmentsByCourseID(courseID) {
        return new Promise((resolve, reject) => {
            //Try and find the enrolment using the courseID
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

    //This function gets enrolments using email
    getEnrolmentsByEmail(email) {
        return new Promise((resolve, reject) => {
            //Try and find the enrolment using the email
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
    