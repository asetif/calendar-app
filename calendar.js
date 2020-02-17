//impport
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var apiRouter = require('./apiRouter').router;
//instantiat server
var server =express();

server.use(cors())

//body parser configuration
server.use(bodyParser.urlencoded({ extended: true}));
server.use(bodyParser.json());
//configure route

server.get('/', function (req, res){
    res.setHeader('content-Type', 'text/html' );
    res.status(200).send('<h1>Hello</h1>');
});

server.use('/api', apiRouter);
server.listen(8080, function(){
    console.log('server on écoute');
});

