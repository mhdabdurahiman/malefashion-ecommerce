const express = require("express");
const app = express();
const path = require('path');
const nocache = require('nocache')
const dbConnect = require('./config/dbConnect')
const session = require('express-session');
const userRoute = require('./routes/userRoute');
const adminRoute = require('./routes/adminRoute');
const morgan = require('morgan');
const flash = require('connect-flash');


const port = process.env.PORT || 3000;


app.use(express.static('./public'));
app.use(morgan('tiny'));

// db connection
dbConnect();

// nocache
app.use( nocache() )

// session
app.use( session ({

    resave : false,
    secret : 'sdfsdfsd',
    saveUninitialized: false
    
}))

// Configuring flash middleware
app.use(flash());


// User Route

app.use('/',userRoute);

// Admin Route

app.use('/admin',adminRoute);

app.listen(port, () => {
    console.log(`Server started...! Access your website at http://localhost:${port}`);
})