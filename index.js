require('dotenv').config();

// Setting up express
const express = require('express');
const app = express();
const router = require('./routes/routes')

// Setting up body-parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded( { extended: false } ));
app.use(bodyParser.json());

// Redirects all routes to the router
app.use('/api', router);

// Setting up server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
})