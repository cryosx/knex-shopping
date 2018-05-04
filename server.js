const express = require('express');
const bodyParser = require('body-parser');

const routes = require('./routes');

const PORT = process.env.PORT || 3000;

const server = express();

// STATIC FOLDER
server.use(express.static('public'));

// BODY PARSING
server.use(bodyParser.urlencoded({ extended: true }));

// ROUTING
server.use('/', routes);

server.listen(PORT, err => {
  console.log(`Server listening on port: ${PORT}`);
});
