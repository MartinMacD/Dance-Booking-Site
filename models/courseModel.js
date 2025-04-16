const Datastore = require("gray-nedb");
//Used by node to read the filesystem
const fs = require("fs");

class courseDAO {
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

    //init is being used to insert placeholder data
    init(){
        this.db.insert({
            courseID: 'co001',
            name: 'Dance course 1',
            duration: '12 weeks'
        })
        this.db.insert({
            courseID: 'co002',
            name: 'Dance course 2',
            duration: '12 weeks'
        })
        console.log('db inserted dance course');
    }

    //This function is used to add a new course, takes in multiple fields as parameters
    addCourse(courseID, name, duration) {
        var course = {
            courseID: courseID,
            name: name,
            duration: duration
        }
        console.log('course created', course);
        //Display success or failure in console
        this.db.insert(course, function (err, doc) {
            if (err) {
                console.log('Error inserting document', name);
            } else {
                console.log('document inserted into the database', doc);
            }
        })
    }

    //This function is used to get all courses from the model
    getAllCourses() {
        return new Promise((resolve, reject) => {
            this.db.find({}, function (err, courses) {
                //if error occurs reject Promise
                if (err) {
                    reject(err);
                    //if no error resolve the promise & return the data
                } else {
                    resolve(courses);
                    //to see what the returned data looks like
                    console.log('function getallcourses returns: ', courses);
                }
            })
        })
    }

    //This function is used to get a specific course from the model using course name
    getCourseByName(courseName){
        return new Promise((resolve, reject) => {
            //Attempt to find the course specified
            this.db.find({ 'name': courseName }, function (err, course) {
                if (err) {
                    reject(err);
                } else {
                    resolve(course);
                    console.log('getCourseByName returns: ', course);
                }
            })
        })
    }

    //This function is used to delete a specific course using course ID
    deleteCourse(courseID) {
        return new Promise((resolve, reject) => {
            //Attempt to delete the course specified
          this.db.remove({ courseID: courseID }, {}, (err, numRemoved) => {
            if (err) {
              reject(err);
            } else {
              console.log(`Deleted ${numRemoved} course(s) with courseID ${courseID}`);
              resolve(numRemoved); 
            }
          });
        });
      }
    }

module.exports = courseDAO;