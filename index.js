const express = require('express');
const app = express(); //Instantiate express 
require('dotenv').config() // loads data from .env file

//Used to parse cookies in requests
const cookieParser = require('cookie-parser')
app.use(cookieParser())

//Used to parse url encoded data 
app.use(express.urlencoded({
  //Allows for omplex objects to be encoded
    extended: true
  }))

//Instantiate path to allow for handling file paths
const path = require('path');

//Direct express to serve static files from the public folder
const public = path.join(__dirname,'public');
app.use(express.static(public));

//Used to enable bootstrap
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); 

//Instantiate mustache for rendering templates
const mustache = require('mustache-express');
app.engine('mustache', mustache());
app.set('view engine', 'mustache'); //Set mustache as the default view engine

//Use publicroutes to handle url requests
const router = require('./routes/publicRoutes');
app.use('/', router);

//Start the server and listen on port 3000
app.listen(process.env.PORT ||3000, () => {
    console.log('Server started. Ctrl^c to quit.');
    })  