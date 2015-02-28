var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var argv = require('minimist')(process.argv.slice(2));
var chalk = require('chalk');

var logger = require('./logger');
logger.setOptions({
    apiLatency: argv.latency,
    groupRequestsMadeInBetween: argv.grouping,
    logBody: argv.logBody
});;
var router = require('./ingenio-proto-api-router');

var port = 3008;

var corsSettings = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST,GET,OPTIONS,PUT,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-EpcApi-ID');
    next();
};

app.use(bodyParser.json()); //to parse json from incoming requests to req.body
app.use(logger); //custom logger to log all requests made to console
app.use(corsSettings); //allowing cross-domain requests
app.use(router);

//logging syntax sugar
var log = console.log.bind(console);

var apiLatency = argv.latency || 0;
var grouping = argv.grouping || 200;

app.listen(port, function() {
    if (apiLatency > 0) {
        log(chalk.green('Running API Server with artificial latency ') 
            +  chalk.grey(apiLatency + 'ms')
            + ' at ' 
            + chalk.yellow('localhost:' + port + '...'));
    } else {
        log(chalk.green('Running API Server at ') 
            + chalk.yellow('localhost:' + port + '...'));
    }

    if (grouping > 0) {
        log(chalk.grey(' grouping requests happened in-between ')
            + chalk.white(grouping + 'ms'));
    }
    
});