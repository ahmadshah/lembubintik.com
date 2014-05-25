var should = require('should'),
    content = require('../../lib/content');

describe('Content', function() {
    describe('load', function() {
        it('should return false when file not found', function() {
            content.load('pages', 'FOO').should.be.false;
            content.load('posts', 'FOO').should.be.false;
            content.load('foobar', 'FOO').should.be.false;
        });
        it('should return array when file is found', function() {
            content.load('pages', 'about').should.be.instanceOf(Array);
            content.load('posts', 'orchestra/hello-world').should.be.instanceOf(Array);
        });
    });
});
