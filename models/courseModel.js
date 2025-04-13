const Datastore = require("gray-nedb");
class courseDAO {
    constructor(dbFilePath) {
        if (dbFilePath) {
            //embedded
            this.db = new Datastore({ filename: dbFilePath, autoload: true });
            console.log('DB connected to ' + dbFilePath);
        } else {
            //in memory
            this.db = new Datastore();
        }
    }

    init(){
        this.db.insert({
            id: '001',
            name: 'Dance class',
            duration: '2 weeks'
        })
        console.log('db inserted dance class');
    }
    addCourse(id, name, duration) {
        var course = {
            id: id,
            name: name,
            duration: duration
        }
        console.log('course created', course);
        this.db.insert(course, function (err, doc) {
            if (err) {
                console.log('Error inserting document', name);
            } else {
                console.log('document inserted into the database', doc);
            }
        })
    }

    getAllCourses() {
        return new Promise((resolve, reject) => {
            //use the find() function of the database to get the data,
            //error first callback function, err for error, entries for data
            this.db.find({}, function (err, courses) {
                //if error occurs reject Promise
                if (err) {
                    reject(err);
                    //if no error resolve the promise & return the data
                } else {
                    resolve(courses);
                    //to see what the returned data looks like
                    console.log('function all() returns: ', courses);
                }
            })
        })
    }

    getCourseByName(courseName){
        return new Promise((resolve, reject) => {
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

}

module.exports = courseDAO;