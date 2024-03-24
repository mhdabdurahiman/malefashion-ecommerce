const errorController = require('../controllers/errorController')

const express = require('express');
const errorRoute = express();

errorRoute.get("/error404", errorController.loadError404);
errorRoute.get("/error500", errorController.loadError500);

module.exports = errorRoute;