var express = require('express'),
    fs = require('fs'),
    path = require('path'),
    markdown = require('markdown').markdown,
    logger = require('morgan'),
    bodyParser = require('body-parser'),
    app = express();

app.locals = {
    blogTitle: 'Lembubintik.com',
};


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

function getContent(type, filename) {
    var contentPath = path.join(__dirname, '_contents/' + type + '/' + filename + '.md'),
        source = fs.readFileSync(contentPath, 'utf8'),
        content = markdown.toHTML(source);

    return content;
}

/* ROUTES */
app.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

app.get('/:page_name', function(req, res) {
    var content = getContent('pages', req.params.page_name);

    res.render('page', { page: content });
});


/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
