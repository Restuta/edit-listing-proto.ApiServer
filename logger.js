var chalk = require('chalk');
var util = require('util') //node utils

var lastApiCallDate = null;
var options = {
    apiLatency: 0,
    groupRequestsMadeInBetween: 200, //will group requests made in between 200ms by default
    logBody: false
};

var logJson = function(object) {
    var json = util.inspect(object, {
        depth: 3,
        colors: true
    }).trim();

    if (json != '{}' && json != '' && json != 'undefined' && typeof json != 'undefined') {
        process.stdout.write(chalk.white(json) + '\n');    
    }
};

function isEmpty(obj) {
  return !Object.keys(obj).length;
}

module.exports = function(request, response, next){
    var start  = +new Date(); //+ converts date to milliseconds
    var stream = process.stdout;
    var url = request.url;
    var method = request.method;

    response.on('finish', function(){
        var status = response.statusCode;

        var now = +new Date();
        var timePassedFromLastCall = 0;

        if (lastApiCallDate) {
            timePassedFromLastCall = (now - lastApiCallDate);
        }

        var duration = now - start;

        /*if no calls were made during last 2000ms print separator, 
            so it's easier to visually distinguish calls that were made at similar times */

        var colorStatusByType = function(status) {
            var coloredStatus = chalk.green(status);;

            if (status >= 300 && status <= 499) {
                coloredStatus = chalk.yellow(status);
            } 
            
            if (status >= 500) {
                coloredStatus = chalk.red(status);
            }

            return coloredStatus;
        }

        stream.write(
            (timePassedFromLastCall > options.groupRequestsMadeInBetween  
                ? '\n'
                : '')
            + chalk.cyan(method) 
            + ' ' + colorStatusByType(status)
            + ' ' + chalk.grey(url) 
            + ' ' + chalk.yellow(duration + 'ms')
            + ' ' + chalk.grey(timePassedFromLastCall + 'ms')
            + '\n');

        lastApiCallDate = +new Date();

        if (options.logBody && !isEmpty(request.body)) {
            logJson(request.body);    
        }
    })

    setTimeout(function() {
        next();
    }, options.apiLatency);
    
}

module.exports.setOptions = function(configOptions) {
    options = configOptions;

    options.apiLatency = options.apiLatency || 0;

    if (!options.groupRequestsMadeInBetween) {
        var defaultGroupingTime = 200;

        options.groupRequestsMadeInBetween = options.apiLatency > 0 
            ? options.apiLatency + defaultGroupingTime
            : defaultGroupingTime; 
    }

    if (configOptions.logBody && configOptions.logBody === true) {
        options.logBody = true;
    }
    
}