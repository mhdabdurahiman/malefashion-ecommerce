const express = require("express");
const app = express();
const path = require('path');
const dbConnect = require('./config/dbConnect')
const userRoute = require('./routes/userRoute');


const port = process.env.PORT || 3000;

app.use(express.static('./public'));

// db connection
dbConnect();

// User Route

app.use('/',userRoute)

app.listen(port, () => {
    console.log(`Server started...! Access your website at http://localhost:${port}`);
})