var express = require('express'),
    fs = require('fs'),
    path = require('path'),
    markdown = require('markdown').markdown,
    router = express.Router();

function getContent(type, filename) {
    var contentPath = path.join(__dirname, '../_contents/' + type + '/' + filename + '.md');
    var source = fs.readFileSync(contentPath, 'utf8');
    var content = markdown.toHTML(source);

    return content;
}

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/:page_name', function(req, res) {
    var content = getContent('pages', req.params.page_name);

    res.render('page', { page: content });
});

module.exports = router;
