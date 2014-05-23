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

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Extract markdown file
 * 
 * @param  string type
 * @param  string filename
 * @return array
 */
function extract(type, filename) {
    var contentPath = path.join(__dirname, '_contents/' + type + '/' + filename + '.md'),
        source = fs.readFileSync(contentPath).toString(),
        content = '';
    //split content into arrays
    content = source.split(/[\n]*[-]{3}[\n]/g);
    content.shift();

    return content;
}

/**
 * Get content metadata
 * 
 * @param  string
 * @return mixed
 */
function getMetadata(source) {
    return source;
}

/**
 * Get HTML content from Markdown
 * 
 * @param  string source
 * @return string
 */
function getHtmlContent(source) {
    return markdown.toHTML(source);
}

/* ROUTES */
app.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

app.get('/:page_name', function(req, res) {
    var source = extract('pages', req.params.page_name),
        meta = getMetadata(source[0]),
        content = getHtmlContent(source[1]);

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
