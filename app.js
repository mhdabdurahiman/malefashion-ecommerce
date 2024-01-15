const express = require("express");
const app = express();
const path = require('path')


const port = process.env.PORT || 3000;

app.use(express.static('./public'));


// User Route
const userRoute = require('./routes/userRoute');
app.use('/',userRoute)

app.listen(port, () => {
    console.log(`Server started...! Access your website at http://localhost:${port}`);
})