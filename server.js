var express = require('express'),
    config = require('./config/config'),
    log = require('winston'),
    app = express();

app.set('views', config.view.directory);
app.set('view engine', config.view.engine);

app.use(require('less-middleware')(config.view.static));
app.use(express.static(config.view.static));

config.routes.forEach(function(route) {
    require(route)(app);
});

/**
 * Error page handling
 */
if (config.env === 'local') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(config.port, function() {
    log.info('Application is running on port' + config.port);
});
