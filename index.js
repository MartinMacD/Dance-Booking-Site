const express = require('express');
const app = express();
app.use(express.urlencoded({ extended: false }));

const path = require('path');
const public = path.join(__dirname,'public');
app.use(express.static(public));

const publicRoutes = require('./routes/publicRoutes');
app.use('/', publicRoutes); 

app.listen(3000, () => {
    console.log('Server started on port 3000. Ctrl^c to quit.');
})