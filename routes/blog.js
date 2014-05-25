var contentLib = require('../lib/content');

function initialize(app) {
    app.get('/', index);
    app.get('/:page_name', showPage);
    app.get('/:category/:article', showPost);
}

function index(req, res) {
    res.render('index', {
        title: 'Lembubintik'
    });
}

function showPage(req, res, next) {
    var filename = req.params.page_name,
        source = contentLib.load('pages', filename);

    if ( ! source) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    }

    var meta = contentLib.getMetadata(source[0]),
        content = contentLib.getHtmlContent(source[1]);

    res.render('blog/page', { meta: meta, content: content });
}

function showPost(req, res, next) {
    var filename = req.params.category + '/' + req.params.article,
        source = contentLib.load('posts', filename);

    if ( ! source) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    }

    var meta = contentLib.getMetadata(source[0]),
        content = contentLib.getHtmlContent(source[1]);

    res.render('blog/post', { 
        meta: meta,
        content:  {
            excerpt: content[0],
            fullContent: content[1]
        }
    });
}

module.exports = initialize;
