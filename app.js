var express = require('express'),
    fs = require('fs'),
    path = require('path'),
    markdown = require('markdown').markdown,
    logger = require('morgan'),
    app = express();

app.locals = {
    blogTitle: 'Lembubintik.com',
};

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
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
    content = source.split(/[\n]*[-]{3}[\n]/);
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
    var raw = source.split(/\n/g),
        meta = {};

    raw.forEach(function(v, k, array) {
        var splits = v.split(/(:)/);
        meta[splits[0]] = splits[2].trim();
    });

    return meta;
}

/**
 * Get HTML content from Markdown
 * 
 * @param  string source
 * @return string
 */
function getHtmlContent(source) {
    var raw = source.split(/(<!--readmore-->)/),
        content = [];

    raw.forEach(function(v, k, array) {
        if (v !== '<!--readmore-->') {
            content.push(markdown.toHTML(v));
        }
    });

    return content;
}

/**
 * GET main page route
 */
app.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/**
 * GET page name route
 */
app.get('/:page_name', function(req, res) {
    var source = extract('pages', req.params.page_name),
        meta = getMetadata(source[0]),
        content = getHtmlContent(source[1]);

    res.render('page', { meta: meta, content: content });
});
    
/**
 * GET articles route
 */
app.get('/:category/:post_title', function(req, res) {
    var source = extract('posts', req.params.category + '/' + req.params.post_title),
        meta = getMetadata(source[0]),
        content = getHtmlContent(source[1]);

    res.render('post', { 
        meta: meta, 
        content: {excerpt: content[0], fullContent: content.join('')} 
    });
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
