var chalk = require('chalk');

module.exports = function(request, response, next){
    var start  = +new Date(); //+ converts date to milliseconds
    var stream = process.stdout;
    var url = request.url;
    var method = request.method;

    response.on('finish', function(){
        var duration = +new Date() - start;
        stream.write(chalk.cyan(method) 
            + ' ' + chalk.grey(url) 
            + ' '+ chalk.yellow(duration + 'ms') + '\n');
    })

    next();
}