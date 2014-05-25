var fs = require('fs'),
    path = require('path'),
    log = require('winston'),
    markdown = require('markdown').markdown,
    config = require('../config/config');

var content = {

    load: function(type, filename) {
        var source = config.blog.contentDirectory + '/' + type + '/' + filename + '.md',
            content = '';

        try {
            var source = fs.readFileSync(source).toString();
            //split content into arrays
            content = source.split(/[\n]*[-]{3}[\n]/);
            content.shift();

            return content;
        } catch (err) {
            if (err.code === 'ENOENT') {
                log.error('Unable to load ' + source);
                return false;
            } else {
                throw err;
            }
        }
    },

    getMetadata: function (source) {
        var raw = source.split(/\n/g),
            meta = {};

        raw.forEach(function(v, k, array) {
            var splits = v.split(/(:)/);
            meta[splits[0]] = splits[2].trim();
        });

        return meta;
    },

    getHtmlContent: function (source) {
        var raw = source.split(/(<!--readmore-->)/),
            content = [];

        raw.forEach(function(v, k, array) {
            if (v !== '<!--readmore-->') {
                content.push(markdown.toHTML(v));
            }
        });

        return content;
    }

};

module.exports = content;
