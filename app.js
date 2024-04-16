const express = require("express");
const app = express();
require( 'dotenv' ).config()
const nocache = require('nocache')
const dbConnect = require('./config/dbConnect')
const session = require('express-session');
const morgan = require('morgan');
const flash = require('connect-flash');
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const fetchCartCount = require("./middleware/cartItemCountMiddleware");
const localsMiddleware = require('./middleware/localsMiddleware');

// Requiring route files
const userRoute = require('./routes/userRoute');
const adminRoute = require('./routes/adminRoute');
const shopRoute = require('./routes/shopRoute');
const authRoute = require('./routes/authRoute');
const errorRoute = require('./routes/errorRoute');

const port = process.env.PORT || 3000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static('./public'));
app.use(morgan('tiny'));

// db connection
dbConnect();

// nocache
app.use( nocache() )

// session
app.use( session ({

    resave : false,
    secret : process.env.USER_SESSION_SECRET,
    saveUninitialized: false
    
}))

// Configuring flash middleware
app.use(flash());

app.use(fetchCartCount);

//locals middleware
app.use(localsMiddleware)

// Routes
app.use(authRoute);
app.use(shopRoute);
app.use('/user',userRoute);
app.use('/admin',adminRoute);
app.use(shopRoute);
app.use(errorRoute)

app.listen(port, () => {
    console.log(`Server started...! Access your website at http://localhost:${port}`);
})